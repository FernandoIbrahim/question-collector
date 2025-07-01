import { Injectable } from '@nestjs/common';

import { createQuestion, findQuestionById } from './question.respository';
import { CompleteQuestion, NewCompleteQuestion, NewQuestion, Question, questionPayload } from 'src/lib/types';

@Injectable()
export class QuestionService {

  async create(question: questionPayload): Promise<CompleteQuestion> {

    return await createQuestion(question);

  }

  async getQuestionById(id: number): Promise<CompleteQuestion> {

    return await findQuestionById(id);

  }

}