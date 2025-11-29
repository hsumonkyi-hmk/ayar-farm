import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const baseFolder = process.env.CLOUDINARY_FOLDER || 'AyarFarm';

const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: `${baseFolder}/images`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    } as any,
});

const pdfStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: `${baseFolder}/documents`,
        allowed_formats: ['pdf'],
        resource_type: 'raw',
    } as any,
});

const videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: `${baseFolder}/videos`,
        allowed_formats: ['mp4', 'avi', 'mov', 'mkv'],
        resource_type: 'video',
    } as any,
});

const fileStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: `${baseFolder}/files`,
        resource_type: 'auto',
    } as any,
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadPDF = multer({ storage: pdfStorage });
export const uploadVideo = multer({ storage: videoStorage });
export const uploadFile = multer({ storage: fileStorage });
