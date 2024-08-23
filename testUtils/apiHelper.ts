import { RequestMethod, createMocks } from 'node-mocks-http';

import { ApiRequest, ApiResponse } from './types';

interface APIResponseRequest {
  req: ApiRequest;
  res: ApiResponse;
}

interface MockRequestResponseParams {
  hackneyToken: string;
  requestBody?: string;
  method?: RequestMethod;
}

export const generateMockRequestResponseWithHackneyToken = ({
  hackneyToken: token,
  requestBody,
  method = 'GET',
}: MockRequestResponseParams): APIResponseRequest => {
  const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
    method,
  });

  req.headers = {
    'content-type': 'Application/json',
    cookie: `hackneyToken=${token}`,
  };

  req.body = requestBody ?? '{}';

  return { req, res };
};
