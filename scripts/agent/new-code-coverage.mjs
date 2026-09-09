/**
 * Fail if new production source is under 80% Jest coverage.
 * New files: whole-file statements and branches.
 * Modified files: statements and branches that start on added lines.
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const COVERAGE_THRESHOLD = 80;

const SOURCE = /\.(ts|tsx|js|jsx|mjs)$/;
const SKIP = new RegExp(
  String.raw`\.(spec|test|cy)\.[^.]+$|/testUtils/|^cypress/|^(docs|coverage)/|^scripts/agent/(?!new-code-coverage\.mjs$)`,
);

export function isCoveredSourceFile(name) {
  return SOURCE.test(name) && !SKIP.test(name);
}

export function percent(hits, total) {
  if (total === 0) return 100;
  return (hits / total) * 100;
}

/** Parse unified diffs (including -U0) into path → added line numbers. */
export function parseAddedLines(unifiedDiff) {
  const byFile = new Map();
  let file = null;
  let newLine = 0;

  for (const raw of unifiedDiff.split('\n')) {
    const fileMatch = raw.match(/^\+\+\+ b\/(.+)$/);
    if (fileMatch) {
      file = fileMatch[1];
      continue;
    }
    if (raw.startsWith('+++ /dev/null')) {
      file = null;
      continue;
    }

    const hunk = raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
    if (hunk) {
      newLine = Number(hunk[1]);
      continue;
    }

    if (!file) continue;

    if (raw.startsWith('+') && !raw.startsWith('+++')) {
      if (!byFile.has(file)) byFile.set(file, new Set());
      byFile.get(file).add(newLine);
      newLine += 1;
    } else if (raw.startsWith('-') && !raw.startsWith('---')) {
      // old line only
    } else if (raw.startsWith('\\')) {
      // "\ No newline at end of file"
    } else {
      newLine += 1;
    }
  }

  return byFile;
}

export function findFileCoverage(coverageFinal, relativePath) {
  const suffix = `/${relativePath}`;
  for (const [key, value] of Object.entries(coverageFinal)) {
    if (
      key === relativePath ||
      key.endsWith(suffix) ||
      key.endsWith(relativePath)
    ) {
      return value;
    }
  }
  return null;
}

function statementHitsOnLines(fileCoverage, lineSet) {
  let total = 0;
  let hits = 0;
  for (const [id, loc] of Object.entries(fileCoverage.statementMap ?? {})) {
    const line = loc.start?.line;
    if (!lineSet.has(line)) continue;
    total += 1;
    if ((fileCoverage.s?.[id] ?? 0) > 0) hits += 1;
  }
  return { hits, total };
}

function branchHitsOnLines(fileCoverage, lineSet) {
  let total = 0;
  let hits = 0;
  for (const [id, loc] of Object.entries(fileCoverage.branchMap ?? {})) {
    const line = loc.loc?.start?.line ?? loc.locations?.[0]?.start?.line;
    if (!lineSet.has(line)) continue;
    const counts = fileCoverage.b?.[id] ?? [];
    for (const count of counts) {
      total += 1;
      if (count > 0) hits += 1;
    }
  }
  return { hits, total };
}

function wholeFileHits(fileCoverage) {
  const statements = Object.values(fileCoverage.s ?? {});
  const branches = Object.values(fileCoverage.b ?? {}).flat();
  return {
    statements: {
      hits: statements.filter((n) => n > 0).length,
      total: statements.length,
    },
    branches: {
      hits: branches.filter((n) => n > 0).length,
      total: branches.length,
    },
  };
}

export function evaluateNewCodeCoverage({
  coverageFinal,
  addedByFile,
  newFiles,
  threshold = COVERAGE_THRESHOLD,
}) {
  const failures = [];
  const reports = [];
  const files = new Set([...addedByFile.keys(), ...newFiles]);

  for (const file of [...files].sort()) {
    if (!isCoveredSourceFile(file)) continue;

    const coverage = findFileCoverage(coverageFinal, file);
    if (!coverage) {
      const message = `${file}: not in Jest coverage report (0%)`;
      failures.push(message);
      reports.push({ file, ok: false, message });
      continue;
    }

    const isNew = newFiles.has(file);
    const statements = isNew
      ? wholeFileHits(coverage).statements
      : statementHitsOnLines(coverage, addedByFile.get(file) ?? new Set());
    const branches = isNew
      ? wholeFileHits(coverage).branches
      : branchHitsOnLines(coverage, addedByFile.get(file) ?? new Set());

    const statementPct = percent(statements.hits, statements.total);
    const branchPct = percent(branches.hits, branches.total);
    const ok = statementPct >= threshold && branchPct >= threshold;
    const message = `${file}: statements ${statementPct.toFixed(1)}% (${statements.hits}/${statements.total}), branches ${branchPct.toFixed(1)}% (${branches.hits}/${branches.total})${isNew ? ' [new file]' : ' [added lines]'}`;
    reports.push({ file, ok, message, statementPct, branchPct });
    if (!ok) failures.push(message);
  }

  return { ok: failures.length === 0, failures, reports };
}

function git(args) {
  return execSync(`git ${args}`, { encoding: 'utf8' }).trim();
}

export function defaultBase(gitFn = git) {
  try {
    gitFn('rev-parse --verify origin/main');
    return 'origin/main';
  } catch {
    return 'HEAD';
  }
}

export function collectDiffState(gitFn = git) {
  const base = defaultBase(gitFn);
  let committed = '';
  try {
    committed = gitFn(`diff -U0 ${base}...HEAD`);
  } catch {
    committed = '';
  }
  const unstaged = gitFn('diff -U0');
  const staged = gitFn('diff -U0 --cached');
  const unified = [committed, staged, unstaged].filter(Boolean).join('\n');

  const names = new Set();
  const newFiles = new Set();
  for (const args of [
    `diff --name-only --diff-filter=ACMR ${base}...HEAD`,
    'diff --name-only --diff-filter=ACMR',
    'diff --name-only --cached --diff-filter=ACMR',
  ]) {
    try {
      for (const name of gitFn(args).split('\n')) {
        if (name) names.add(name);
      }
    } catch {
      // empty range
    }
  }
  for (const args of [
    `diff --name-only --diff-filter=A ${base}...HEAD`,
    'diff --name-only --diff-filter=A',
    'diff --name-only --cached --diff-filter=A',
  ]) {
    try {
      for (const name of gitFn(args).split('\n')) {
        if (name) newFiles.add(name);
      }
    } catch {
      // empty
    }
  }

  const addedByFile = parseAddedLines(unified);
  for (const name of names) {
    if (
      isCoveredSourceFile(name) &&
      !addedByFile.has(name) &&
      newFiles.has(name)
    ) {
      addedByFile.set(name, new Set());
    }
  }

  return { addedByFile, newFiles };
}

export function reportCoverageResult(
  result,
  {
    threshold = COVERAGE_THRESHOLD,
    log = console.log,
    error = console.error,
  } = {},
) {
  for (const report of result.reports) {
    log(report.message);
  }

  if (!result.ok) {
    error(
      `new-code-coverage: new code must be at least ${threshold}% (statements and branches).`,
    );
    for (const failure of result.failures) {
      error(`  ${failure}`);
    }
    return 1;
  }

  if (result.reports.length === 0) {
    log('new-code-coverage: no production source in the diff.');
  } else {
    log('new-code-coverage: ok');
  }
  return 0;
}

function loadCoverageFinal() {
  const coveragePath = resolve(process.cwd(), 'coverage/coverage-final.json');
  try {
    return JSON.parse(readFileSync(coveragePath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * @param {object} [opts]
 * @param {object | null} [opts.coverageFinal]
 * @param {{ addedByFile: Map<string, Set<number>>, newFiles: Set<string> }} [opts.diffState]
 * @param {(message: string) => void} [opts.log]
 * @param {(message: string) => void} [opts.error]
 * @param {(code: number) => void} [opts.exit]
 */
export function runCli({
  coverageFinal = loadCoverageFinal(),
  diffState,
  log = console.log,
  error = console.error,
  exit = (code) => {
    process.exit(code);
  },
} = {}) {
  if (!coverageFinal) {
    error(
      'new-code-coverage: coverage/coverage-final.json missing. Run npm test first.',
    );
    exit(1);
    return 1;
  }

  const { addedByFile, newFiles } = diffState ?? collectDiffState();
  const result = evaluateNewCodeCoverage({
    coverageFinal,
    addedByFile,
    newFiles,
  });
  const code = reportCoverageResult(result, { log, error });
  if (code !== 0) exit(code);
  return code;
}

const invokedDirectly = process.argv[1]?.endsWith('new-code-coverage.mjs');
if (invokedDirectly) {
  runCli();
}
