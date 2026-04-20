module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Human / czg input is often sentence-case; strict casing rejects valid commits.
    'subject-case': [0],
  },
  // cz-git and czg read `prompt` from this file (see https://cz-git.qbb.sh/config/)
  prompt: {
    // Lowercase the first character of the subject so it matches common convention.
    upperCaseSubject: false,
  },
};
