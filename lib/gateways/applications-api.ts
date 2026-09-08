import axios, { AxiosResponse } from 'axios';
import { GetServerSidePropsContext, NextApiRequest } from 'next';
import { ActivityHistoryPagedResult } from '../../domain/ActivityHistoryApi';
import {
  AddNoteToHistoryRequest,
  Application,
  CreateAuthRequest,
  CreateAuthResponse,
  CreateEvidenceRequest,
  EvidenceRequestResponse,
  PaginatedApplicationListResponse,
  PaginatedSearchResultsResponse,
  VerifyAuthRequest,
  VerifyAuthResponse,
  InternalReportRequest,
} from '../../domain/HousingApi';
import { Stat } from '../../domain/stat';
import asssertServerOnly from '../utils/assertServerOnly';
import {
  activityAxios,
  authenticatedHousingAxios,
  housingAxios,
} from '../utils/axiosClients';

asssertServerOnly();

type AuthenticatedRequest = NextApiRequest | GetServerSidePropsContext['req'];

const emptyActivityHistoryPagedResult: ActivityHistoryPagedResult =
  Object.freeze({
    results: [],
    paginationDetails: {
      hasNext: false,
      nextToken: '',
    },
  });

export const getApplications = async (
  page: string,
  pageSize: string,
): Promise<PaginatedSearchResultsResponse | null> => {
  return (
    await housingAxios().get('applications', {
      params: { Page: parseInt(page), PageSize: parseInt(pageSize) },
    })
  ).data;
};

export const getApplicationsByStatus = async (
  status: string,
  page: string,
  pageSize: string,
): Promise<PaginatedSearchResultsResponse | null> => {
  return (
    await housingAxios().get('applications/ListApplicationsByStatus', {
      params: { status, Page: parseInt(page), PageSize: parseInt(pageSize) },
    })
  ).data;
};

export const getApplicationStatusCounts = async () => {
  return await housingAxios()
    .get('applications/breakdown/status')
    .then((response) => response.data);
};

export const getApplicationsByStatusAndAssignedTo = async (
  status: string,
  assignedTo: string,
  page: string,
  pageSize: string,
): Promise<PaginatedSearchResultsResponse | null> => {
  return (
    await housingAxios().get('applications/ListApplicationsByAssignedTo', {
      params: {
        status,
        assignedTo,
        Page: parseInt(page),
        PageSize: parseInt(pageSize),
      },
    })
  ).data;
};

export const getApplicationsByReference = async (
  reference: string,
  paginationToken?: string,
): Promise<PaginatedApplicationListResponse | null> => {
  return (
    await housingAxios().get('applications/ListApplicationsByReference', {
      params: {
        reference,
        paginationToken,
      },
    })
  ).data;
};

export const searchAllApplications = async (
  searchString: string,
  page: string,
  pageSize: string,
): Promise<PaginatedSearchResultsResponse | null> => {
  return (
    await housingAxios().post('applications/search', {
      Page: parseInt(page),
      PageSize: parseInt(pageSize),
      QueryString: searchString,
    })
  ).data;
};

// View and modify applications

export const getApplication = async (
  id: string,
): Promise<Application | null> => {
  const url = `applications/${encodeURIComponent(id)}`;
  const { data } = await housingAxios().get(url);
  return data;
};

export const addApplication = async (
  application: Partial<Application>,
  req: AuthenticatedRequest,
): Promise<Application | null> => {
  const url = `applications`;
  const { data } = await (
    await authenticatedHousingAxios(req)
  ).post(url, application);
  return data;
};

export const updateApplication = async (
  application: Partial<Application>,
  id: string,
  req: AuthenticatedRequest,
): Promise<Application | null> => {
  const url = `applications/${encodeURIComponent(id)}`;
  const { data } = await (
    await authenticatedHousingAxios(req)
  ).patch(url, application);
  return data;
};

export const completeApplication = async (
  id: string,
  req: AuthenticatedRequest,
): Promise<Application | null> => {
  const url = `applications/${encodeURIComponent(id)}/complete`;
  const { data } = await (
    await authenticatedHousingAxios(req)
  ).patch(url, null);
  return data;
};

// Evidence requests

export const createEvidenceRequest = async (
  id: string,
  request: CreateEvidenceRequest,
): Promise<Array<EvidenceRequestResponse> | null> => {
  const url = `applications/${encodeURIComponent(id)}/evidence`;
  const { data } = await housingAxios().post(url, request);
  return data;
};

export const createVerifyCode = async (
  request: CreateAuthRequest,
): Promise<CreateAuthResponse | null> => {
  const url = 'auth/generate';
  const { data } = await housingAxios().post(url, request);
  return data;
};

export const confirmVerifyCode = async (
  request: VerifyAuthRequest,
): Promise<VerifyAuthResponse | null> => {
  const url = 'auth/verify';
  const { data } = await housingAxios().post(url, request);
  return data;
};

export const getStats = async (): Promise<Array<Stat> | null> => {
  const url = 'stats';
  const { data } = await housingAxios().get(url);
  return data;
};

// Novalet export

export const listNovaletExports = async (
  numberToReturn: number,
): Promise<unknown> => {
  const url = `reporting/listnovaletfiles?numberToReturn=${numberToReturn}`;
  const { data } = await housingAxios().get(url);
  return data;
};

export const downloadNovaletExport = async (
  filename: string,
): Promise<AxiosResponse> => {
  const url = `reporting/novaletexport/${filename}`;
  return await housingAxios().get(url, {
    responseType: 'blob',
  });
};

export const generateNovaletExport = async (): Promise<AxiosResponse> => {
  const url = `reporting/generatenovaletexport`;
  return await housingAxios().post(url, null);
};

export const downloadInternalReport = async (
  reportDetails: InternalReportRequest,
  req: NextApiRequest,
): Promise<AxiosResponse> => {
  const url = `reporting/export`;
  return await (
    await authenticatedHousingAxios(req)
  ).post(url, reportDetails, {
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

export const approveNovaletExport = async (
  filename: string,
): Promise<AxiosResponse | null> => {
  const url = `reporting/approvenovaletexport/${filename}`;
  return await housingAxios().post(url, { filename });
};

// Application history

export const getApplicationHistory = async (
  id: string,
  req: AuthenticatedRequest,
): Promise<ActivityHistoryPagedResult | null> => {
  try {
    const { data } = await (
      await activityAxios(req)
    ).get('activityhistory', {
      params: { targetId: id, pageSize: 100 },
    });
    return data;
  } catch (ex) {
    // TODO API shoudln't make us do this
    // Note: I think this is now fixed. A re-test would confirm and then we can drop this block.
    if (axios.isAxiosError(ex) && ex.response?.status === 404) {
      return emptyActivityHistoryPagedResult;
    }
    throw ex;
  }
};

export const addNoteToHistory = async (
  id: string,
  note: AddNoteToHistoryRequest,
  req: AuthenticatedRequest,
): Promise<Array<AddNoteToHistoryRequest> | null> => {
  const url = `applications/${encodeURIComponent(id)}/note`;
  const { data } = await (await authenticatedHousingAxios(req)).post(url, note);
  return data;
};
