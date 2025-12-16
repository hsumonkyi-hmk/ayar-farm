import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';
import path from 'path';

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
    params: async (req, file) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        return {
            folder: `${baseFolder}/files`,
            resource_type: 'raw',
            public_id: `${name}-${Date.now()}${ext}`,
        };
    }
});

const resourceStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);

        if (file.mimetype.startsWith('image/')) {
            return {
                folder: `${baseFolder}/images`,
                resource_type: 'image',
                public_id: `${name}-${Date.now()}`,
            };
        } else if (file.mimetype.startsWith('video/')) {
            return {
                folder: `${baseFolder}/videos`,
                resource_type: 'video',
                public_id: `${name}-${Date.now()}`,
            };
        } else {
            return {
                folder: `${baseFolder}/files`,
                resource_type: 'raw',
                public_id: `${name}-${Date.now()}${ext}`,
            };
        }
    }
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadVideo = multer({ storage: videoStorage });
export const uploadFile = multer({ storage: fileStorage });
export const uploadResource = multer({ storage: resourceStorage });