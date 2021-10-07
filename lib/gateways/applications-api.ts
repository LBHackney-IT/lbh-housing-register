import axios from 'axios';
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
): Promise<EvidenceRequestResponse | null> => {
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
  id: string,
  request: CreateAuthRequest
): Promise<CreateAuthResponse | null> => {
  const headers = {
    'x-api-key': process.env.HOUSING_REGISTER_KEY,
    'Content-Type': 'application/json',
  };
  const { data } = await axios.post(
    `${process.env.HOUSING_REGISTER_API}/auth/${id}/generate`,
    request,
    {
      headers: headers,
    }
  );
  return data;
};

export const confirmVerifyCode = async (
  id: string,
  request: VerifyAuthRequest
): Promise<VerifyAuthResponse | null> => {
  const headers = {
    'x-api-key': process.env.HOUSING_REGISTER_KEY,
    'Content-Type': 'application/json',
  };
  const { data } = await axios.post(
    `${process.env.HOUSING_REGISTER_API}/auth/${id}/verify`,
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
