"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import "highlight.js/styles/github-dark.css";
import "./rag.css";
import { Message } from "./types";
import { RagMessageContent } from "./components/RagMessageContent";
import CoalesceModal from "@/components/CoalesceModal";

interface UploadedDoc {
  documentId: string;
  fileName: string;
  uploadDate: string;
  status: "processing" | "ready" | "failed";
  pageCount: number;
  chunkCount: number;
}

const API_ENDPOINT = "https://my6plfgblkoqkw4ifl43fvnazm0idorw.lambda-url.us-east-1.on.aws/";

export default function RagEngine() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string>("All Documents");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(API_ENDPOINT);
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      setUploadedDocs(data.documents || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Polling for processing documents
  useEffect(() => {
    const hasProcessing = uploadedDocs.some(doc => doc.status === "processing");
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      fetchDocuments();
    }, 5000);

    return () => clearInterval(interval);
  }, [uploadedDocs]);

  const conversationHistory = useRef<{ role: string; content: string }[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming) return;

    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsStreaming(true);
    setError(null);

    conversationHistory.current.push({ role: "user", content: userMessage });

    setMessages((prev) => [...prev, { role: "ai", content: "" }]);

    try {
      const response = await fetch(
        "https://irre57ldpgvqwmsk2enqxzmxha0cdduj.lambda-url.us-east-1.on.aws/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: userMessage,
            document: selectedDoc !== "All Documents" ? selectedDoc : undefined,
            history: conversationHistory.current.slice(0, -1),
          }),
        }
      );

      if (!response.ok) {
        let errorMsg = `HTTP error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullRaw = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullRaw += chunk;

        setMessages((prev) =>
          prev.map((msg, i) =>
            i === prev.length - 1 && msg.role === "ai"
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      }

      const answerIdx = fullRaw.indexOf("<!--ANSWER_START-->");
      const cleanResponse = answerIdx !== -1
        ? fullRaw.slice(answerIdx + "<!--ANSWER_START-->".length).trim()
        : fullRaw;

      conversationHistory.current.push({ role: "assistant", content: cleanResponse });

    } catch (err: any) {
      setError(err.message || "An error occurred.");
      conversationHistory.current.pop();
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "ai" && last.content === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsUploading(true);
    
    try {
      // 1. Get presigned URL
      const presignedRes = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name }),
      });
      
      if (!presignedRes.ok) throw new Error("Failed to get presigned URL");
      const { uploadUrl, key, documentName } = await presignedRes.json();

      // 2. Add optimistic temporary document to UI
      const optimisticDoc: UploadedDoc = {
        documentId: key,
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        status: "processing",
        pageCount: 0,
        chunkCount: 0
      };
      setUploadedDocs(prev => [optimisticDoc, ...prev]);

      // 3. Upload to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file to S3");
      
      // Upload succeeded! The polling will eventually pick up the updated status.
      // (The lambda should trigger on S3 put and start processing)
      
    } catch (err) {
      console.error("Upload error:", err);
      // Optional: show a toast or error state for the upload
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="rag-container routeComp">
      <CoalesceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} project="rag" />

      {/* Sidebar */}
      <div className="rag-sidebar">
        <div className="rag-sidebar-header">
          <div className="rag-sidebar-title">Document Library</div>
          <button className="rag-refresh-btn" onClick={fetchDocuments} title="Refresh Documents">
            Refresh
          </button>
        </div>
        
        <div 
          className={`rag-upload-area ${isUploading ? "disabled" : ""}`} 
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <div>{isUploading ? "Uploading..." : "Drop PDF here or click to browse"}</div>
          <input 
            type="file" 
            accept=".pdf" 
            className="rag-upload-input" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>

        <div className="rag-doc-list">
          {uploadedDocs.map((doc, i) => (
            <div key={doc.documentId || i} className="rag-doc-item">
              <div className="rag-doc-item-header">
                <span className="rag-doc-name" title={doc.fileName}>{doc.fileName}</span>
                <span className={`rag-doc-status ${doc.status}`}>
                  {doc.status === "ready" ? "Ready" : doc.status === "failed" ? "Failed" : "Processing"}
                </span>
              </div>
              <div className="rag-doc-item-meta">
                <span>{doc.pageCount} pages • {doc.chunkCount} chunks</span>
                <span className="rag-doc-date">{formatDate(doc.uploadDate)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="rag-chat-area">
        <div className="rag-chat-header">
          <div className="rag-chat-title">RAG Explorer</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select 
              className="rag-doc-selector"
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
            >
              <option value="All Documents">All Documents</option>
              {uploadedDocs.filter(d => d.status === "ready").map((doc, i) => (
                <option key={i} value={doc.documentId}>{doc.fileName}</option>
              ))}
            </select>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="architecture-button rag-arch-btn"
            >
              View Architecture
            </button>
          </div>
        </div>

        <div className="rag-messages">
          {messages.length === 0 && (
            <div className="rag-empty-text">Ask a question about your uploaded documents...</div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`rag-message-row ${msg.role}`}>
              <div className={`rag-message-bubble ${msg.role}`}>
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <RagMessageContent
                    content={msg.content}
                    isStreaming={isStreaming && index === messages.length - 1}
                  />
                )}
              </div>
            </div>
          ))}
          {error && (
            <div className="rag-error-box">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="rag-input-container">
          <form onSubmit={handleSubmit} className="rag-input-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isStreaming}
              placeholder="Ask anything..."
              className="rag-input"
            />
            <button
              type="submit"
              disabled={isStreaming || !inputValue.trim()}
              className={`rag-submit-btn ${isStreaming || !inputValue.trim() ? "disabled" : "active"}`}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}