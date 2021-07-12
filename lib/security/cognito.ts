import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

//https://stackoverflow.com/questions/60958980/how-to-verify-accesstoken-in-node-express-using-aws-amplify

const COGNITO_URL = `https://cognito-idp.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/`;

const CognitoAuthentication = async (req: any, res: any) => {
  try {
    console.log('cognito auth');

    const accessToken = req.headers.authorization.split(' ')[1];

    const { data } = await axios.post(
      COGNITO_URL,
      {
        AccessToken: accessToken,
      },
      {
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser',
        },
      }
    );

    req.user = data;

    return res.status(StatusCodes.OK);
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Auth failed',
    });
  }
};

export default CognitoAuthentication;
