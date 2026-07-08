"use client";

import { useMemo } from "react";

export function SectionPreviewFrame({
  html,
  title,
  dark = false,
}: {
  html: string;
  title: string;
  dark?: boolean;
}) {
  const srcDoc = useMemo(() => html, [html]);

  return (
    <iframe
      title={title}
      sandbox=""
      srcDoc={srcDoc}
      className="h-[420px] w-full rounded-2xl border border-stone-200 bg-white shadow-sm"
      style={dark ? { background: "#0b0b0c" } : undefined}
    />
  );
}

