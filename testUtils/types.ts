import { NextApiRequest, NextApiResponse, Redirect } from 'next';
import { createRequest, createResponse } from 'node-mocks-http';

export type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
export type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

export interface GetAuthTestResponse {
  redirect: Redirect;
}
