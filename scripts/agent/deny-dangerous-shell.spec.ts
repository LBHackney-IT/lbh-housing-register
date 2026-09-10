import {
  ZERO_SHA,
  evaluateCommand,
  evaluatePushLine,
  evaluatePushStdin,
  runDenyDangerousShell,
} from './deny-dangerous-shell.mjs';

describe('evaluateCommand', () => {
  it('denies force push', () => {
    expect(evaluateCommand('git push --force origin HEAD').ok).toBe(false);
    expect(evaluateCommand('git push --force-with-lease').ok).toBe(false);
  });

  it('denies push to main or development', () => {
    expect(evaluateCommand('git push origin main').ok).toBe(false);
    expect(evaluateCommand('git push origin development').ok).toBe(false);
  });

  it('denies printenv and env', () => {
    expect(evaluateCommand('printenv').ok).toBe(false);
    expect(evaluateCommand('env').ok).toBe(false);
  });

  it('denies curl to a non-allowlisted host', () => {
    expect(evaluateCommand('curl https://example.com/secret').ok).toBe(false);
    expect(evaluateCommand('curl').ok).toBe(false);
  });

  it('allows curl to github and a normal git push', () => {
    expect(evaluateCommand('curl https://github.com/org/repo').ok).toBe(true);
    expect(evaluateCommand('git push -u origin sentry/abc').ok).toBe(true);
  });
});

describe('evaluatePushLine', () => {
  const ancestor = () => true;
  const notAncestor = () => false;

  it('rejects pushes to main and development', () => {
    expect(
      evaluatePushLine(`refs/heads/foo abc refs/heads/main ${ZERO_SHA}`, {
        isAncestor: ancestor,
      }).ok,
    ).toBe(false);
    expect(
      evaluatePushLine(`refs/heads/foo abc refs/heads/development def`, {
        isAncestor: ancestor,
      }).ok,
    ).toBe(false);
  });

  it('rejects a non-fast-forward update as a force push', () => {
    expect(
      evaluatePushLine('refs/heads/foo abc refs/heads/sentry/x def', {
        isAncestor: notAncestor,
      }).message,
    ).toBe('Force push is not allowed.');
  });

  it('allows a fast-forward to a feature branch and a delete', () => {
    expect(
      evaluatePushLine('refs/heads/foo abc refs/heads/sentry/x def', {
        isAncestor: ancestor,
      }).ok,
    ).toBe(true);
    expect(
      evaluatePushLine(`refs/heads/foo ${ZERO_SHA} refs/heads/sentry/x def`, {
        isAncestor: notAncestor,
      }).ok,
    ).toBe(true);
  });

  it('ignores short lines', () => {
    expect(evaluatePushLine('not-enough').ok).toBe(true);
  });
});

describe('evaluatePushStdin and runDenyDangerousShell', () => {
  it('fails pre-push when any line is blocked', () => {
    const result = evaluatePushStdin(
      `refs/heads/foo abc refs/heads/main def\n`,
      { isAncestor: () => true },
    );
    expect(result.ok).toBe(false);
  });

  it('returns 1 from --pre-push on a protected branch', async () => {
    const writeErr = jest.fn();
    const code = await runDenyDangerousShell({
      argv: ['--pre-push'],
      stdin: 'refs/heads/foo abc refs/heads/main def',
      writeErr,
    });
    expect(code).toBe(1);
    expect(writeErr).toHaveBeenCalled();
  });

  it('returns 0 from --pre-push when the stdin is empty', async () => {
    expect(
      await runDenyDangerousShell({ argv: ['--pre-push'], stdin: '' }),
    ).toBe(0);
  });

  it('prints allow JSON for invalid JSON and deny JSON for a bad command', async () => {
    const write = jest.fn();
    expect(
      await runDenyDangerousShell({ argv: [], stdin: 'not-json', write }),
    ).toBe(0);
    expect(JSON.parse(write.mock.calls[0][0]).permission).toBe('allow');

    write.mockClear();
    expect(
      await runDenyDangerousShell({
        argv: [],
        stdin: JSON.stringify({ command: 'git push --force' }),
        write,
      }),
    ).toBe(0);
    expect(JSON.parse(write.mock.calls[0][0]).permission).toBe('deny');
  });

  it('prints allow JSON for a safe command', async () => {
    const write = jest.fn();
    await runDenyDangerousShell({
      argv: [],
      stdin: JSON.stringify({ command: 'git status' }),
      write,
    });
    expect(JSON.parse(write.mock.calls[0][0]).permission).toBe('allow');
  });
});
