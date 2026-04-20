"use client";

import React, { useEffect, useRef, useState } from "react";
import "./CoalesceModal.css";

interface CoalesceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function OverviewTab() {
  return (
    <>
      <section className="modal-section">
        <h3 className="modal-section-title small">The Goal</h3>
        <p className="modal-text">
          Coalesce is a multi-agent AI system that routes queries to specialized AI agents,
          synthesizes their responses through a judge model, and streams the result in real-time.
          By comparing and validating multiple perspectives, the system produces more reliable,
          nuanced, and comprehensive answers than any single model alone.
        </p>
      </section>

      <section className="modal-section">
        <h3 className="modal-section-title">Technologies</h3>
        <div className="modal-grid">
          {[
            { title: "Frontend", desc: "React / Next.js / TypeScript" },
            { title: "Backend", desc: "AWS Lambda (Streaming)" },
            { title: "AI Orchestration", desc: "Poe API (GLM 5.1)" },
            { title: "Rate Limiting", desc: "DynamoDB (per-IP + global)" },
            { title: "Infrastructure", desc: "Lambda Function URLs" },
            { title: "Streaming", desc: "ReadableStream / chunked transfer" },
          ].map((item) => (
            <div key={item.title} className="modal-card">
              <strong className="modal-card-title">{item.title}</strong>
              <span className="modal-card-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="modal-section">
        <h3 className="modal-section-title">The Agentic Workflow</h3>
        <ol className="modal-list">
          {[
            {
              step: "1",
              title: "Input Validation & Abuse Detection",
              desc: "Prompt length, spam patterns, and repetition requests are caught before any AI calls are made.",
            },
            {
              step: "2",
              title: "Rate Limiting",
              desc: "DynamoDB checks per-IP (5/day) and global (25/day) usage with atomic counters. If exceeded, the request is rejected instantly.",
            },
            {
              step: "3",
              title: "Smart Agent Routing",
              desc: 'The system classifies the query type and selects only the relevant agents. Factual questions use 1 agent, "how-to" questions use 2, and debates use all 3.',
            },
            {
              step: "4",
              title: "Parallel Agent Execution",
              desc: "Selected agents (Technical Analyst, Devil's Advocate, Practical Expert) run simultaneously via Promise.all with conversation history.",
            },
            {
              step: "5",
              title: "Judge Synthesis",
              desc: "A judge model receives all agent responses and synthesizes them into a single, coherent answer — resolving contradictions and preserving the strongest insights.",
            },
            {
              step: "6",
              title: "Real-Time Streaming",
              desc: "The judge's response streams token-by-token to the UI. Agent cards show status in real-time, and timing metrics are displayed on completion.",
            },
          ].map((item) => (
            <li key={item.step} className="modal-list-item">
              <span className="modal-list-num">{item.step}.</span>
              <strong className="modal-list-title">{item.title}</strong>
              <br />
              <span className="modal-list-desc">{item.desc}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="modal-section-title">Key Features</h3>
        <div className="modal-features-grid">
          {[
            "Smart agent routing",
            "Real-time streaming UI",
            "Collapsible agent cards",
            "Conversation memory",
            "Per-IP rate limiting",
            "Global daily cap",
            "Abuse detection",
            "Timing metrics",
            "Graceful partial failure",
            "Usage dashboard",
          ].map((feature) => (
            <div key={feature} className="modal-feature-item">
              <span className="modal-feature-icon">✦</span>
              {feature}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ArchitectureTab() {
  return (
    <div className="arch-container">
      {/* User */}
      <div className="arch-node arch-node-user">🧑 User Query</div>
      <div className="arch-arrow">▼</div>
      <div className="arch-label">POST /prompt + history</div>

      {/* Lambda */}
      <div className="arch-node arch-node-lambda wide">⚡ AWS Lambda (Streaming)</div>
      <div className="arch-arrow">▼</div>

      {/* Validation + Rate Limit Row */}
      <div className="arch-row">
        <div className="arch-node arch-node-abuse">
          🛡️ Abuse Detection
          <div className="arch-node-desc">Length / spam / patterns</div>
        </div>
        <div className="arch-node arch-node-abuse">
          🗄️ DynamoDB
          <div className="arch-node-desc">IP limit (5) · Global (25)</div>
        </div>
      </div>
      <div className="arch-arrow">▼ pass</div>

      {/* Router */}
      <div className="arch-node arch-node-router wide">
        🧠 Smart Agent Router
        <div className="arch-node-desc">Classifies query → selects agents</div>
      </div>
      <div className="arch-arrow">▼</div>
      <div className="arch-label">Promise.all (parallel)</div>

      {/* Agents Row */}
      <div className="arch-row">
        <div className="arch-node arch-node-tech">
          🔬 Technical<br />Analyst
          <div className="arch-node-desc light">Data & facts</div>
        </div>
        <div className="arch-node arch-node-devil">
          😈 Devil's<br />Advocate
          <div className="arch-node-desc light">Counterarguments</div>
        </div>
        <div className="arch-node arch-node-expert">
          🛠️ Practical<br />Expert
          <div className="arch-node-desc light">Real-world insight</div>
        </div>
      </div>
      <div className="arch-arrow">▼ ▼ ▼</div>
      <div className="arch-label">Agent responses collected</div>

      {/* Judge */}
      <div className="arch-node arch-node-judge xwide">
        ⚖️ Judge Bot (Synthesis)
        <div className="arch-node-desc">Resolves conflicts · Weaves insights · Streams output</div>
      </div>
      <div className="arch-arrow">▼</div>
      <div className="arch-label">Token-by-token streaming</div>

      {/* UI */}
      <div className="arch-node arch-node-user">
        💻 React UI
        <div className="arch-node-desc">Agent cards · Live synthesis · Timing metrics</div>
      </div>

      {/* Legend */}
      <div className="arch-legend">
        <div className="arch-legend-title">Data Flow</div>
        <div className="arch-legend-grid">
          <span>📥 Input: JSON {"{ prompt, history }"}</span>
          <span>📤 Output: Chunked text/plain stream</span>
          <span>🔒 Auth: Function URL (none/IAM)</span>
          <span>📊 Headers: X-IP-Usage, X-IP-Limit</span>
        </div>
      </div>
    </div>
  );
}

export default function CoalesceModal({ isOpen, onClose }: CoalesceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "architecture">("overview");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div ref={modalRef} tabIndex={-1} className="modal-content">
        <button onClick={onClose} aria-label="Close modal" className="modal-close-btn">
          &times;
        </button>

        <h2 id="modal-title" className="modal-title">
          Coalesce Engine
        </h2>
        <p className="modal-subtitle">
          Multi-agent AI orchestration with real-time streaming
        </p>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={`modal-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`modal-tab-btn ${activeTab === "architecture" ? "active" : ""}`}
            onClick={() => setActiveTab("architecture")}
          >
            Architecture
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" ? <OverviewTab /> : <ArchitectureTab />}
      </div>
    </div>
  );
}