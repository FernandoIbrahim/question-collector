"use client";

import ReactMarkdown from "react-markdown";
import { useQuestionContext } from "@/context/question-context";



export default function QuestionViewer() {

    const {question} = useQuestionContext();
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg min-w-3xl mx-auto space-y-4 border border-gray-200 min-w-90/100">
        <div className="text-sm text-gray-500 flex justify-between">
          <span>Ano: {question.year}</span>
          <span>Área: {question.knowledgeArea}</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          <ReactMarkdown>{question.title}</ReactMarkdown>
        </h2>

        <div className="prose prose-neutral max-w-none">
          <ReactMarkdown>{question.context}</ReactMarkdown>
        </div>

        <div>
          <p className="mt-4 font-medium text-gray-800">
            <ReactMarkdown>{question.alternativesIntroduction}</ReactMarkdown>
          </p>
          <ul className="mt-2 space-y-3">
            {question.alternatives.map((alt) => (
              <li
                key={alt.letter}
                className={`p-4 rounded-lg border ${
                  alt.isCorrect
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold text-gray-700">{alt.letter.toUpperCase()}.</span>
                  <div className="prose prose-sm">
                    <ReactMarkdown>{alt.text}</ReactMarkdown>
                    {alt.imageUrl && (
                      <img
                        src={alt.imageUrl}
                        alt={`Imagem da alternativa ${alt.letter}`}
                        className="mt-2 rounded-md max-h-48 object-contain"
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
}