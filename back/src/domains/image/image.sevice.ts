const sharp = require('sharp');
import { Injectable } from '@nestjs/common'; // ou use sem decorator se não for NestJS

@Injectable()
export class ImageService {

  async resizeIfNecessary(file: Express.Multer.File): Promise<Buffer> {
    const image = sharp(file.buffer);
    const metadata = await image.metadata();

    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    if (width > 1000 || height > 1000) {
      const resizedImage = await image
        .resize({
          width: 500,
          height: 500,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toBuffer();

      return resizedImage;
    }
    return file.buffer;
  }

}