import axios, { AxiosInstance } from 'axios';
import cookie from 'cookie';
import { NextApiRequest } from 'next';
import asssertServerOnly from './assertServerOnly';

asssertServerOnly();

export function housingAxios() {
  return axios.create({
    baseURL: process.env.HOUSING_REGISTER_API,
    headers: {
      'x-api-key': process.env.HOUSING_REGISTER_KEY,
      'Content-Type': 'application/json',
    },
  });
}

export function authenticatedHousingAxios(
  httpRequest: NextApiRequest
): AxiosInstance {
  const client = housingAxios();

  const cookies = cookie.parse(httpRequest.headers.cookie ?? '');
  const parsedToken = cookies['hackneyToken'];

  client.defaults.headers.common['Authorization'] = 'Bearer ' + parsedToken;

  return client;
}

export function activityAxios(httpRequest: NextApiRequest): AxiosInstance {
  const client = axios.create({
    baseURL: process.env.ACTIVITY_HISTORY_API,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const cookies = cookie.parse(httpRequest.headers.cookie ?? '');
  const parsedToken = cookies['hackneyToken'];
  client.defaults.headers.common['Authorization'] = 'Bearer ' + parsedToken;

  return client;
}
