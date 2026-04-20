import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { parseAgentStream } from "../parser";
import { AgentCard } from "./AgentCard";
import "../coalesce.css";

export function AIMessageContent({
  content,
  isStreaming,
}: {
  content: string;
  isStreaming: boolean;
}) {
  const parsed = parseAgentStream(content);

  if (!parsed.hasMarkers) {
    if (isStreaming) {
      return (
        <span className="coalesce-text-italic coalesce-text-light">
          Initializing agents...
        </span>
      );
    }
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "12px" }}>
        <div className="coalesce-section-title coalesce-text-light">
          Agent Responses
        </div>
        {parsed.agents.map((agent) => (
          <AgentCard key={agent.label} agent={agent} />
        ))}
      </div>

      {!parsed.judgeStarted && parsed.agents.length > 0 && parsed.agents.every((a) => a.done) && isStreaming && (
        <div className="coalesce-text-italic coalesce-text-light" style={{ marginTop: "10px" }}>
          ⏳ Synthesizing responses...
        </div>
      )}

      {parsed.judgeStarted && (
        <div className="coalesce-judge-section">
          <div className="coalesce-section-title coalesce-text-success">
            ✦ Synthesized Response
          </div>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {parsed.judgeContent}
          </ReactMarkdown>
        </div>
      )}
      {parsed.timings.phase1 && !isStreaming && (
        <div className="coalesce-timings coalesce-text-light">
          <span>Agents: {(parsed.timings.phase1 / 1000).toFixed(1)}s</span>
          {parsed.timings.total && (
          <span>· Total: {(parsed.timings.total / 1000).toFixed(1)}s</span>
          )}
        </div>
      )}
    </div>
  );
}