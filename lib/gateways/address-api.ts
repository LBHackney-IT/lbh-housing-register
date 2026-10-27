import axios from 'axios';
import asssertServerOnly from '../utils/assertServerOnly';
import { formatPostcode } from '../utils/postcode';

asssertServerOnly();

export const lookUpAddress = async (postcode: string) => {
  const formattedPostcode = encodeURIComponent(formatPostcode(postcode));
  const { data } = await axios.get(
    `${process.env.LOOKUP_API_URL}/?postcode=${formattedPostcode}`,
    {
      headers: {
        Authorization: process.env.LOOKUP_API_TOKEN,
      },
    },
  );
  return data.data;
};
