import axios from 'axios';
import { Application, ApplicationList } from '../../domain/HousingApi';
import { Stat } from '../../domain/Stat';

const headersWithKey = {
  'x-api-key': process.env.AWS_KEY,
};

export const getApplications = async (): Promise<ApplicationList | null> => {
  try {
    const { data } = await axios.get(
      `${process.env.ENDPOINT_API}/applications`,
      {
        headers: headersWithKey,
      }
    );
    return data;
  } catch (err) {
    return null;
  }
};

export const getApplication = async (
  id: string
): Promise<Application | null> => {
  try {
    const { data } = await axios.get(
      `${process.env.ENDPOINT_API}/applications/${id}`,
      {
        headers: headersWithKey,
      }
    );
    return data;
  } catch (err) {
    return null;
  }
};

export const addApplication = async (
  application: any
): Promise<Application | null> => {
  const headers = {
    'x-api-key': process.env.AWS_KEY,
    'Content-Type': 'application/json',
  };
  const { data } = await axios.post(
    `${process.env.ENDPOINT_API}/applications`,
    application,
    {
      headers: headers,
    }
  );
  return data;
};

export const updateApplication = async (
  application: any,
  id: string
): Promise<Application | null> => {
  const headers = {
    'x-api-key': process.env.AWS_KEY,
    'Content-Type': 'application/json',
  };
  const { data } = await axios.patch(
    `${process.env.ENDPOINT_API}/applications/${id}`,
    application,
    {
      headers: headers,
    }
  );
  return data;
};

export const getStats = async (): Promise<Array<Stat> | null> => {
  try {
    const { data } = await axios.get(`${process.env.ENDPOINT_API}/stats`, {
      headers: headersWithKey,
    });
    return data;
  } catch (err) {
    return null;
  }
};
