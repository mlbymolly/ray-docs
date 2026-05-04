import React from "react";

export default function SectionHeader({ id, number, title, subtitle, tldr }) {
  return (
    <div id={id} className="pt-20 pb-6 scroll-mt-16 border-b border-border mb-8">
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight mb-3">
        {title}
      </h2>
      {subtitle &&
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed font-sans">
          {subtitle}
        </p>
      }
    </div>
  );
}