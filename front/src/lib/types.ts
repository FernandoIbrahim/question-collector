import { z } from "zod";


export const alternativeSchema = z.object({
    text: z.string().nullable(),
    isCorrect: z.boolean(),

    letter: z.enum(["a", "b", "c", "d", "e"], {
            errorMap: () => ({ message: "A resposta correta deve ser uma letra entre A e E" }),
    }),

    imageUrl: z.string().nullable(), 
});


export const questionFromSchema = z.object(
    {
        year: z.number().min(1990, "O ano inserido deve ser válido").max(2100, "O ano inserido deve ser válido"),
        knowledgeArea: z.enum(["NATURE", "MATHEMATICS", "HUMANITIES", "LANGUAGES"]),
        title: z.string().nullable(),
        context: z.string().nullable(),
        alternativesIntroduction: z.string().nullable(),

        correctAnswer: z.enum(["a", "b", "c", "d", "e"], {
            errorMap: () => ({ message: "A resposta correta deve ser uma letra entre a e e" }),
        }),

        alternatives: z.array(alternativeSchema).min(5, "Deve haver pelo menos cinco alternativas").max(5, "Deve possuir maximo cinco alternativas"),
    }
)