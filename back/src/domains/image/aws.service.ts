import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandInput,
  } from '@aws-sdk/client-s3';
  import { Injectable } from '@nestjs/common';
  import { v4 as uuidv4 } from 'uuid';
  import { config } from 'dotenv';
  
  config(); // Carrega variáveis de ambiente
  
  @Injectable()
  export class S3Service {

    private s3: S3Client;
  
    constructor() {
      this.s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });
    }
  
    async uploadFile(file: Express.Multer.File, newBuffer: Buffer): Promise<string> {

        const folder = 'imagens'
        const key = `${folder}/${uuidv4()}`;
        
        const params: PutObjectCommandInput = {
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          Body: newBuffer,
          ContentType: file.mimetype,
        };
      
        await this.s3.send(new PutObjectCommand(params));
      
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

}