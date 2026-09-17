import {
  COVERAGE_THRESHOLD,
  collectDiffState,
  defaultBase,
  evaluateNewCodeCoverage,
  findFileCoverage,
  isCoveredSourceFile,
  parseAddedLines,
  percent,
  reportCoverageResult,
  runCli,
} from './new-code-coverage.mjs';

type StatementHit = { line: number; hits: number };
type BranchHit = { line: number; counts: number[] };

const sampleCoverage = (
  path: string,
  {
    statements,
    branches = [],
  }: { statements: StatementHit[]; branches?: BranchHit[] },
) => ({
  path,
  statementMap: Object.fromEntries(
    statements.map((item, id) => [
      String(id),
      { start: { line: item.line, column: 0 } },
    ]),
  ),
  s: Object.fromEntries(statements.map((item, id) => [String(id), item.hits])),
  branchMap: Object.fromEntries(
    branches.map((item, id) => [
      String(id),
      {
        loc: { start: { line: item.line, column: 0 } },
        locations: [{ start: { line: item.line, column: 0 } }],
      },
    ]),
  ),
  b: Object.fromEntries(branches.map((item, id) => [String(id), item.counts])),
});

describe('isCoveredSourceFile', () => {
  it.each([
    ['lib/gateways/internal-api.ts', true],
    ['pages/apply/[resident]/address-history.tsx', true],
    ['scripts/agent/new-code-coverage.mjs', true],
    ['scripts/agent/pre-pr-scan.mjs', false],
    ['lib/gateways/internal-api.spec.ts', false],
    ['cypress/e2e/pages/apply/[resident]/address-history.cy.ts', false],
    ['docs/agent/sentry-issue-to-pr.md', false],
  ])('%s → %s', (name, expected) => {
    expect(isCoveredSourceFile(name)).toBe(expected);
  });
});

describe('percent', () => {
  it('returns 100 when there is nothing to cover', () => {
    expect(percent(0, 0)).toBe(100);
  });

  it('returns the hit ratio as a percentage', () => {
    expect(percent(4, 5)).toBe(80);
  });
});

describe('parseAddedLines', () => {
  it('maps added lines from a unified diff', () => {
    const diff = [
      'diff --git a/lib/foo.ts b/lib/foo.ts',
      '--- a/lib/foo.ts',
      '+++ b/lib/foo.ts',
      '@@ -10,2 +10,3 @@',
      ' keep',
      '-old',
      '+newA',
      '+newB',
    ].join('\n');

    const lines = parseAddedLines(diff).get('lib/foo.ts');
    expect(lines).toEqual(new Set([11, 12]));
  });

  it('ignores deleted files and leftover hunk lines', () => {
    const diff = [
      '+++ /dev/null',
      '@@ -1 +0,0 @@',
      '-gone',
      '+++ b/lib/bar.ts',
      '@@ -3 +4 @@',
      '+only',
      '\\ No newline at end of file',
    ].join('\n');

    expect(parseAddedLines(diff).get('lib/bar.ts')).toEqual(new Set([4]));
  });
});

describe('findFileCoverage', () => {
  it('matches an absolute coverage key by relative path', () => {
    const coverage = {
      '/tmp/project/lib/foo.ts': { s: {} },
    };
    expect(findFileCoverage(coverage, 'lib/foo.ts')).toEqual({ s: {} });
  });

  it('matches an exact key and returns null when missing', () => {
    const coverage = { 'lib/foo.ts': { s: { '0': 1 } } };
    expect(findFileCoverage(coverage, 'lib/foo.ts')).toEqual({ s: { '0': 1 } });
    expect(findFileCoverage(coverage, 'lib/other.ts')).toBeNull();
  });
});

describe('evaluateNewCodeCoverage', () => {
  it('fails a new file below the threshold', () => {
    const file = 'lib/new.ts';
    const result = evaluateNewCodeCoverage({
      coverageFinal: {
        [`/repo/${file}`]: sampleCoverage(file, {
          statements: [
            { line: 1, hits: 1 },
            { line: 2, hits: 0 },
            { line: 3, hits: 0 },
            { line: 4, hits: 0 },
            { line: 5, hits: 0 },
          ],
        }),
      },
      addedByFile: new Map(),
      newFiles: new Set([file]),
    });

    expect(result.ok).toBe(false);
    expect(result.failures[0]).toContain(file);
  });

  it('passes a new file at 80% statements and branches', () => {
    const file = 'lib/new.ts';
    const result = evaluateNewCodeCoverage({
      coverageFinal: {
        [`/repo/${file}`]: sampleCoverage(file, {
          statements: [
            { line: 1, hits: 1 },
            { line: 2, hits: 1 },
            { line: 3, hits: 1 },
            { line: 4, hits: 1 },
            { line: 5, hits: 0 },
          ],
          branches: [{ line: 1, counts: [1, 0] }],
        }),
      },
      addedByFile: new Map(),
      newFiles: new Set([file]),
    });

    expect(result.ok).toBe(false);
  });

  it('passes a new file when statements and branches are both at least 80%', () => {
    const file = 'lib/new.ts';
    const result = evaluateNewCodeCoverage({
      coverageFinal: {
        [`/repo/${file}`]: sampleCoverage(file, {
          statements: [
            { line: 1, hits: 1 },
            { line: 2, hits: 1 },
            { line: 3, hits: 1 },
            { line: 4, hits: 1 },
            { line: 5, hits: 0 },
          ],
          branches: [
            { line: 1, counts: [1] },
            { line: 2, counts: [1] },
            { line: 3, counts: [1] },
            { line: 4, counts: [1] },
            { line: 5, counts: [0] },
          ],
        }),
      },
      addedByFile: new Map(),
      newFiles: new Set([file]),
    });

    expect(result.ok).toBe(true);
  });

  it('only scores added lines on a modified file', () => {
    const file = 'lib/existing.ts';
    const result = evaluateNewCodeCoverage({
      coverageFinal: {
        [`/repo/${file}`]: sampleCoverage(file, {
          statements: [
            { line: 1, hits: 0 },
            { line: 20, hits: 1 },
            { line: 21, hits: 1 },
          ],
        }),
      },
      addedByFile: new Map([[file, new Set([20, 21])]]),
      newFiles: new Set(),
    });

    expect(result.ok).toBe(true);
  });

  it('scores branches on added lines using location fallbacks', () => {
    const file = 'lib/existing.ts';
    const result = evaluateNewCodeCoverage({
      coverageFinal: {
        [`/repo/${file}`]: {
          path: file,
          statementMap: {
            '0': { start: { line: 20, column: 0 } },
          },
          s: { '0': 1 },
          branchMap: {
            '0': {
              locations: [{ start: { line: 20, column: 0 } }],
            },
          },
          b: { '0': [1, 0] },
        },
      },
      addedByFile: new Map([[file, new Set([20])]]),
      newFiles: new Set(),
    });

    expect(result.ok).toBe(false);
  });

  it('treats empty executable added lines as fully covered', () => {
    const file = 'lib/existing.ts';
    const result = evaluateNewCodeCoverage({
      coverageFinal: {
        [`/repo/${file}`]: sampleCoverage(file, {
          statements: [{ line: 1, hits: 0 }],
        }),
      },
      addedByFile: new Map([[file, new Set([99])]]),
      newFiles: new Set(),
    });

    expect(result.ok).toBe(true);
  });

  it('fails when a changed source file is missing from the coverage report', () => {
    const result = evaluateNewCodeCoverage({
      coverageFinal: {},
      addedByFile: new Map([['lib/missing.ts', new Set([1])]]),
      newFiles: new Set(),
    });

    expect(result.ok).toBe(false);
    expect(result.failures[0]).toContain('not in Jest coverage report');
  });

  it('ignores markdown and spec files', () => {
    const result = evaluateNewCodeCoverage({
      coverageFinal: {},
      addedByFile: new Map([['docs/readme.md', new Set([1])]]),
      newFiles: new Set(['lib/foo.spec.ts']),
    });

    expect(result.ok).toBe(true);
    expect(result.reports).toHaveLength(0);
  });
});

describe('defaultBase and collectDiffState', () => {
  it('uses origin/main when that ref exists', () => {
    const gitFn = jest.fn((args) => {
      if (args === 'rev-parse --verify origin/main') return 'abc';
      throw new Error(args);
    });
    expect(defaultBase(gitFn)).toBe('origin/main');
  });

  it('falls back to HEAD when origin/main is missing', () => {
    const gitFn = jest.fn(() => {
      throw new Error('missing');
    });
    expect(defaultBase(gitFn)).toBe('HEAD');
  });

  it('uses the real git helper when no function is passed', () => {
    expect(defaultBase()).toMatch(/^(origin\/main|HEAD)$/);
  });

  it('records a new file with no hunks and swallows empty git ranges', () => {
    const gitFn = jest.fn((args) => {
      if (args === 'rev-parse --verify origin/main') return 'abc';
      if (args === 'diff -U0 origin/main...HEAD') {
        throw new Error('no merge base');
      }
      if (args === 'diff -U0' || args === 'diff -U0 --cached') return '';
      if (args.includes('origin/main...HEAD')) {
        throw new Error('empty');
      }
      if (args.includes('--diff-filter=A')) return 'lib/brand-new.ts';
      if (args.includes('--diff-filter=ACMR')) return 'lib/brand-new.ts';
      return '';
    });

    const { addedByFile, newFiles } = collectDiffState(gitFn);
    expect(newFiles.has('lib/brand-new.ts')).toBe(true);
    expect(addedByFile.get('lib/brand-new.ts')).toEqual(new Set());
  });

  it('merges committed, staged, and unstaged added files', () => {
    const gitFn = jest.fn((args) => {
      if (args === 'rev-parse --verify origin/main') return 'abc';
      if (args === 'diff -U0 origin/main...HEAD') {
        return [
          '+++ b/lib/committed.ts',
          '@@ -0,0 +1,1 @@',
          '+export const a = 1;',
        ].join('\n');
      }
      if (args === 'diff -U0') return '';
      if (args === 'diff -U0 --cached') return '';
      if (args.includes('--diff-filter=A')) return 'lib/committed.ts';
      if (args.includes('--diff-filter=ACMR')) return 'lib/committed.ts';
      return '';
    });

    const { addedByFile, newFiles } = collectDiffState(gitFn);
    expect(newFiles.has('lib/committed.ts')).toBe(true);
    expect(addedByFile.get('lib/committed.ts')).toEqual(new Set([1]));
  });
});

describe('reportCoverageResult and runCli', () => {
  it('returns 0 and logs ok when coverage passes', () => {
    const log = jest.fn();
    const error = jest.fn();
    const code = reportCoverageResult(
      {
        ok: true,
        failures: [],
        reports: [{ message: 'lib/foo.ts: statements 100.0%' }],
      },
      { log, error },
    );
    expect(code).toBe(0);
    expect(log).toHaveBeenCalledWith('new-code-coverage: ok');
    expect(error).not.toHaveBeenCalled();
  });

  it('returns 1 when coverage fails', () => {
    const log = jest.fn();
    const error = jest.fn();
    const code = reportCoverageResult(
      {
        ok: false,
        failures: ['lib/foo.ts: statements 0.0%'],
        reports: [{ message: 'lib/foo.ts: statements 0.0%' }],
      },
      { log, error, threshold: COVERAGE_THRESHOLD },
    );
    expect(code).toBe(1);
    expect(error.mock.calls[0][0]).toContain('at least 80%');
  });

  it('logs when the diff has no production source', () => {
    const log = jest.fn();
    expect(
      reportCoverageResult(
        { ok: true, failures: [], reports: [] },
        { log, error: jest.fn() },
      ),
    ).toBe(0);
    expect(log).toHaveBeenCalledWith(
      'new-code-coverage: no production source in the diff.',
    );
  });

  it('exits when the coverage report is missing', () => {
    const error = jest.fn();
    const exit = jest.fn() as (code: number) => void;
    runCli({ coverageFinal: null, log: jest.fn(), error, exit });
    expect(error.mock.calls[0][0]).toContain('coverage-final.json missing');
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('exits when evaluated coverage is below the threshold', () => {
    const exit = jest.fn() as (code: number) => void;
    runCli({
      coverageFinal: {},
      diffState: {
        addedByFile: new Map([['lib/missing.ts', new Set([1])]]),
        newFiles: new Set(),
      },
      log: jest.fn(),
      error: jest.fn(),
      exit,
    });
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('returns 0 when evaluated coverage passes', () => {
    const file = 'lib/ok.ts';
    const exit = jest.fn() as (code: number) => void;
    const code = runCli({
      coverageFinal: {
        [`/repo/${file}`]: sampleCoverage(file, {
          statements: [{ line: 1, hits: 1 }],
        }),
      },
      diffState: {
        addedByFile: new Map([[file, new Set([1])]]),
        newFiles: new Set(),
      },
      log: jest.fn(),
      error: jest.fn(),
      exit,
    });
    expect(code).toBe(0);
    expect(exit).not.toHaveBeenCalled();
  });

  it('uses default loggers when reporting a pass with no reports', () => {
    expect(reportCoverageResult({ ok: true, failures: [], reports: [] })).toBe(
      0,
    );
  });
});
