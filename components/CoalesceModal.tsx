"use client";

import React, { useEffect, useRef, useState } from "react";
import "./CoalesceModal.css";

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: "coalesce" | "rag";
}

function CoalesceOverviewTab() {
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

function RagOverviewTab() {
  return (
    <>
      <section className="modal-section">
        <h3 className="modal-section-title small">The Goal</h3>
        <p className="modal-text">
          RAG Explorer is a Retrieval-Augmented Generation system that lets users upload documents (PDFs and GitHub repositories), automatically chunks and embeds them into a vector database, and enables natural language Q&A grounded in the actual document content — eliminating hallucinations by citing specific sources.
        </p>
      </section>

      <section className="modal-section">
        <h3 className="modal-section-title">Technologies</h3>
        <div className="modal-grid">
          {[
            { title: "Frontend", desc: "React / Next.js / TypeScript" },
            { title: "Backend", desc: "AWS Lambda (3 functions)" },
            { title: "Embeddings", desc: "OpenAI text-embedding-3-small" },
            { title: "Vector DB", desc: "Pinecone (cosine similarity)" },
            { title: "LLM", desc: "Poe API (GLM 5.1)" },
            { title: "Storage", desc: "S3 (documents) + DynamoDB (metadata)" },
            { title: "Streaming", desc: "Lambda Function URLs + ReadableStream API" },
          ].map((item) => (
            <div key={item.title} className="modal-card">
              <strong className="modal-card-title">{item.title}</strong>
              <span className="modal-card-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="modal-section">
        <h3 className="modal-section-title">The Workflow</h3>
        <ol className="modal-list">
          {[
            {
              step: "1",
              title: "Document Upload",
              desc: "User uploads a PDF or submits a GitHub repo URL. PDFs go to S3 via presigned URLs. GitHub repos are fetched via the GitHub API.",
            },
            {
              step: "2",
              title: "Text Extraction",
              desc: "S3 triggers a Lambda that extracts text from PDFs using pdf-parse. GitHub Lambda fetches and reads source files, filtering by extension and skipping node_modules/dist/etc.",
            },
            {
              step: "3",
              title: "Chunking",
              desc: "Extracted text is split into overlapping chunks (~500 tokens with 100 token overlap) to preserve context across chunk boundaries.",
            },
            {
              step: "4",
              title: "Embedding",
              desc: "Each chunk is converted to a 1536-dimension vector using OpenAI's text-embedding-3-small model. Batched in groups of 100.",
            },
            {
              step: "5",
              title: "Vector Storage",
              desc: "Vectors are upserted to Pinecone with metadata (document name, chunk index, raw text). Uses Pinecone REST API directly.",
            },
            {
              step: "6",
              title: "Query Processing",
              desc: "When the user asks a question, the question is embedded using the same model, then Pinecone finds the top 5 most similar chunks via cosine similarity.",
            },
            {
              step: "7",
              title: "Context Injection",
              desc: "Retrieved chunks are injected into a structured prompt with source labels and relevance scores, then sent to a Poe bot (GLM 5.1).",
            },
            {
              step: "8",
              title: "Streaming Response",
              desc: "The LLM generates an answer citing [Source N] references. The response streams token-by-token to the UI with collapsible source cards.",
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
            "Presigned S3 uploads",
            "GitHub repo ingestion",
            "Overlapping chunk strategy",
            "Vector similarity search",
            "Source citation with scores",
            "Streaming responses",
            "Collapsible source cards",
            "Document filtering",
            "Conversation memory",
            "Document status polling",
            "Automatic S3 trigger pipeline",
            "DynamoDB metadata tracking",
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

function CoalesceArchitectureTab() {
  return (
    <div className="arch-container">
      {/* User */}
      <div className="arch-node arch-node-user">User Query</div>
      <div className="arch-arrow">▼</div>
      <div className="arch-label">POST /prompt + history</div>

      {/* Lambda */}
      <div className="arch-node arch-node-lambda wide">AWS Lambda (Streaming)</div>
      <div className="arch-arrow">▼</div>

      {/* Validation + Rate Limit Row */}
      <div className="arch-row">
        <div className="arch-node arch-node-abuse">
          Abuse Detection
          <div className="arch-node-desc">Length / spam / patterns</div>
        </div>
        <div className="arch-node arch-node-abuse">
          DynamoDB
          <div className="arch-node-desc">IP limit (5) · Global (25)</div>
        </div>
      </div>
      <div className="arch-arrow">▼ pass</div>

      {/* Router */}
      <div className="arch-node arch-node-router wide">
        Smart Agent Router
        <div className="arch-node-desc">Classifies query → selects agents</div>
      </div>
      <div className="arch-arrow">▼</div>
      <div className="arch-label">Promise.all (parallel)</div>

      {/* Agents Row */}
      <div className="arch-row">
        <div className="arch-node arch-node-tech">
          Technical<br />Analyst
          <div className="arch-node-desc light">Data & facts</div>
        </div>
        <div className="arch-node arch-node-devil">
          Devil's<br />Advocate
          <div className="arch-node-desc light">Counterarguments</div>
        </div>
        <div className="arch-node arch-node-expert">
          Practical<br />Expert
          <div className="arch-node-desc light">Real-world insight</div>
        </div>
      </div>
      <div className="arch-arrow">▼ ▼ ▼</div>
      <div className="arch-label">Agent responses collected</div>

      {/* Judge */}
      <div className="arch-node arch-node-judge xwide">
        Judge Bot (Synthesis)
        <div className="arch-node-desc">Resolves conflicts · Weaves insights · Streams output</div>
      </div>
      <div className="arch-arrow">▼</div>
      <div className="arch-label">Token-by-token streaming</div>

      {/* UI */}
      <div className="arch-node arch-node-user">
        React UI
        <div className="arch-node-desc">Agent cards · Live synthesis · Timing metrics</div>
      </div>

      {/* Legend */}
      <div className="arch-legend">
        <div className="arch-legend-title">Data Flow</div>
        <div className="arch-legend-grid">
          <span>Input: JSON {"{ prompt, history }"}</span>
          <span>Output: Chunked text/plain stream</span>
          <span>Auth: Function URL (none/IAM)</span>
          <span>Headers: X-IP-Usage, X-IP-Limit</span>
        </div>
      </div>
    </div>
  );
}

function RagArchitectureTab() {
  return (
    <div className="arch-container">
      {/* Ingestion Pipeline (Upload) */}
      <div className="arch-node arch-node-tech">User Query / Upload</div>
      <div className="arch-arrow">▼</div>

      <div className="arch-row" style={{ gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="arch-node arch-node-tech">PDF Upload</div>
          <div className="arch-arrow">▼</div>
          <div className="arch-node arch-node-lambda">S3 Bucket</div>
          <div className="arch-arrow">▼</div>
          <div className="arch-node arch-node-tech">rag-file-upload Lambda<br/><span className="arch-node-desc light">(pdf-parse, chunk, embed)</span></div>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="arch-node arch-node-tech">GitHub Import</div>
          <div className="arch-arrow">▼</div>
          <div className="arch-node arch-node-tech">rag-github-ingest Lambda</div>
          <div className="arch-arrow">▼</div>
          <div style={{ width: "2px", height: "40px", backgroundColor: "#555" }}></div>
        </div>
      </div>
      
      <div className="arch-arrow">▼</div>

      {/* OpenAI Embeddings */}
      <div className="arch-node arch-node-tech wide">
        OpenAI Embeddings
        <div className="arch-node-desc light">(text-embedding-3-small → 1536d vectors)</div>
      </div>
      
      <div className="arch-arrow">▼</div>
      
      {/* Pinecone DB */}
      <div className="arch-node arch-node-lambda wide">
        Pinecone Vector DB
        <div className="arch-node-desc light">(cosine similarity index)</div>
      </div>
      
      <div className="arch-arrow">▼</div>
      <div className="arch-label">← User asks a question</div>
      <div className="arch-arrow">▼</div>
      
      {/* Query processing */}
      <div className="arch-node arch-node-user wide">
        rag-query-handler Lambda
        <div className="arch-node-desc light" style={{ textAlign: "left", marginTop: "8px", lineHeight: "1.6" }}>
          ├→ Embed question (OpenAI)<br/>
          ├→ Search Pinecone (top 5 chunks)<br/>
          ├→ Build RAG prompt with sources<br/>
          └→ Stream from Poe (GLM 5.1)
        </div>
      </div>
      
      <div className="arch-arrow">▼</div>
      
      {/* React UI */}
      <div className="arch-node arch-node-user wide">
        React UI
        <div className="arch-node-desc light">(source cards, streaming answer, citations)</div>
      </div>

      {/* Legend */}
      <div className="arch-legend">
        <div className="arch-legend-title">Data Flow</div>
        <div className="arch-legend-grid">
          <span>Input: PDF files, GitHub URLs, natural language questions</span>
          <span>Output: Streamed answers with [Source N] citations</span>
          <span>Pinecone: 1536-dim vectors, cosine metric, top-5 retrieval</span>
          <span>Cost: ~$0/month (OpenAI embeddings ~$0.02/1M tokens, everything else free tier)</span>
        </div>
      </div>
    </div>
  );
}

export default function CoalesceModal({ isOpen, onClose, project = "coalesce" }: ArchitectureModalProps) {
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
          {project === "coalesce" ? "Coalesce Engine" : "RAG Explorer"}
        </h2>
        <p className="modal-subtitle">
          {project === "coalesce" 
            ? "Multi-agent AI orchestration with real-time streaming" 
            : "Retrieval-Augmented Generation with document embeddings"}
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
        {activeTab === "overview" && (project === "coalesce" ? <CoalesceOverviewTab /> : <RagOverviewTab />)}
        {activeTab === "architecture" && (project === "coalesce" ? <CoalesceArchitectureTab /> : <RagArchitectureTab />)}
      </div>
    </div>
  );
}