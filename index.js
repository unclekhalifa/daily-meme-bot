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

const main = {
    uploadImage: (image) => new Promise((resolve, reject) => {
        twitterClient.post("media/upload", {media: image}, (error, media, _) => {
            if (error) reject(error);
            resolve(media.media_id_string);
        });
    }),

    uploadVideo: async (data, type, size) => {
        let mediaId = (await main.makePost("media/upload", {
            command: "INIT",
            total_bytes: size,
            media_type: type
        })).media_id_string;
        await main.makePost("media/upload", {
            command: "APPEND",
            media_id: mediaId,
            media: data,
            segment_index: 0
        });
        await main.makePost("media/upload", {
            command: "FINALIZE",
            media_id: mediaId
        });
        return mediaId;
    },

    makePost: function (endpoint, params) {
        return new Promise((resolve, reject) => {
            twitterClient.post(endpoint, params, (error, data, _) => {
                if (error) reject(error);
                else resolve(data);
            });
        });
    },

    randomInteger: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
};

(async () => {
    const dayOfWeek = (new Date()).toLocaleDateString("default", {weekday: "long"});
    const dayOfWeekLower = dayOfWeek.toLowerCase();
    const s3Result = await s3.listObjects({Bucket: process.env.BUCKET_NAME, Prefix: dayOfWeekLower}).promise();
    const memesToChooseFrom = s3Result.Contents.filter(({Key}) => Key !== `${dayOfWeekLower}/`);

    const memePath = memesToChooseFrom[main.randomInteger(0, memesToChooseFrom.length - 1)].Key;
    const memeResult = await s3.getObject({
        Bucket: process.env.BUCKET_NAME,
        Key: memePath,

    }).promise();

    try {
        const mediaString = await main.uploadVideo(memeResult.Body, memeResult.ContentType, memeResult.ContentLength);
        const tweet = await main.makePost("statuses/update", {
            status: dayOfWeek + " let's GOOOO",
            media_ids: mediaString
        });
    } catch (error) {
        debugger;
    }
})();