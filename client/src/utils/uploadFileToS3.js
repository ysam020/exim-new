import AWS from "aws-sdk";

AWS.config.update({
  region: "ap-south-1",
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

export const uploadFileToS3 = (file, folderName) => {
  const params = {
    Bucket: "alvision-exim-images",
    Key: `${folderName}/${file.name}`,
    Body: file,
    ContentType: file.type,
  };

  return s3.upload(params).promise();
};
