import { Module } from '@nestjs/common';
import { QuestionController } from './domains/question/question.controller';
import { QuestionService } from './domains/question/question.service';
import { SubjectController } from './domains/subject/subject.controller';
import { SubjectService } from './domains/subject/subject.service';
import ImageController from './domains/image/image.controller';
import { S3Service } from './domains/image/aws.service';
import { ImageService } from './domains/image/image.sevice';

@Module({
  imports: [],
  controllers: [QuestionController, SubjectController, ImageController],
  providers: [QuestionService, SubjectService, S3Service, ImageService],
})
export class AppModule {}
