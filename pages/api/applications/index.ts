import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { addApplication, updateApplication } from '../../../lib/gateways/applications-api';

const endpoint: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {

  switch (req.method) {
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

    case 'PATCH':
      try {
        const application = JSON.parse(req.body)
        const id = "161621af-03bc-47ff-86d9-ada7862aa00a" // Placeholder
        const data = await updateApplication(application, id)
        res
          .status(StatusCodes.OK)
          .json(data)

      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to update application' })
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' })
  }
}

export default endpoint
