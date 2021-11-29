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
  // console.log(res);

  return (await res.json()) as Application;
};
