export const envVarsFixture = (key: string) => {
  const initial = process.env[key];

  return {
    mock: (value: string) => {
      process.env[key] = value;
    },
    restore: () => {
      process.env[key] = initial;
    },
    delete: () => {
      delete process.env[key];
    },
  };
};
