import { subjects } from "../../db/schema";
import { KnowledgeArea, NewSubject, Subject } from 'src/lib/types';
import { db } from '../../db/index';
import { eq } from 'drizzle-orm';

export async function findSubjectByknowledgeArea(knowledgeArea: KnowledgeArea): Promise<Subject[]> {

    const filteredSubjects = await db
      .select()
      .from(subjects)
      .where(eq(subjects.knowledgeArea, knowledgeArea));

    return filteredSubjects;
    
}