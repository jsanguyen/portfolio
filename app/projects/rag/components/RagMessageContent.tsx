import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { parseRagStream } from "../parser";
import { SourceCard } from "./SourceCard";
import "../rag.css";

// Helper to cleanly fix common markdown streaming issues without destroying lists
const fixMarkdown = (text: string) => {
  let clean = text;

  // Fix spaces immediately inside bold/italic/strikethrough/code markers
  clean = clean.replace(/([*_~`]{1,3})\s+([^\n*_~`]+?)\s*\1/g, "$1$2$1");
  clean = clean.replace(/([*_~`]{1,3})([^\n*_~`]+?)\s+\1/g, "$1$2$1");

  // Fix squashed bold list items (e.g. "].***Architectural")
  clean = clean.replace(/([a-zA-Z0-9\]>.,!?])\s*\*\*\*(?=[a-zA-Z0-9])/g, "$1\n\n* **");
  
  // Fix squashed normal list items (e.g. "].*Strategic")
  clean = clean.replace(/([a-zA-Z0-9\]>.,!?])\s*\*(?=[a-zA-Z0-9])/g, "$1\n\n* ");

  // Fix squashed text after bold tags (e.g. "**Word:**He")
  // Target '**' that is followed by a letter/number, but preceded by punctuation.
  clean = clean.replace(/(?<=[a-zA-Z0-9:.,?!])(\*\*|__)(?=[a-zA-Z0-9])/g, "$1 ");

  // Ensure double newlines for proper paragraph breaks around lists
  clean = clean.replace(/\n(\*|-|\d+\.)\s/g, "\n\n$1 ");

  return clean;
};

export function RagMessageContent({
  content,
  isStreaming,
}: {
  content: string;
  isStreaming: boolean;
}) {
  const parsed = parseRagStream(content);

  // Still thinking/fetching docs
  if (!parsed.answerStarted) {
    if (isStreaming) {
      return (
        <div className="rag-status-container">
          <span className="rag-status-spinner"></span>
          <span className="rag-status-text">
            {parsed.status || "Analyzing query..."}
          </span>
        </div>
      );
    }
    // Fallback if the stream ends unexpectedly without an answer
    return (
      <div className="rag-answer-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {fixMarkdown(content)}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div>
      <div className="rag-answer-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {fixMarkdown(parsed.answerContent)}
        </ReactMarkdown>
      </div>

      {parsed.sources.length > 0 && (
        <div className="rag-sources-section">
          <div className="rag-section-title">Sources</div>
          <div className="rag-sources-grid">
            {parsed.sources.map((src, i) => (
              <SourceCard key={i} source={src} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}