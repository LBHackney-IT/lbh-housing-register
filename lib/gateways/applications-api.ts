import { AxiosResponse } from 'axios';
import { activityAxios, housingAxios } from '../utils/axiosClients';
import { ActivityHistoryPagedResult } from '../../domain/ActivityHistoryApi';
import {
  Application,
  CreateAuthRequest,
  CreateAuthResponse,
  CreateEvidenceRequest,
  EvidenceRequestResponse,
  InternalReportRequest,
  PaginatedApplicationListResponse,
  VerifyAuthRequest,
  VerifyAuthResponse,
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

export const listNovaletExports = async (req: any): Promise<any[]> => {
  try {
    const url = 'reporting/listnovaletfiles';
    const { data } = await housingAxios(req).get(url);
    return data;
  } catch (err) {
    return [];
  }
};

export const downloadNovaletExport = async (
  filename: string,
  req: any
): Promise<AxiosResponse | null> => {
  try {
    const url = `reporting/novaletexport/${filename}`;
    return await housingAxios(req).get(url, { responseType: 'blob' });
  } catch (err) {
    return null;
  }
};

export const generateNovaletExport = async (
  req: any
): Promise<AxiosResponse> => {
  const url = `reporting/generatenovaletexport`;
  return await housingAxios(req).post(url, null);
};

export const approveNovaletExport = async (
  filename: string,
  req: any
): Promise<AxiosResponse> => {
  const url = `reporting/approvenovaletexport/${filename}`;
  return await housingAxios(req).post(url, null);
};

export const deleteNovaletExport = async (
  filename: string,
  req: any
): Promise<AxiosResponse> => {
  const url = `reporting/deletenovaletexport/${filename}`;
  return await housingAxios(req).post(url, null);
};

export const downloadInternalReport = async (
  data : InternalReportRequest,
  req: any
): Promise<AxiosResponse | null> => {
  try {
    const url = `reporting/export`;
    const response = await housingAxios(req).post(url, data, { responseType: 'blob' });
    return response;
    
  } catch (err) {
    return null;
  }
};

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
