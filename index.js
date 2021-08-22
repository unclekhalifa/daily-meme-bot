const {
    s3,
    loadTweets
} = require("./libs/s3Client");

const {
    uploadVideo,
    makePost
} = require("./libs/twitter");

const {
    randomInteger,
    debugMode
} = require("./libs/utils");

require("dotenv").config();

const main = {
    run: async () => {
        const dayOfWeek = (new Date()).toLocaleDateString("default", {weekday: "long"});
        const dayOfWeekLower = dayOfWeek.toLowerCase();

        const s3Result = await s3.listObjects({Bucket: process.env.BUCKET_NAME, Prefix: dayOfWeekLower}).promise();
        const listOfMemes = s3Result.Contents.filter(({Key}) => Key !== `${dayOfWeekLower}/`);

        const memePath = listOfMemes[randomInteger(0, listOfMemes.length - 1)].Key;
        const memeData = await s3.getObject({
            Bucket: process.env.BUCKET_NAME,
            Key: memePath
        }).promise();

        const tweets = await loadTweets();
        const selectedTweet = tweets[dayOfWeekLower][randomInteger(0, tweets[dayOfWeekLower].length - 1)];

        const mediaString = await uploadVideo(memeData.Body, memeData.ContentType, memeData.ContentLength);
        const tweet = await makePost("statuses/update", {
            status: selectedTweet,
            media_ids: mediaString
        });

        console.log(tweet);
    }
};

if (debugMode()) {
    (async () => {
        try {
            await main.run();
        } catch (error) {
            debugger;
        }
    })();
} else {
    exports.handler = async (event) => {
        try {
            await main.run();
            return "Meme bot ran successfully"
        } catch (error) {
            return error;
        }
    };
}