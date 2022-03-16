import { AddressLookupResult } from '../../domain/addressLookup';
import { Application } from '../../domain/HousingApi';

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

export const generateNovaletExport = async () => {
  const res = await fetch(`/api/reports/novalet/generate`, {
    method: 'POST',
    body: null,
  });
  return res;
};

export const approveNovaletExport = async (fileName: string) => {
  const res = await fetch(`/api/reports/novalet/${fileName}`, {
    method: 'POST',
    body: null,
  });

  return res;
};

// TODO wrong type.
export const addNoteToHistory = async (applicationId: string, request: any) => {
  const res = await fetch(`/api/applications/${applicationId}/note`, {
    method: 'POST',
    body: request,
  });
  return await res.json();
};
