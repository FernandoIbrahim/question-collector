import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Suporte para tabelas, listas de tarefas etc.
import rehypeHighlight from "rehype-highlight"; // Syntax highlight para blocos de código
import "highlight.js/styles/github.css"; // Tema opcional para o código

type Props = {
  content: string;
  className?: string;
};

export default function MarkdownViewer({ content, className }: Props) {
  return (
    <div className={`prose max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}