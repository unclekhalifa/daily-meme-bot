const Twitter = require("twitter");

const twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_SECRET_KEY,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const uploadImage = (image) => makePost("media/upload", {media: image});

const uploadVideo = async (data, type, size) => {
    const mediaId = (await makePost("media/upload", {
        command: "INIT",
        total_bytes: size,
        media_type: type
    })).media_id_string;
    await makePost("media/upload", {
        command: "APPEND",
        media_id: mediaId,
        media: data,
        segment_index: 0
    });
    await makePost("media/upload", {
        command: "FINALIZE",
        media_id: mediaId
    });
    return mediaId;
};

const makePost = (endpoint, params) => new Promise((resolve, reject) => {
    twitterClient.post(endpoint, params, (error, data, _) => {
        if (error) reject(error);
        else resolve(data);
    });
});

module.exports = {
    twitterClient,
    uploadImage,
    uploadVideo,
    makePost
};