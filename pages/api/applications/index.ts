import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Application } from '../../../domain/HousingApi';
import { addApplication } from '../../../lib/gateways/applications-api';

const endpoint: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'POST':
      try {
        const application: Application = JSON.parse(req.body);
        const applicationWithID: Application = {
          ...application,
          mainApplicant: {
            ...application.mainApplicant,
            person: {
              ...application.mainApplicant?.person
            },
            address: {
              ...application.mainApplicant?.address
            },
            contactInformation: {
              ...application.mainApplicant?.contactInformation
            }
          },
        };

        const data = await addApplication(applicationWithID);
        res.status(StatusCodes.OK).json(data);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Unable to add application' });
      }
      break;

    default:
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid request method' });
  }
};

export default endpoint;
