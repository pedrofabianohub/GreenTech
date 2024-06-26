const serverless = require('serverless-http');
const app = require('./backend');

module.exports.handler = async (event, context) => {
  const result = await serverless(app)(event, context);
  return result;
};
