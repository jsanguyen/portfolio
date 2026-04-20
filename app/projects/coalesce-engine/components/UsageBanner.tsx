import React from "react";
import "../coalesce.css";

export function UsageBanner({ used, limit }: { used: number; limit: number }) {
  const pct = Math.round((used / limit) * 100);
  const isHigh = pct > 80;
  
  return (
    <div className="coalesce-usage-banner">
      <span className="coalesce-usage-label">Daily usage:</span>
      <div className="coalesce-usage-bar-bg">
        <div
          className={`coalesce-usage-bar-fg ${isHigh ? "coalesce-bg-error" : "coalesce-bg-success"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={isHigh ? "coalesce-text-error" : "coalesce-text-success"}>
        {used}/{limit}
      </span>
    </div>
  );
}