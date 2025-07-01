import { Module } from '@nestjs/common';
import { QuestionController } from './domains/question/question.controller';
import { QuestionService } from './domains/question/question.service';
import { SubjectController } from './domains/subject/subject.controller';
import { SubjectService } from './domains/subject/subject.service';
import ImageController from './domains/image/image.controller';
import { S3Service } from './domains/image/aws.service';

@Module({
  imports: [],
  controllers: [QuestionController, SubjectController, ImageController],
  providers: [QuestionService, SubjectService, S3Service],
})
export class AppModule {}
