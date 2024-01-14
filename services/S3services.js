const AWS = require("aws-sdk");

const uploadToS3 = async (data, file) => {
    const BUCKET_NAME = "expensetracker1820";
    const IAM_USER_KEY = process.env.IAM_KEY;
    const IAM_USER_SECRET = process.env.IAM_SECRETKEY;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME
    })
    let params = {
        Bucket: BUCKET_NAME,
        Key: file,
        Body: data,
        ACL: "public-read"  
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (error, result) => {
            if (error) {
                reject("Error in uploading file");
            } else {
                resolve(result.Location);
            }
        })
    })
}

module.exports = {
    uploadToS3
};