import { Injectable } from '@nestjs/common';
import { KnowledgeArea, Subject } from 'src/lib/types';
import { findSubjectByknowledgeArea } from './subject.respository';

@Injectable()
export class SubjectService {

  async getSubjectsByknowledgeAreaArea(area: KnowledgeArea): Promise<Subject[]> {

    return await findSubjectByknowledgeArea(area);
    
  }

}