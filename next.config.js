module.exports = {
  future: {
    webpack5: true,
  },
  reactStrictMode: true,
  env: {
    ENDPOINT_API: process.env.ENDPOINT_API,
    AWS_KEY: process.env.AWS_KEY
  }
}