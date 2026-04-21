import React, { useState } from "react";
import { Source } from "../types";
import "../rag.css";

export function SourceCard({ source }: { source: Source }) {
  const [expanded, setExpanded] = useState(false);
  const scorePercent = Math.round(source.score * 100);

  return (
    <div className="rag-source-card">
      <div
        className="rag-source-header"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="rag-source-title">{source.document}</span>
        <span className="rag-source-score">{scorePercent}% Match {expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && (
        <div className="rag-source-preview">
          {source.preview}
        </div>
      )}
    </div>
  );
}