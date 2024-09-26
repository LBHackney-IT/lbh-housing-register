import axios, { AxiosInstance } from 'axios';
import cookie from 'cookie';
import { IncomingMessage } from 'http';
import asssertServerOnly from './assertServerOnly';

asssertServerOnly();

export function housingAxios() {
  const apiUrlString = process.env.HOUSING_REGISTER_API as string;
  const url = new URL(apiUrlString);
  return axios.create({
    baseURL: process.env.HOUSING_REGISTER_API,
    headers: {
      'x-api-key': process.env.HOUSING_REGISTER_KEY,
      'Content-Type': 'application/json',
      Host: url.host,
    },
  });
}

export function authenticatedHousingAxios(
  httpRequest: IncomingMessage
): AxiosInstance {
  const client = housingAxios();

  const cookies = cookie.parse(httpRequest.headers.cookie ?? '');
  const parsedToken = cookies['hackneyToken'];

  client.defaults.headers.common['Authorization'] = 'Bearer ' + parsedToken;

  return client;
}

export function activityAxios(httpRequest: IncomingMessage): AxiosInstance {
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
