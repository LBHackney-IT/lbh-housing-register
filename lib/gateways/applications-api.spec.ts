/** @jest-environment node */

import { createRequest } from 'node-mocks-http';

import {
  activityAxios,
  authenticatedHousingAxios,
  housingAxios,
} from '../utils/axiosClients';
import {
  addNoteToHistory,
  completeApplication,
  createEvidenceRequest,
  getApplication,
  getApplicationHistory,
  updateApplication,
} from './applications-api';

jest.mock('../utils/axiosClients', () => ({
  activityAxios: jest.fn(),
  authenticatedHousingAxios: jest.fn(),
  housingAxios: jest.fn(),
}));

const housingAxiosMock = housingAxios as jest.MockedFunction<
  typeof housingAxios
>;
const authenticatedHousingAxiosMock =
  authenticatedHousingAxios as jest.MockedFunction<
    typeof authenticatedHousingAxios
  >;
const activityAxiosMock = activityAxios as jest.MockedFunction<
  typeof activityAxios
>;

describe('application gateway URLs', () => {
  const id = 'https://attacker.example/../applications?admin=true#fragment';
  const encodedId = encodeURIComponent(id);
  const httpRequest = createRequest();
  const get = jest.fn();
  const post = jest.fn();
  const patch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    get.mockResolvedValue({ data: {} });
    post.mockResolvedValue({ data: {} });
    patch.mockResolvedValue({ data: {} });
    housingAxiosMock.mockReturnValue({ get, post } as never);
    authenticatedHousingAxiosMock.mockResolvedValue({ post, patch } as never);
    activityAxiosMock.mockResolvedValue({ get } as never);
  });

  it('encodes an application ID used in a read path', async () => {
    await getApplication(id);

    expect(get).toHaveBeenCalledWith(`applications/${encodedId}`);
  });

  it('encodes an application ID used in an update path', async () => {
    const application = { id };

    await updateApplication(application, id, httpRequest);

    expect(patch).toHaveBeenCalledWith(
      `applications/${encodedId}`,
      application,
    );
  });

  it('encodes an application ID used in a completion path', async () => {
    await completeApplication(id, httpRequest);

    expect(patch).toHaveBeenCalledWith(
      `applications/${encodedId}/complete`,
      null,
    );
  });

  it('encodes an application ID used in an evidence path', async () => {
    const evidenceRequestBody = {} as Parameters<
      typeof createEvidenceRequest
    >[1];

    await createEvidenceRequest(id, evidenceRequestBody, httpRequest);

    expect(post).toHaveBeenCalledWith(
      `applications/${encodedId}/evidence`,
      evidenceRequestBody,
      { headers: {} },
    );
  });

  it('passes the resident token in X-Resident-Token for evidence requests', async () => {
    const evidenceRequestBody = {} as Parameters<
      typeof createEvidenceRequest
    >[1];
    const residentHttpRequest = createRequest({
      headers: { cookie: 'housing_user=resident.jwt.token' },
    });

    await createEvidenceRequest(id, evidenceRequestBody, residentHttpRequest);

    expect(post).toHaveBeenCalledWith(
      `applications/${encodedId}/evidence`,
      evidenceRequestBody,
      { headers: { 'X-Resident-Token': 'resident.jwt.token' } },
    );
  });

  it('encodes an application ID used in a note path', async () => {
    const note = { Note: 'A note' };

    await addNoteToHistory(id, note, httpRequest);

    expect(post).toHaveBeenCalledWith(`applications/${encodedId}/note`, note);
  });

  it('passes an activity-history ID as an encoded query parameter', async () => {
    await getApplicationHistory(id, httpRequest);

    expect(get).toHaveBeenCalledWith('activityhistory', {
      params: { targetId: id, pageSize: 100 },
    });
  });
});
