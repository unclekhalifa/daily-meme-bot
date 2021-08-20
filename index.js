const Twitter = require("twitter");
const fs = require("fs");
const {s3} = require("./libs/s3Client");

require("dotenv").config();

const twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_SECRET_KEY,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const imageData = fs.readFileSync("./media/v2osk-Ovn1hyBge38-unsplash.jpg", {encoding: "base64"});

const main = {
    uploadMedia: (media_data) => new Promise((resolve, reject) => {
        twitterClient.post("media/upload", {media_data}, (error, media, _) => {
            if (error) reject(error);
            resolve(media.media_id_string);
        });
    }),

    postTweet: (status) => new Promise((resolve, reject) => {
        twitterClient.post("statuses/update", status, (error, tweet, _) => {
            if (error) reject(error);
            resolve(tweet);
        });
    })
};

(async () => {
    const objects = await s3.listObjects({Bucket: process.env.BUCKET_NAME}).promise();

    try {
        const mediaString = await main.uploadMedia(imageData);
        const tweet = await main.postTweet({
            status: "Hello World!",
            media_ids: mediaString
        });
        console.log(tweet);
    } catch (error) {
        debugger;
    }
})();