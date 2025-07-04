import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { S3Service } from "./aws.service";
import sharp from 'sharp';
import { ImageService } from "./image.sevice";

@Controller('/upload-images')
export default class ImageController{

    constructor(
        private readonly s3Service: S3Service,
        private readonly imageService: ImageService
        ) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {


        const resizedImage = await this.imageService.resizeIfNecessary(file)

        const imageUrl = await this.s3Service.uploadFile(file, resizedImage);
        return { imageUrl };

    };

}