import { AddressLookupResult } from '../../domain/addressLookup';
import { AddNoteToHistoryRequest, Application } from '../../domain/HousingApi';

export const lookUpAddress = async (postCode: string) => {
  const res = await fetch(`/api/address/${postCode}`, {
    method: 'GET',
  });

  return (await res.json()) as AddressLookupResult;
};

export const updateApplication = async (application: Application) => {
  const res = await fetch(`/api/applications/${application.id}`, {
    method: 'PATCH',
    body: JSON.stringify(application),
  });
  return (await res.json()) as Application;
};

export const createApplication = async (application: Application) => {
  const res = await fetch(`/api/applications`, {
    method: 'POST',
    body: JSON.stringify(application),
  });
  return (await res.json()) as Application;
};

export const completeApplication = async (application: Application) => {
  const res = await fetch(`/api/applications/${application.id}/complete`, {
    method: 'PATCH',
    body: JSON.stringify(application),
  });
  return (await res.json()) as Application;
};

export const downloadInternalReport = async (report: any) => {
  console.log('internal-api', JSON.stringify(report));

  const res = await fetch(`/api/reports/internal/download`, {
    method: 'POST',
    body: JSON.stringify(report),
  });
  // return await res.json();
};

export const generateNovaletExport = async () => {
  const res = await fetch(`/api/reports/novalet/generate`, {
    method: 'POST',
    body: null,
  });
  return res;
};

export const approveNovaletExport = async (fileName: string) => {
  const res = await fetch(`/api/reports/novalet/approve/${fileName}`, {
    method: 'POST',
    body: null,
  });

  return res;
};

export const addNoteToHistory = async (
  applicationId: string,
  request: AddNoteToHistoryRequest
) => {
  const res = await fetch(`/api/applications/${applicationId}/note`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return await res.json();
};
