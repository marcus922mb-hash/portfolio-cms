"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "@/features/projects/schemas/project-schema";
import type { ProjectStatus } from "@/features/projects/types";

export type ProjectActionState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
} | null;

export type StatusActionState = { error?: string; success?: boolean } | null;

export async function createProjectAction(
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  const supabase = await createClient();

  const parsed = projectSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: "Formularz zawiera błędy.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      name: d.name,
      status: d.status,
      client_id: d.client_id ?? null,
      estimate_id: d.estimate_id ?? null,
      start_date: d.start_date ?? null,
      deadline: d.deadline ?? null,
      technology: d.technology ?? null,
      notes: d.notes ?? null,
    })
    .select("id, name")
    .single();

  if (error) return { error: `Nie udało się utworzyć projektu: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "project",
    entity_id: project.id,
    action: "created",
    description: `Utworzono projekt: ${project.name}`,
  });

  redirect(`/panel/projekty/${project.id}`);
}

export async function updateProjectAction(
  projectId: string,
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  const supabase = await createClient();

  const parsed = projectSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: "Formularz zawiera błędy.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;
  const { error } = await supabase
    .from("projects")
    .update({
      name: d.name,
      status: d.status,
      client_id: d.client_id ?? null,
      estimate_id: d.estimate_id ?? null,
      start_date: d.start_date ?? null,
      deadline: d.deadline ?? null,
      technology: d.technology ?? null,
      notes: d.notes ?? null,
    })
    .eq("id", projectId);

  if (error) return { error: `Nie udało się zaktualizować projektu: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "project",
    entity_id: projectId,
    action: "updated",
    description: "Zaktualizowano projekt",
  });

  revalidatePath(`/panel/projekty/${projectId}`);
  redirect(`/panel/projekty/${projectId}`);
}

export async function updateProjectStatusAction(
  projectId: string,
  _prevState: StatusActionState,
  formData: FormData
): Promise<StatusActionState> {
  const newStatus = formData.get("status") as ProjectStatus | null;
  if (!newStatus) return { error: "Brak statusu." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ status: newStatus })
    .eq("id", projectId);

  if (error) return { error: `Nie udało się zmienić statusu: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "project",
    entity_id: projectId,
    action: "status_changed",
    description: `Zmieniono status projektu na: ${newStatus}`,
    metadata: { status: newStatus },
  });

  revalidatePath(`/panel/projekty/${projectId}`);
  return { success: true };
}

export async function deleteProjectAction(projectId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) return { error: error.message };
  revalidatePath("/panel/projekty");
  redirect("/panel/projekty");
}
