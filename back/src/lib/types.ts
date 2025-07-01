import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { questions, alternatives, subjects } from "../db/schema";
import { type } from "os";

// Tipos baseados nos modelos do banco
export type Question = InferSelectModel<typeof questions>;
export type NewQuestion = InferInsertModel<typeof questions>;

export type Alternative = InferSelectModel<typeof alternatives>;
export type NewAlternative = InferInsertModel<typeof alternatives>;

export type Subject = InferSelectModel<typeof subjects>;
export type NewSubject = InferInsertModel<typeof subjects>;

// Enums explícitos (caso você use fora do schema também)
export type KnowledgeArea = "NATURE" | "HUMANITIES" | "MATHEMATICS" | "LANGUAGES";
export type QuestionType = "premium" | "free";


export type CompleteQuestion = Question & {
    alternatives: Alternative[];
    subject: Subject
};

export type NewCompleteQuestion = NewQuestion & {
    alternatives: NewAlternative[];
    subject: Subject;
};


export type questionPayload = {
    id: number,
    year: number,
    knowledgeArea: KnowledgeArea,
    title: string,
    context: string,
    alternativesIntroduction: string,
    correctAnswer: string,
    type: string,
    alternatives: NewAlternative[]
}