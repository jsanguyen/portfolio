import { ParsedStream } from "./types";

export function parseAgentStream(raw: string): ParsedStream {
  const agentsHeader = raw.match(/<!--AGENTS:(.+?)-->/);
  const expectedLabels = agentsHeader ? agentsHeader[1].split(",") : [];
  const timings: Record<string, number> = {};
  const timingRe = /<!--TIMING:(\w+):(\d+)-->/g;
  let tm;
  while ((tm = timingRe.exec(raw)) !== null) {
    timings[tm[1]] = parseInt(tm[2]);
  }

  const completed = new Map<string, string>();
  const re = /<!--AGENT_START:(.+?)-->\n([\s\S]*?)<!--AGENT_END-->/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    completed.set(m[1], m[2].trim());
  }

  const agents = expectedLabels.map((label) => ({
    label,
    content: completed.get(label) || "",
    done: completed.has(label),
  }));

  let judgeContent = "";
  let judgeStarted = false;
  const judgeIdx = raw.indexOf("<!--JUDGE_START-->\n");
  if (judgeIdx !== -1) {
    judgeStarted = true;
    judgeContent = raw
      .slice(judgeIdx + "<!--JUDGE_START-->\n".length)
      .replace(/<!--TIMING:\w+:\d+-->/g, "")
      .trim();
  }

  return { agents, judgeContent, judgeStarted, hasMarkers: !!agentsHeader, timings };
}