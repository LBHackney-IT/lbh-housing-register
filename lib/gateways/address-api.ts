import axios from 'axios';
import asssertServerOnly from '../utils/assertServerOnly';
import { formatPostcode } from '../utils/postcode';

asssertServerOnly();

export const lookUpAddress = async (postcode: string) => {
  // The address service accepts one canonical postcode, with a single space.
  // A value our form allows, such as a hyphen or an unusual space, is rejected
  // and this route was turning that rejection into a 500.
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
