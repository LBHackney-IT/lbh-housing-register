import NextAuth from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next-auth/internals/utils';
import Providers from 'next-auth/providers';

const options = {
  providers: [
    Providers.Okta({
      clientId: process.env.OKTA_CLIENTID,
      clientSecret: process.env.OKTA_CLIENTSECRET,
      domain: process.env.OKTA_DOMAIN,
    }),
  ],
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
