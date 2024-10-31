export const checkError = (error: unknown) => {
  return (
    error && typeof error === 'object' && 'message' in error && 'stack' in error
  );
};
