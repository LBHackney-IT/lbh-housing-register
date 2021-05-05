import axios from 'axios';
import { Application, ApplicationList } from '../../domain/application';
import { Stat } from '../../domain/stat';

const headersWithKey = {
  'x-api-key': process.env.AWS_KEY,
};

export const getApplications = async (): Promise<ApplicationList | null> => {
  try {
    const { data } = await axios.get(
      `${process.env.ENDPOINT_API}/applications`,
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
      `${process.env.ENDPOINT_API}/applications/${id}`,
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
      `${process.env.ENDPOINT_API}/stats`,
      {
        headers: headersWithKey
      }
    );
    return data;
  } catch (err) {
    return null;
  }
}
