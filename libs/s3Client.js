const AWS = require("aws-sdk");
require("dotenv").config();
const {debugMode} = require("./utils");

if (debugMode()) {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: process.env.AWS_PROFILE});
}

const s3 = new AWS.S3({apiVersion: process.env.S3_API_VERSION});

const loadTweets = async () => {
    const tweetsResult = await s3.getObject({
        Bucket: process.env.BUCKET_NAME,
        Key: "tweets.json"
    }).promise();
    return JSON.parse(tweetsResult.Body.toString());
};

module.exports = {
    s3,
    loadTweets
};