import {
  collectPaths,
  evaluateNamedFiles,
  findBlockedPath,
  isSecretPath,
  listGitNames,
  runSecretPathGate,
} from './secret-path-gate.mjs';

describe('isSecretPath', () => {
  it.each([
    ['.env', true],
    ['.env.local', true],
    ['secrets/credentials.json', true],
    ['certs/key.pem', true],
    ['lib/gateways/internal-api.ts', false],
    ['README.md', false],
  ])('%s → %s', (path, expected) => {
    expect(isSecretPath(path)).toBe(expected);
  });
});

describe('collectPaths', () => {
  it('collects strings that look like paths, including nested objects', () => {
    expect(collectPaths({ path: '.env', nested: { file: 'a.pem' } })).toEqual([
      '.env',
      'a.pem',
    ]);
    expect(collectPaths(['lib/foo.ts', 'plain'])).toEqual(['lib/foo.ts']);
  });
});

describe('evaluateNamedFiles', () => {
  it('passes ordinary source files', () => {
    expect(evaluateNamedFiles(['lib/foo.ts', 'pages/index.tsx']).ok).toBe(true);
  });

  it('blocks a staged env file', () => {
    expect(findBlockedPath(['lib/foo.ts', '.env.production'])).toBe(
      '.env.production',
    );
    expect(evaluateNamedFiles(['.env']).ok).toBe(false);
  });
});

describe('listGitNames', () => {
  it('lists staged names', () => {
    const gitFn = jest.fn(() => ['.env']);
    expect(listGitNames('staged', gitFn)).toEqual(['.env']);
    expect(gitFn).toHaveBeenCalledWith('diff --cached --name-only');
  });

  it('merges changed names and ignores a missing upstream', () => {
    const gitFn = jest.fn((args) => {
      if (args.includes('@{upstream}')) throw new Error('no upstream');
      if (args === 'diff --name-only') return ['a.ts'];
      return ['b.ts'];
    });
    expect(listGitNames('changed', gitFn)).toEqual(['a.ts', 'b.ts']);
  });
});

describe('runSecretPathGate', () => {
  it('returns 1 for --staged when a secret path is present', async () => {
    const writeErr = jest.fn();
    const code = await runSecretPathGate({
      argv: ['--staged'],
      names: ['.env'],
      writeErr,
    });
    expect(code).toBe(1);
    expect(writeErr.mock.calls[0][0]).toContain('.env');
  });

  it('returns 0 for --changed when no secret paths are present', async () => {
    expect(
      await runSecretPathGate({
        argv: ['--changed'],
        names: ['lib/foo.ts'],
      }),
    ).toBe(0);
  });

  it('prints deny JSON when stdin names a secret path', async () => {
    const write = jest.fn();
    await runSecretPathGate({
      argv: [],
      stdin: JSON.stringify({ path: 'credentials.json' }),
      write,
    });
    expect(JSON.parse(write.mock.calls[0][0]).permission).toBe('deny');
  });

  it('prints allow JSON for invalid JSON and for a safe payload', async () => {
    const write = jest.fn();
    await runSecretPathGate({ argv: [], stdin: 'nope', write });
    expect(JSON.parse(write.mock.calls[0][0]).permission).toBe('allow');

    write.mockClear();
    await runSecretPathGate({
      argv: [],
      stdin: JSON.stringify({ path: 'lib/foo.ts' }),
      write,
    });
    expect(JSON.parse(write.mock.calls[0][0]).permission).toBe('allow');
  });
});
