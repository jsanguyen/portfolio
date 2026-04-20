"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import "highlight.js/styles/github-dark.css";
import "./coalesce.css";
import CoalesceModal from "@/components/CoalesceModal";
import { Message } from "./types";
import { UsageBanner } from "./components/UsageBanner";
import { AIMessageContent } from "./components/AIMessageContent";

export default function CoalesceEngine() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        "https://tcc5sulbp6l6sp4meqx6dzaat40rnttz.lambda-url.us-east-2.on.aws/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: userMessage,
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

      const ipUsage = response.headers.get("X-IP-Usage");
      const ipLimit = response.headers.get("X-IP-Limit");
      if (ipUsage && ipLimit) {
        setUsage({ used: parseInt(ipUsage), limit: parseInt(ipLimit) });
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

      const judgeIdx = fullRaw.indexOf("<!--JUDGE_START-->\n");
      const cleanResponse = judgeIdx !== -1
        ? fullRaw.slice(judgeIdx + "<!--JUDGE_START-->\n".length).trim()
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

  return (
    <div className="routeComp coalesce-container">
      <CoalesceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="coalesce-header">
        <button onClick={() => setIsModalOpen(true)} className="architecture-button">
          View Architecture
        </button>
      </div>

      {usage && <UsageBanner used={usage.used} limit={usage.limit} />}

      <div className="coalesce-messages-area">
        {messages.length === 0 && (
          <p className="coalesce-empty-text">Start a conversation...</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`coalesce-message-row ${msg.role}`}>
            <div className={`coalesce-message-bubble ${msg.role}`}>
              {msg.role === "user" ? (
                msg.content
              ) : (
                <AIMessageContent
                  content={msg.content}
                  isStreaming={isStreaming && index === messages.length - 1}
                />
              )}
            </div>
          </div>
        ))}
        {error && (
          <div className="coalesce-error-box">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="coalesce-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isStreaming}
          placeholder="Type your message..."
          className="coalesce-input"
        />
        <button
          type="submit"
          disabled={isStreaming || !inputValue.trim()}
          className={`coalesce-submit-btn ${isStreaming || !inputValue.trim() ? "disabled" : "active"}`}
        >
          Send
        </button>
      </form>
    </div>
  );
}