import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'viral-shop/images', resource_type: 'image' },
                (error, result) => {
                    if (error || !result) return reject(new BadRequestException('Error al subir imagen'));
                    resolve(result.secure_url);
                },
            ).end(file.buffer);
        });
    }

    async uploadVideo(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'viral-shop/videos', resource_type: 'video' },
                (error, result) => {
                    if (error || !result) return reject(new BadRequestException('Error al subir video'));
                    resolve(result.secure_url);
                },
            ).end(file.buffer);
        });
    }

    async uploadGif(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'viral-shop/gifs', resource_type: 'image', format: 'gif' },
                (error, result) => {
                    if (error || !result) return reject(new BadRequestException('Error al subir gif'));
                    resolve(result.secure_url);
                },
            ).end(file.buffer);
        });
    }

    async deleteFile(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId);
    }
}