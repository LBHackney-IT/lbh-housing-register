import { AddressLookupResult } from '../../domain/addressLookup';
import { AddNoteToHistoryRequest, Application } from '../../domain/HousingApi';

export class CreateApplicationError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly applicationIds: string[] = [],
  ) {
    super(message);
    this.name = 'CreateApplicationError';
  }
}

type ApiErrorBody = {
  message?: string;
  applicationIds?: string[];
};

const readApiErrorBody = async (res: Response): Promise<ApiErrorBody> => {
  try {
    return (await res.json()) as ApiErrorBody;
  } catch (error) {
    console.error('Unable to parse API error response', error);
    return {};
  }
};

// Handle 409 error responses which may have multiple historic applications with the same email address.
const createApplicationErrorMessage = (
  status: number,
  body: ApiErrorBody,
): string => {
  if (status !== 409) {
    return body.message ?? `Unable to create application (${status})`;
  }

  return (body.applicationIds?.length ?? 0) > 1
    ? 'Applications already exist for this email address.'
    : 'An application already exists for this email address.';
};

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
  }

  // Surface validation messages, e.g. duplicate bidding number.
  const body = await readApiErrorBody(res);
  throw Error(body.message ?? `Unable to update application (${res.status})`);
};

export const createApplication = async (application: Application) => {
  const res = await fetch(`/api/applications`, {
    method: 'POST',
    body: JSON.stringify(application),
  });

  if (res.ok) {
    return (await res.json()) as Application;
  }

  const body = await readApiErrorBody(res);
  throw new CreateApplicationError(
    createApplicationErrorMessage(res.status, body),
    res.status,
    body.applicationIds ?? [],
  );
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
  request: AddNoteToHistoryRequest,
) => {
  const res = await fetch(`/api/applications/${applicationId}/note`, {
    method: 'POST',
    body: JSON.stringify(request),
  });

  if (res.ok) {
    return await res.json();
  }

  const body = await readApiErrorBody(res);
  throw Error(body.message ?? `Unable to add note (${res.status})`);
};
