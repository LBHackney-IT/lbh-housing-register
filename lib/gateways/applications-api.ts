import axios, { AxiosResponse, AxiosStatic } from 'axios';

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

const emptyPaginatedApplicationListResponse: PaginatedApplicationListResponse =
  Object.freeze({
    totalItems: 0,
    numberOfItemsPerPage: 0,
    page: 0,
    pageEndOffSet: 0,
    pageStartOffSet: 0,
    results: [],
    totalNumberOfPages: 0,
  });

const emptyActivityHistoryPagedResult: ActivityHistoryPagedResult =
  Object.freeze({
    results: [],
    paginationDetails: {
      hasNext: false,
      nextToken: '',
    },
  });

export const getApplications = async (
  page: string | number,
  user?: string | 'unassigned'
): Promise<PaginatedApplicationListResponse | null> => {
  const assignedTo = user ?? '';
  const url = `applications?page=${page}&assignedTo=${assignedTo}`;
  try {
    return (await housingAxios(null).get(url)).data;
  } catch (ex) {
    // TODO API shoudln't make us do this
    if (axios.isAxiosError(ex) && ex.response?.status === 404) {
      return emptyPaginatedApplicationListResponse;
    }
    throw ex;
  }
};

export const searchApplications = async (
  page: string,
  reference: string,
  status: string,
  user?: string | 'unassigned'
): Promise<PaginatedApplicationListResponse | null> => {
  const assignedTo = user ?? '';
  const url = `applications?page=${page}&reference=${reference}&status=${status}&assignedTo=${assignedTo}`;
  try {
    return (await housingAxios(null).get(url)).data;
  } catch (ex) {
    // TODO API shoudln't make us do this
    if (axios.isAxiosError(ex) && ex.response?.status === 404) {
      return emptyPaginatedApplicationListResponse;
    }
    throw ex;
  }
};

// View and modify applications

export const getApplication = async (
  id: string
): Promise<Application | null> => {
  const url = `applications/${id}`;
  const { data } = await housingAxios(null).get(url);
  return data;
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
  try {
    const { data } = await housingAxios(req).patch(url, application);
    return data;
  } catch (ex) {
    console.log(ex);

    return null;
  }
};

export const completeApplication = async (
  id: string,
  req: any
): Promise<Application | null> => {
  const url = `applications/${id}/complete`;
  const { data } = await housingAxios(req).patch(url, null);
  return data;
};

// Evidence requests

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
  const url = 'stats';
  const { data } = await housingAxios(null).get(url);
  return data;
};

// Novalet export

export const listNovaletExports = async (): Promise<any> => {
  const url = 'reporting/listnovaletfiles';
  const { data } = await housingAxios(null).get(url);
  return data;
};

export const downloadNovaletExport = async (
  filename: string
): Promise<AxiosResponse | null> => {
  const url = `reporting/novaletexport/${filename}`;
  return await housingAxios(null).get(url, { responseType: 'blob' });
};

export const generateNovaletExport = async (): Promise<AxiosResponse> => {
  const url = `reporting/generatenovaletexport`;
  return await housingAxios(null).post(url, null);
};

export const downloadInternalReport = async (
  req: any
): Promise<AxiosResponse | null> => {
  const { reportType, startDate, endDate } = req.query;
  const url = `reporting/export?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`;
  return await housingAxios(req).get(url, { responseType: 'blob' });
};

export const approveNovaletExport = async (
  filename: string
): Promise<AxiosResponse | null> => {
  const url = `reporting/approvenovaletexport/${filename}`;
  return await housingAxios(null).post(url, { filename });
};

// Application history

export const getApplicationHistory = async (
  id: string,
  req: any
): Promise<ActivityHistoryPagedResult | null> => {
  const url = `activityhistory?targetId=${id}&pageSize=100`;
  try {
    const { data } = await activityAxios(req).get(url);
    return data;
  } catch (ex) {
    // TODO API shoudln't make us do this
    if (axios.isAxiosError(ex) && ex.response?.status === 404) {
      return emptyActivityHistoryPagedResult;
    }
    throw ex;
  }
};

export const addNoteToHistory = async (
  id: string,
  request: AddNoteToHistory
): Promise<Array<AddNoteToHistory> | null> => {
  const url = `applications/${id}/note`;
  const { data } = await housingAxios(null).post(url, request);
  return data;
};
