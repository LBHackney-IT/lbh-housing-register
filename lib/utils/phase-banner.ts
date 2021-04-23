export const hasPhaseBanner = (): boolean => {
  return (
    parseFloat(process.env.NEXT_PUBLIC_VERSION!) < 1
  );
};
