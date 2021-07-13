export const lookUpAddress = async (
  postCode: string | undefined | null
): Promise<any> => {
  try {
    const res = await fetch(`/api/address/${postCode}`, {
      method: 'GET',
    });

    return await res.json();
  } catch (err) {
    throw new Error(`This error: ${err}`);
  }
};
