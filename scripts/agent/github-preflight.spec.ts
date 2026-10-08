import {
  checkGithubPreflight,
  runGithubPreflight,
} from './github-preflight.mjs';

function result(status = 0, stdout = '') {
  return { status, stdout };
}

describe('GitHub preflight', () => {
  it('passes when gh is authenticated and origin exists', () => {
    const run = jest
      .fn()
      .mockReturnValueOnce(result())
      .mockReturnValueOnce(result())
      .mockReturnValueOnce(result(0, 'WRITE\n'))
      .mockReturnValueOnce(
        result(0, 'git@github.com:LBHackney-IT/lbh-housing-register.git\n'),
      );

    expect(checkGithubPreflight(run)).toEqual([]);
  });

  it('warns when gh is missing and origin is absent', () => {
    const run = jest
      .fn()
      .mockReturnValueOnce({
        status: null,
        stdout: '',
        error: { code: 'ENOENT' },
      })
      .mockReturnValueOnce(result(2));

    const warnings = checkGithubPreflight(run);

    expect(warnings).toHaveLength(2);
    expect(warnings[0]).toContain('GitHub CLI');
    expect(warnings[1]).toContain('origin');
  });

  it('warns when gh authentication is unavailable', () => {
    const run = jest
      .fn()
      .mockReturnValueOnce(result())
      .mockReturnValueOnce(result(1))
      .mockReturnValueOnce(result(0, 'https://github.com/example/repo.git\n'));

    expect(checkGithubPreflight(run)).toEqual([
      expect.stringContaining('not authenticated'),
    ]);
  });

  it('warns when repository write access is unavailable', () => {
    const run = jest
      .fn()
      .mockReturnValueOnce(result())
      .mockReturnValueOnce(result())
      .mockReturnValueOnce(result(0, 'READ\n'))
      .mockReturnValueOnce(result(0, 'https://github.com/example/repo.git\n'));

    expect(checkGithubPreflight(run)).toEqual([
      expect.stringContaining('write access'),
    ]);
  });

  it('always returns success when warnings are emitted', () => {
    const writeErr = jest.fn();
    const code = runGithubPreflight({
      run: jest
        .fn()
        .mockReturnValueOnce({
          status: null,
          stdout: '',
          error: { code: 'ENOENT' },
        })
        .mockReturnValueOnce(result(2)),
      writeErr,
    });

    expect(code).toBe(0);
    expect(writeErr).toHaveBeenCalledWith(
      expect.stringContaining('warning only'),
    );
  });
});
