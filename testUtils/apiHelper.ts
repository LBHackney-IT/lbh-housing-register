import { RequestMethod, createMocks } from 'node-mocks-http';

import { ApiRequest, ApiResponse } from './types';

interface APIResponseRequest {
  req: ApiRequest;
  res: ApiResponse;
}

export function generateMockRequestResponse(
  token: string,
  method: RequestMethod = 'GET'
): APIResponseRequest {
  const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
    method,
  });

  req.headers = {
    'content-type': 'Application/json',
    cookie: `hackneyToken=${token}`,
  };

  return { req, res };
}
