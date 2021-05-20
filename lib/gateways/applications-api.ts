import axios from 'axios';
import { Application, ApplicationList, ApplicationWithError } from '../../domain/application';
import { Stat } from '../../domain/stat';

const headersWithKey = {
  'x-api-key': process.env.AWS_KEY,
  'Content-Type': 'application/json'
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

export const addApplication = async (payload: Application): Promise<ApplicationWithError> => {
  try {
    const { data } = await axios.post(
      `${process.env.ENDPOINT_API}/application`,
      {
        headers: headersWithKey, 
        data: payload
      }
    );
    return data;
  } catch (err) {
    return err.response.data;
  }
}
