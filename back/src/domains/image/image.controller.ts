import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { S3Service } from "./aws.service";

@Controller('/upload-images')
export default class ImageController{

    constructor(private readonly s3Service: S3Service) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {

        const imageUrl = await this.s3Service.uploadFile(file);
        return { imageUrl };

    };

}