import { type NextApiRequest, type NextApiResponse, type NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { authOptions } from '~/server/auth';

const authHandler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, authOptions);
}

export default authHandler;
