interface ResponseCodes {
  [key: string]: string;
}

const ErrorResponseCodes: ResponseCodes = {
  UsernameExistsException: 'An account with the given email already exists.',
  CodeMismatchException:
    'Invalid verification code provided, please try again.',
};

export default ErrorResponseCodes;
