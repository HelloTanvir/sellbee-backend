import aws from 'aws-sdk';
import createHttpError from 'http-errors';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

const imageUpload = multer({
    storage: multerS3({
        s3,
        bucket: 'sellbeez-products',
        acl: 'public-read',
        metadata(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            const fileExt = path.extname(file.originalname);
            const fileName = `${file.originalname
                .replace(fileExt, '')
                .toLowerCase()
                .split(' ')
                .join('-')}-${Date.now()}`;

            cb(null, fileName + fileExt);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new createHttpError.BadRequest('Only .jpg, jpeg or .png format allowed!') as any,
                false
            );
        }
    },
});

export default imageUpload;
