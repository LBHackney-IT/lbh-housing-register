import { NextApiHandler } from 'next';

const endpoint: NextApiHandler = async () => {
  throw new Error('ErrorThrowingPage api error');
};

export default endpoint;
