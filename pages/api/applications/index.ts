import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { addApplication, getApplications } from '../../../lib/gateways/applications-api';

const endpoint: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {

  switch (req.method) {
    case 'GET':
      try {
        const data = await getApplications()
        res
          .status(StatusCodes.OK)
          .json(data)

      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to get applications' })
      }
      break;

    case 'POST':
      try {
        const application = JSON.parse(req.body)
        const data = await addApplication(application)
        res
          .status(StatusCodes.OK)
          .json(data)

      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to add application' })
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' })
  }
}

export default endpoint
