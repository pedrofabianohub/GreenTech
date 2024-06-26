const serverless = require('serverless-http');
const app = require('./backend');

module.exports.handler = serverless(app);
