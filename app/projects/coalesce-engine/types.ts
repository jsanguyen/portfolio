export interface Message {
  role: "user" | "ai";
  content: string;
}

export interface ParsedAgent {
  label: string;
  content: string;
  done: boolean;
}

export interface ParsedStream {
  agents: ParsedAgent[];
  judgeContent: string;
  judgeStarted: boolean;
  hasMarkers: boolean;
  timings: Record<string, number>;
}