// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/get-started-routes

const stats = require('../data/stats');

const getStats = {
  id: 'get-stats',
  url: '/api/stats',
  method: 'GET',
  variants: [
    {
      id: 'success',
      response: {
        status: 200,
        body: stats,
      },
    },
  ],
};

module.exports = [getStats];
