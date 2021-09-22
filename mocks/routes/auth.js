// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/get-started-routes

const auth = require('../data/auth');

const createVerifyCode = {
  id: 'create-code',
  url: '/api/auth/generate',
  method: 'POST',
  variants: [
    {
      id: 'success',
      response: {
        status: 200,
        body: auth,
      },
    },
    {
      id: 'not-found',
      response: {
        status: 404,
      },
    },
  ],
};

const confirmVerifyCode = {
  id: 'confirm-code',
  url: '/api/auth/confirm',
  method: 'POST',
  variants: [
    {
      id: 'success',
      response: {
        status: 200,
        body: auth,
      },
    },
    {
      id: 'not-found',
      response: {
        status: 404,
      },
    },
  ],
};

module.exports = [createVerifyCode, confirmVerifyCode];
