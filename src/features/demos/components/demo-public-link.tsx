"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { logDemoLinkCopiedAction } from "@/features/emails/actions/send-demo-email-action";
import { buildDemoPublicUrl } from "@/features/emails/types";

type Props = {
  slug: string;
  compact?: boolean;
  demoId?: string;
  label?: string;
};

export function DemoPublicLink({ slug, compact = false, demoId, label }: Props) {
  const [copied, setCopied] = useState(false);
  const url = (() => {
    const resolved = buildDemoPublicUrl(slug);
    if (resolved.startsWith("/") && typeof window !== "undefined") {
      return `${window.location.origin}${resolved}`;
    }
    return resolved;
  })();

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link do demo został skopiowany.");
      window.setTimeout(() => setCopied(false), 1600);

      if (demoId) {
        await logDemoLinkCopiedAction({ demoId });
      }
    } catch {
      toast.error("Nie udało się skopiować linku do demo.");
    }
  }

  return (
    <button
      type="button"
      className={compact ? "crm-action-btn" : "demo-copy-link"}
      onClick={copy}
      title="Kopiuj link"
    >
      {copied ? <Check size={compact ? 13 : 14} /> : <Copy size={compact ? 13 : 14} />}
      {compact ? <span>{label ?? "Kopiuj link"}</span> : <span>{copied ? "Skopiowano" : url}</span>}
    </button>
  );
}
