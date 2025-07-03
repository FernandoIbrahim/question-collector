import {
    pgTable,
    serial,
    text,
    integer,
    doublePrecision as double,
    varchar,
    boolean,
    pgEnum,
  } from "drizzle-orm/pg-core";
  
  import { relations } from "drizzle-orm";
  
  export const knowledgeAreaEnum = pgEnum("knowledge_area", [
    "NATURE",
    "HUMANITIES",
    "MATHEMATICS",
    "LANGUAGES",
  ]);
  
  export const questionTypeEnum = pgEnum("question_type", [
    "premium",
    "free",
  ]);
  
  export const subjects = pgTable("subjects", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    knowledgeArea: knowledgeAreaEnum("knowledge_area").notNull(),
    fatherSubjectId: integer("father_subject_id").references(() => subjects.id),
  });
  
  export const questions = pgTable("questions", {
    id: serial("id").primaryKey(),
    year: integer("year").notNull(),
    knowledgeArea: knowledgeAreaEnum("knowledge_area").notNull(),
    subject_id: integer("subject_id").notNull().references(() => subjects.id),
    title: text("title").notNull(),
    context: text("context").notNull(),
    alternativesIntroduction: text("alternatives_introduction").notNull(),
    correctAnswer: text("correct_answer").notNull(),
    type: questionTypeEnum("type").notNull(),
    discrimination: double("discrimination"),
    difficulty: double("difficulty"),
    guessing: double("guessing"),
  });
  
  export const alternatives = pgTable("alternatives", {
    id: serial("id").primaryKey(),
    text: text("text").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    letter: text("letter").notNull(),
    imageUrl: text("image_url"),
    questionId: integer("question_id").notNull().references(() => questions.id),
  });
  
  export const questionsRelations = relations(questions, ({ one, many }) => ({
    subject: one(subjects, {
      fields: [questions.subject_id],
      references: [subjects.id],
    }),
    alternatives: many(alternatives),
  }));
  
  export const alternativesRelations = relations(alternatives, ({ one }) => ({
    question: one(questions, {
      fields: [alternatives.questionId],
      references: [questions.id],
    }),
  }));