import { ParsedRagStream, Source } from "./types";

export function parseRagStream(raw: string): ParsedRagStream {
  let status = "";
  let sources: Source[] = [];
  let answerContent = "";
  let answerStarted = false;

  // Extract all statuses and keep the last one
  const statusRegex = /<!--STATUS:(.*?)-->/g;
  let match;
  while ((match = statusRegex.exec(raw)) !== null) {
    status = match[1].trim();
  }

  // Extract sources. Try parsing arrays embedded inside.
  const sourcesRegex = /<!--SOURCES:(\[.*?\])-->/s;
  const sourcesMatch = raw.match(sourcesRegex);
  if (sourcesMatch) {
    try {
      sources = JSON.parse(sourcesMatch[1]);
    } catch (e) {
      // Ignore JSON parse errors during streaming
    }
  }

  const answerIdx = raw.indexOf("<!--ANSWER_START-->");
  if (answerIdx !== -1) {
    answerStarted = true;
    answerContent = raw.slice(answerIdx + "<!--ANSWER_START-->".length);
  }

  return { status, sources, answerStarted, answerContent };
}