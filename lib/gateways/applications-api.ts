import { AxiosResponse } from 'axios';
import { activityAxios, housingAxios } from '../utils/axiosClients';
import { ActivityHistoryPagedResult } from '../../domain/ActivityHistoryApi';
import {
  Application,
  CreateAuthRequest,
  CreateAuthResponse,
  CreateEvidenceRequest,
  EvidenceRequestResponse,
  PaginatedApplicationListResponse,
  VerifyAuthRequest,
  VerifyAuthResponse,
  AddNoteToHistory,
} from '../../domain/HousingApi';
import { Stat } from '../../domain/stat';

export const getApplications = async (
  page: string | number,
  user?: string | 'unassigned'
): Promise<PaginatedApplicationListResponse | null> => {
  try {
    const assignedTo = user ?? '';
    const url = `applications?page=${page}&assignedTo=${assignedTo}`;
    const { data } = await housingAxios(null).get(url);
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
    const url = `applications?page=${page}&reference=${reference}&status=${status}&assignedTo=${assignedTo}`;
    const { data } = await housingAxios(null).get(url);
    return data;
  } catch (err) {
    return null;
  }
};

export const getApplication = async (
  id: string
): Promise<Application | null> => {
  try {
    const url = `applications/${id}`;
    const { data } = await housingAxios(null).get(url);
    return data;
  } catch (err) {
    return null;
  }
};

export const addApplication = async (
  application: any
): Promise<Application | null> => {
  const url = `applications`;
  const { data } = await housingAxios(null).post(url, application);
  return data;
};

export const updateApplication = async (
  application: any,
  id: string,
  req: any
): Promise<Application | null> => {
  const url = `applications/${id}`;
  const { data } = await housingAxios(req).patch(url, application);
  return data;
};

export const completeApplication = async (
  id: string,
  req: any
): Promise<Application | null> => {
  const url = `applications/${id}/complete`;
  const { data } = await housingAxios(req).patch(url, null);
  return data;
};

export const createEvidenceRequest = async (
  id: string,
  request: CreateEvidenceRequest
): Promise<Array<EvidenceRequestResponse> | null> => {
  const url = `applications/${id}/evidence`;
  const { data } = await housingAxios(null).post(url, request);
  return data;
};

export const createVerifyCode = async (
  request: CreateAuthRequest
): Promise<CreateAuthResponse | null> => {
  const url = 'auth/generate';
  const { data } = await housingAxios(null).post(url, request);
  return data;
};

export const confirmVerifyCode = async (
  request: VerifyAuthRequest
): Promise<VerifyAuthResponse | null> => {
  const url = 'auth/verify';
  const { data } = await housingAxios(null).post(url, request);
  return data;
};

export const getStats = async (): Promise<Array<Stat> | null> => {
  try {
    const url = 'stats';
    const { data } = await housingAxios(null).get(url);
    return data;
  } catch (err) {
    return null;
  }
};

// Novalet exports

export const listNovaletExports = async (): Promise<any> => {
  try {
    const url = 'reporting/listnovaletfiles';
    const { data } = await housingAxios(null).get(url);
    return data;
  } catch (err) {
    return [];
  }
};

export const downloadNovaletExport = async (
  filename: string
): Promise<AxiosResponse | null> => {
  try {
    const url = `reporting/novaletexport/${filename}`;
    return await housingAxios(null).get(url, { responseType: 'blob' });
  } catch (err) {
    return null;
  }
};

export const generateNovaletExport = async (): Promise<AxiosResponse> => {
  const url = `reporting/generatenovaletexport`;
  return await housingAxios(null).post(url, null);
};

export const downloadInternalReport = async (
  req: any
): Promise<AxiosResponse | null> => {
  try {
    const { reportType, startDate, endDate } = req.query;
    const url = `reporting/export?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`;
    return await housingAxios(req).get(url, { responseType: 'blob' });
  } catch (err) {
    return null;
  }
};

export const approveNovaletExport = async (
  filename: string
): Promise<AxiosResponse | null> => {
  try {
    const url = `reporting/approvenovaletexport/${filename}`;
    return await housingAxios(null).post(url, { filename });
  } catch (err) {
    return null;
  }
};

// Application history

export const getApplicationHistory = async (
  id: string,
  req: any
): Promise<ActivityHistoryPagedResult | null> => {
  try {
    const url = `activityhistory?targetId=${id}&pageSize=100`;
    const { data } = await activityAxios(req).get(url);
    return data;
  } catch (err) {
    return null;
  }
};

export const addNoteToHistory = async (
  id: string,
  request: AddNoteToHistory
): Promise<Array<AddNoteToHistory> | null> => {
  try {
    const url = `applications/${id}/note`;
    const { data } = await housingAxios(null).post(url, request);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
