const { app } = require('../users');

const serverless = require("serverless-http")

module.exports.handler = serverless(app)