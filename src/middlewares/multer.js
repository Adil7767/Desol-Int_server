import multer from 'multer';
import s3Client from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

const uploadToS3 = (req, res, next) => {
  if (!req.files) {
    return next();
  }

  const uploadPromises = req.files.map(file => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `cars/${uuidv4()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };
    return s3Client.upload(params).promise();
  });

  Promise.all(uploadPromises)
    .then(results => {
      req.fileUrls = results.map(result => result.Location);
      next();
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error uploading files');
    });
};

export { upload, uploadToS3 };
