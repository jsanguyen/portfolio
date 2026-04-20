import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { ParsedAgent } from "../types";
import "../coalesce.css";

export function AgentCard({ agent }: { agent: ParsedAgent }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="coalesce-agent-card">
      <div
        onClick={() => agent.done && setExpanded(!expanded)}
        className={`coalesce-agent-header ${agent.done ? "done" : "pending"}`}
      >
        <span className="coalesce-agent-label">{agent.label}</span>
        <span>
          {agent.done ? (
            <span className="coalesce-text-success">✅ {expanded ? "▲" : "▼"}</span>
          ) : (
            <span className="coalesce-text-warning">⏳ Working...</span>
          )}
        </span>
      </div>
      {expanded && agent.done && (
        <div className="coalesce-agent-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {agent.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}