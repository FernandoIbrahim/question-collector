"use client"
import z from 'zod';
import { useContext, createContext, useState } from "react"
import { questionFromSchema } from '@/lib/types';


type QuestionFormType = z.infer<typeof questionFromSchema>;

interface QuestionContextType {
  question: QuestionFormType;
  setQuestion: (q: QuestionFormType) => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export function QuestionProvider({ children }: { children: React.ReactNode }) {
  const [question, setQuestion] = useState<QuestionFormType>({
    year: 2024,
    knowledgeArea: "NATURE",
    title: "",
    context: "",
    alternativesIntroduction: "",
    correctAnswer: "a",
    alternatives: [
      { letter: "a", text: "", imageUrl: null, isCorrect: true },
      { letter: "b", text: "", imageUrl: null, isCorrect: false },
      { letter: "c", text: "", imageUrl: null, isCorrect: false },
      { letter: "d", text: "", imageUrl: null, isCorrect: false },
      { letter: "e", text: "", imageUrl: null, isCorrect: false },
    ]
  });

  return (
    <QuestionContext.Provider value={{ question, setQuestion }}>
      {children}
    </QuestionContext.Provider>
  );

}

export function useQuestionContext() {
  const context = useContext(QuestionContext);
  if (!context) throw new Error("useQuestionContext must be used inside a QuestionProvider");
  return context;
}