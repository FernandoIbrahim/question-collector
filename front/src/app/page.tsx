"use client";

import QuestionForm from "@/components/test-form";
import { QuestionProvider } from "../context/question-context";
import QuestionViewer from "@/components/question-viwer";
import { ImageLinkGenerator } from "@/components/image-input";

export default function Page() {
  return (
    <QuestionProvider>
      <div className="flex flex-row md:flex-row gap-6 p-4">
        <div className="flex w-full">
          <QuestionForm />
        </div>
        <div className="flex flex-col items-center w-full">
          <ImageLinkGenerator/>
          <QuestionViewer/>
        </div>
      </div>
    </QuestionProvider>
  );
}