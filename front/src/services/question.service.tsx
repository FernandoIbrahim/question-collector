import axios from 'axios';

import { z } from 'zod';
import { questionFromSchema } from '@/lib/types';

type QuestionFormType = z.infer<typeof questionFromSchema>;

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API;

export async function postQuestion(body: QuestionFormType) {

  const response = await axios.post(apiUrl+'/questions', body);
  return response.data;
      

}

