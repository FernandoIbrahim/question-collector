import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CompleteQuestion, NewCompleteQuestion, NewQuestion, Question, questionPayload } from '../../lib/types';

@Controller('questions')
export class QuestionController {
  
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(@Body() question: questionPayload): Promise<CompleteQuestion> {

    return await this.questionService.create(question);

  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<CompleteQuestion> {
    
    return await this.questionService.getQuestionById(id);    

  }

}