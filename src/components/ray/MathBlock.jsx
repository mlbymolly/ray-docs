import React from "react";

export default function MathBlock({ label, children }) {
  return (
    <div className="my-6">
      {label &&
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 hidden">{label}</p>
      }
      <div className="math-block whitespace-pre-wrap">
        {children}
      </div>
    </div>);

}