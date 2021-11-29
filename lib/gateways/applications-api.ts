import axios, { AxiosResponse } from 'axios';
import {
  Application,
  CreateAuthRequest,
  CreateAuthResponse,
  CreateEvidenceRequest,
  EvidenceRequestResponse,
  PaginatedApplicationListResponse,
  VerifyAuthRequest,
  VerifyAuthResponse,
} from '../../domain/HousingApi';
import { Stat } from '../../domain/stat';

const headersWithKey = {
  'x-api-key': process.env.HOUSING_REGISTER_KEY,
};

export const getApplications = async (
  page: string | number,
  user?: string | 'unassigned'
): Promise<PaginatedApplicationListResponse | null> => {
  try {
    const assignedTo = user ?? '';
    const { data } = await axios.get(
      `${process.env.HOUSING_REGISTER_API}/applications?page=${page}&assignedTo=${assignedTo}`,
      {
        headers: headersWithKey,
      }
    );
    return data;
  } catch (err) {
    return null;
  }
};

export const searchApplications = async (
  page: string,
  reference: string,
  status: string,
  user?: string | 'unassigned'
): Promise<PaginatedApplicationListResponse | null> => {
  try {
    const assignedTo = user ?? '';
    const { data } = await axios.get(
      `${process.env.HOUSING_REGISTER_API}/applications?page=${page}&reference=${reference}&status=${status}&assignedTo=${assignedTo}`,
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
      `${process.env.HOUSING_REGISTER_API}/applications/${id}`,
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
    'x-api-key': process.env.HOUSING_REGISTER_KEY,
    'Content-Type': 'application/json',
  };
  const { data } = await axios.post(
    `${process.env.HOUSING_REGISTER_API}/applications`,
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
    'x-api-key': process.env.HOUSING_REGISTER_KEY,
    'Content-Type': 'application/json',
  };
  const { data } = await axios.patch(
    `${process.env.HOUSING_REGISTER_API}/applications/${id}`,
    application,
    {
      headers: headers,
    }
  );
  return data;
};

export const completeApplication = async (
  id: string
): Promise<Application | null> => {
  const { data } = await axios.patch(
    `${process.env.HOUSING_REGISTER_API}/applications/${id}/complete`,
    null,
    {
      headers: headersWithKey,
    }
  );
  return data;
};

export const createEvidenceRequest = async (
  id: string,
  request: CreateEvidenceRequest
): Promise<Array<EvidenceRequestResponse> | null> => {
  const { data } = await axios.post(
    `${process.env.HOUSING_REGISTER_API}/applications/${id}/evidence`,
    request,
    {
      headers: headersWithKey,
    }
  );
  return data;
};

export const createVerifyCode = async (
  request: CreateAuthRequest
): Promise<CreateAuthResponse | null> => {
  const headers = {
    'x-api-key': process.env.HOUSING_REGISTER_KEY,
    'Content-Type': 'application/json',
  };

  const { data } = await axios.post(
    `${process.env.HOUSING_REGISTER_API}/auth/generate`,
    request,
    {
      headers: headers,
    }
  );
  return data;
};

export const confirmVerifyCode = async (
  request: VerifyAuthRequest
): Promise<VerifyAuthResponse | null> => {
  const headers = {
    'x-api-key': process.env.HOUSING_REGISTER_KEY,
    'Content-Type': 'application/json',
  };
  const { data } = await axios.post(
    `${process.env.HOUSING_REGISTER_API}/auth/verify`,
    request,
    {
      headers: headers,
    }
  );
  return data;
};

export const getStats = async (): Promise<Array<Stat> | null> => {
  try {
    const { data } = await axios.get(
      `${process.env.HOUSING_REGISTER_API}/stats`,
      {
        headers: headersWithKey,
      }
    );
    return data;
  } catch (err) {
    return null;
  }
};

export const listNovaletExports = async (): Promise<string[]> => {
  try {
    const headers = {
      'x-api-key': process.env.HOUSING_REGISTER_KEY,
      'Content-Type': 'application/json',
    };
    const url = `${process.env.HOUSING_REGISTER_API}/reporting/listnovaletfiles`;
    const { data } = await axios.get(url, { headers: headers });

    return data;
  } catch (err) {
    return [];
  }
};

export const downloadNovaletExport = async (
  filename: string
): Promise<AxiosResponse | null> => {
  try {
    const headers = {
      'x-api-key': process.env.HOUSING_REGISTER_KEY,
      'Content-Type': 'application/json',
    };
    const url = `${process.env.HOUSING_REGISTER_API}/reporting/novaletexport/${filename}`;
    return await axios.get(url, { headers: headers, responseType: 'blob' });
  } catch (err) {
    return null;
  }
};

export const generateNovaletExport = async (): Promise<AxiosResponse> => {
  const headers = {
    'x-api-key': process.env.HOUSING_REGISTER_KEY,
    'Content-Type': 'application/json',
  };
  const url = `${process.env.HOUSING_REGISTER_API}/reporting/generatenovaletexport`;
  return await axios.post(url, null, { headers: headers });
};

export const downloadInternalReport = async (
  query: any
): Promise<AxiosResponse | null> => {
  try {
    const { reportType, startDate, endDate } = query;

    const headers = {
      'x-api-key': process.env.HOUSING_REGISTER_KEY,
      'Content-Type': 'application/json',
    };
    const url = `${process.env.HOUSING_REGISTER_API}/reporting/export?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`;
    return await axios.get(url, { headers: headers, responseType: 'blob' });
  } catch (err) {
    return null;
  }
};
