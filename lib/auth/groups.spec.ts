import { parseCognitoGroups } from './groups';

describe('parseCognitoGroups', () => {
  it.each([
    ['["officers","managers"]', ['officers', 'managers']],
    ['[officers, managers]', ['officers', 'managers']],
    ['officers,managers', ['officers', 'managers']],
    ['officers;managers', ['officers', 'managers']],
    [
      'Housing Register View;saml-aws-housing-register-developers',
      ['Housing Register View', 'saml-aws-housing-register-developers'],
    ],
  ])('parses %s', (claim, expected) => {
    expect(parseCognitoGroups(claim)).toEqual(expected);
  });

  it('keeps commas inside group names when semicolons separate the list', () => {
    expect(parseCognitoGroups('Here to Help (Dev, Prod);GitHub')).toEqual([
      'Here to Help (Dev, Prod)',
      'GitHub',
    ]);
  });

  it('rejects non-string values instead of trusting arbitrary claims', () => {
    expect(parseCognitoGroups({ admin: true })).toEqual([]);
    expect(parseCognitoGroups(['officers', 123])).toEqual(['officers']);
  });
});
