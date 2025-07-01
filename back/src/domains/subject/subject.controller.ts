import { Controller, Get, Param, Query } from "@nestjs/common";

import { SubjectService } from "./subject.service";
import { KnowledgeArea, Question } from "src/lib/types";
import { Subject } from "../../lib/types";

@Controller('subjects')
export class SubjectController{

    constructor(private readonly subjectService: SubjectService){}

    @Get('')
    async getSubjectByknowledgeArea( @Query('knowledgeArea') knowledgeArea: KnowledgeArea) : Promise<Subject[]>{
        
        return await this.subjectService.getSubjectsByknowledgeAreaArea(knowledgeArea);

    }
    
}