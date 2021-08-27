interface ResponseCodes {
  [key: string]: string;
}

const ErrorResponseCodes: ResponseCodes = {
  UsernameExistsException: 'An account with the given email already exists.',
  CodeMismatchException:
    'Invalid verification code provided, please try again.',
  CodeDeliveryFailureException:
    'An internal error occurred, please try again later',
  InternalErrorException: 'An internal error occurred, please try again later',
  InvalidLambdaResponseException:
    'An internal error occurred, please try again later',
  InvalidParameterException:
    'An internal error occurred, please try again later',
  InvalidPasswordException:
    'An internal error occurred, please try again later',
  InvalidSmsRoleAccessPolicyException:
    'An internal error occurred, please try again later',
  InvalidSmsRoleTrustRelationshipException:
    'An internal error occurred, please try again later',
  NotAuthorizedException: 'You are not authorised to perform this action',
  ResourceNotFoundException:
    'An internal error occurred, please try again later',
  TooManyRequestsException:
    'An internal error occurred, please try again later',
  UnexpectedLambdaException:
    'An internal error occurred, please try again later',
};

export default ErrorResponseCodes;
