const AWS = require("aws-sdk");
require("dotenv").config();

const credentials = new AWS.SharedIniFileCredentials({profile: process.env.AWS_PROFILE});
AWS.config.credentials = credentials;

const s3 = new AWS.S3({apiVersion: process.env.S3_API_VERSION});

module.exports = {
    s3
};