import axios, { AxiosInstance } from 'axios';
import type { GetServerSidePropsContext, NextApiRequest } from 'next';
import asssertServerOnly from './assertServerOnly';
import { getCognitoIdToken } from '../auth/staff';

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

type AuthenticatedRequest = NextApiRequest | GetServerSidePropsContext['req'];

export async function authenticatedHousingAxios(
  httpRequest: AuthenticatedRequest,
): Promise<AxiosInstance> {
  const client = housingAxios();

  const idToken = await getCognitoIdToken(httpRequest);
  if (idToken) {
    client.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
  }

  return client;
}

export async function activityAxios(
  httpRequest: AuthenticatedRequest,
): Promise<AxiosInstance> {
  const client = axios.create({
    baseURL: process.env.ACTIVITY_HISTORY_API,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const idToken = await getCognitoIdToken(httpRequest);
  if (idToken) {
    client.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
  }

  return client;
}
