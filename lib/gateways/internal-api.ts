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

  if (res.ok) {
    return (await res.json()) as Application;
  } else {
    throw Error(`Unable to update application (${res.status})`);
  }
};

export const createApplication = async (application: Application) => {
  const res = await fetch(`/api/applications`, {
    method: 'POST',
    body: JSON.stringify(application),
  });

  if (res.ok) {
    return (await res.json()) as Application;
  } else {
    throw Error(`Unable to create application (${res.status})`);
  }
};

export const completeApplication = async (application: Application) => {
  const res = await fetch(`/api/applications/${application.id}/complete`, {
    method: 'PATCH',
    body: JSON.stringify(application),
  });
  if (res.ok) {
    return (await res.json()) as Application;
  } else {
    throw Error(`Unable to complete application (${res.status})`);
  }
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
