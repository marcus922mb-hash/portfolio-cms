import type { ProjectRow, ProjectStatus } from "./database";

export type { ProjectStatus };

// Domain model — matches projects table
export type Project = ProjectRow;

export type ProjectInsert = {
  name: string;
  client_id?: string;
  estimate_id?: string;
  demo_id?: string;
  status?: ProjectStatus;
  start_date?: string;
  deadline?: string;
  technology?: string;
  notes?: string;
};
