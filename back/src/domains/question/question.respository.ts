import { alternatives, questions, subjects } from "../../db/schema";
import { Alternative, CompleteQuestion, NewAlternative, NewCompleteQuestion, NewQuestion, Question, Subject, questionPayload} from 'src/lib/types';
import { db } from '../../db/index';
import { eq } from "drizzle-orm"
import { getFormattedQuestion } from "./chatgpt";
export async function createQuestion(question: questionPayload): Promise<CompleteQuestion> {


  const completeQuestion: CompleteQuestion | null = await getFormattedQuestion(question);

  if(completeQuestion != null){

    const [createdQuestion] = await db
    .insert(questions)
    .values(completeQuestion)
    .returning()
    .execute();

    for(const alternative of question.alternatives){

      alternative.questionId = createdQuestion.id;
      
    }
  
    const createdAlternatives: Alternative[] = await db
      .insert(alternatives)
      .values(question.alternatives)
      .returning()
      .execute();

    
    const questionSubject: Subject = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, completeQuestion?.subjectId))
      .execute();
      
      return {
        ...createdQuestion,
        alternatives: createdAlternatives,
        subject: questionSubject  
      };

  }

  throw Error('Error while trying to create the question')
    
}

export async function findQuestionById( questionId : number): Promise<CompleteQuestion> {

  const [findedQuestion] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, questionId))
    .execute();

    const questionAlternatives: Alternative[] = await db
    .select()
    .from(alternatives)
    .where(eq(alternatives.questionId, questionId))
    .execute();

    const [questionSubject] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, findedQuestion.subjectId))
    .execute();

    return {
      ...findedQuestion,
      alternatives: questionAlternatives,
      subject: questionSubject,
    };
    
}