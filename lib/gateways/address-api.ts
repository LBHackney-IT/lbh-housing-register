import axios from 'axios';
import asssertServerOnly from '../utils/assertServerOnly';

asssertServerOnly();

export const lookUpAddress = async (postcode: string | string[]) => {
  const { data } = await axios.get(
    `${process.env.LOOKUP_API_URL}/?postcode=${postcode}`,
    {
      headers: {
        Authorization: process.env.LOOKUP_API_TOKEN,
      },
    }
  );
  return data.data;
};
