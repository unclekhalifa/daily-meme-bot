const Twit = require("twit");
const {s3} = require("./libs/s3Client");

(async () => {
    const objects = await s3.listObjects({Bucket: process.env.BUCKET_NAME}).promise();
    console.log(objects);
})();