export interface Message {
  role: "user" | "ai";
  content: string;
}

export interface Source {
  document: string;
  score: number;
  preview: string;
}

export interface ParsedRagStream {
  status: string;
  sources: Source[];
  answerStarted: boolean;
  answerContent: string;
}