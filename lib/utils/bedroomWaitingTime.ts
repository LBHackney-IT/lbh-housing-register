export const getWaitingTime = (bedroom: number) => {
  switch (bedroom) {
    case 1:
      return 4;
    case 2:
      return 11;
    case 3:
      return 12;
    case 4:
      return 17;
    default:
      return 17;
  }
};
