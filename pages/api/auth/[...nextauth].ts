import NextAuth from 'next-auth';
import type { NextApiHandler } from 'next';

import {
  assertStaffAuthEnvironment,
  authOptions,
} from '../../../lib/auth/options';

const handler: NextApiHandler = (req, res) => {
  assertStaffAuthEnvironment();
  return NextAuth(req, res, authOptions);
};

export default handler;
