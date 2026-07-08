/**
 * Lead workflow — orchestrates post-submission steps.
 *
 * Current state: synchronous mock (logs to console).
 * Future: replace with Vercel Workflows trigger once configured.
 *
 * To enable Vercel Workflows:
 *   1. npm install @vercel/workflows
 *   2. Uncomment the Workflows trigger below
 *   3. Define the workflow in vercel.json → "workflows" field
 */

import type { LeadSubmission } from "./types";
import { sendLeadNotification } from "./email";
import { createAdminClient } from "@/lib/supabase/admin";

export async function processLead(submission: LeadSubmission): Promise<void> {
  await Promise.allSettled([
    notifyOwner(submission),
    confirmClient(submission),
    saveLead(submission),
  ]);
}

async function notifyOwner(submission: LeadSubmission): Promise<void> {
  try {
    await sendLeadNotification(submission);
  } catch (err) {
    console.error("[Workflow] notifyOwner failed:", err);
  }
}

async function confirmClient(submission: LeadSubmission): Promise<void> {
  // sendLeadNotification already handles the client confirmation email.
  // This stub exists for future use (e.g. SMS, WhatsApp Business API).
  console.log(
    "[Workflow] Client confirmation queued for:",
    submission.formData.email || "no email provided"
  );
}

async function saveLead(submission: LeadSubmission): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").insert({
    id: submission.id,
    submitted_at: submission.submittedAt,
    project_type: submission.formData.projectType,
    project_type_label: submission.estimate.projectTypeLabel,
    name: submission.formData.name || null,
    email: submission.formData.email || null,
    phone: submission.formData.phone || null,
    min_price: submission.estimate.minPrice,
    max_price: submission.estimate.maxPrice,
    timeline: submission.formData.timeline,
    budget: submission.formData.budget,
    description: submission.formData.description || null,
    form_data: submission.formData,
    estimate: submission.estimate,
  });

  if (error) {
    console.error("[Workflow] saveLead failed:", error);
    return;
  }

  await supabase.from("activity_logs").insert({
    entity_type: "client",
    entity_id: null,
    action: "lead_created",
    description: `Nowy lead: ${submission.formData.name || submission.formData.email || submission.estimate.projectTypeLabel}`,
    metadata: {
      lead_id: submission.id,
      project_type: submission.formData.projectType,
      min_price: submission.estimate.minPrice,
      max_price: submission.estimate.maxPrice,
    },
  });
}

/**
 * scheduleFollowUp — call from Vercel Cron (/api/cron/followup) 3 days
 * after submission, or wire into a Vercel Workflows delayed step.
 *
 * Future implementation:
 *   1. Query DB for lead by ID
 *   2. Check if already contacted
 *   3. Send follow-up email via sendViaResend()
 */
export async function scheduleFollowUp(leadId: string): Promise<void> {
  // TODO: Implement with Vercel Cron + DB lookup
  // Cron route: app/api/cron/followup/route.ts
  // Vercel cron definition: vercel.json → "crons": [{ "path": "/api/cron/followup", "schedule": "0 10 * * *" }]
  console.log("[Workflow] Follow-up scheduled for lead:", leadId);
}
