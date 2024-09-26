import { RequestMethod, createMocks } from 'node-mocks-http';

import { ApiRequest, ApiResponse } from './types';

interface APIResponseRequest {
  req: ApiRequest;
  res: ApiResponse;
}

export interface MockRequestResponseParams {
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req.headers = {
    'content-type': 'Application/json',
    cookie: `hackneyToken=${token}`,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req.body = requestBody ?? '{}';

  return { req, res };
};
