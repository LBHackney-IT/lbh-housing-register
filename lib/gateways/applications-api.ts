import axios from 'axios';
import { Application } from '../../domain/application';
import { Stat } from '../../domain/stat';

const headersWithKey = {
  'x-api-key': process.env.AWS_KEY,
};

export const getApplications = async (): Promise<Array<Application> | null> => {
  try {
    const { data } = await axios.get(
      `${process.env.ENDPOINT_API}/api/applications`,
      {
        headers: headersWithKey
      }
    );
    return data;
  } catch (err) {
    return null;
  }
}

export const getApplication = async (id: string): Promise<Application | null> => {
  try {
    const { data } = await axios.get(
      `${process.env.ENDPOINT_API}/api/applications/${id}`,
      {
        headers: headersWithKey
      }
    );
    return data;
  } catch (err) {
    return null;
  }
}

export const getStats = async (): Promise<Array<Stat> | null> => {
  try {
    const { data } = await axios.get(
      `${process.env.ENDPOINT_API}/api/stats`,
      {
        headers: headersWithKey
      }
    );
    return data;
  } catch (err) {
    return null;
  }
}
