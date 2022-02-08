import axios, { AxiosInstance } from 'axios';
import cookie from 'cookie';

const housingRegisterAxios = axios.create({
  baseURL: process.env.HOUSING_REGISTER_API,
  headers: {
    'x-api-key': process.env.HOUSING_REGISTER_KEY,
    'Content-Type': 'application/json',
  },
});

const activityHistoryAxios = axios.create({
  baseURL: process.env.ACTIVITY_HISTORY_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function housingAxios(httpRequest: any): AxiosInstance {
  if (httpRequest) {
    const cookies = cookie.parse(httpRequest.headers.cookie ?? '');
    const parsedToken = cookies['hackneyToken'];

    housingRegisterAxios.defaults.headers.common['Authorization'] =
      'Bearer ' + parsedToken;
  }
  return housingRegisterAxios;
}

export function activityAxios(httpRequest: any): AxiosInstance {
  if (httpRequest) {
    const cookies = cookie.parse(httpRequest.headers.cookie ?? '');
    const parsedToken = cookies['hackneyToken'];

    activityHistoryAxios.defaults.headers.common['Authorization'] =
      'Bearer ' + parsedToken;
  }

  return activityHistoryAxios;
}
