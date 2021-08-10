import { AddressLookupResult } from '../../domain/addressLookup';
import { NotifyRequest, NotifyResponse } from '../../domain/govukNotify';

export const lookUpAddress = async (postCode: string) => {
  const res = await fetch(`/api/address/${postCode}`, {
    method: 'GET',
  });

  return (await res.json()) as AddressLookupResult;
};

export const sendNewApplicationEmail = async (notification: NotifyRequest) => {
  const res = await fetch(`/api/notify/new-application`, {
    method: 'POST',
    body: JSON.stringify(notification),
  });

  return (await res.json()) as NotifyResponse;
};
