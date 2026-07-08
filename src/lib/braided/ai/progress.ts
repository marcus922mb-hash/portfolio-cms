export type AIProgressStatus = "running" | "completed" | "warning" | "error";

export type AIProgressStage =
  | "request_received"
  | "loading_context"
  | "context_loaded"
  | "prompt_prepared"
  | "model_attempt_started"
  | "model_attempt_failed"
  | "content_received"
  | "content_validated"
  | "image_search_started"
  | "image_provider_started"
  | "image_provider_completed"
  | "image_provider_failed"
  | "images_selected"
  | "placeholders_selected"
  | "generation_completed"
  | "generation_failed";

export type AIProgressDetails = Record<
  string,
  string | number | boolean | null
>;

export type AIProgressUpdate = {
  stage: AIProgressStage;
  status: AIProgressStatus;
  progress: number;
  message: string;
  details?: AIProgressDetails;
};

export type AIProgressEvent = AIProgressUpdate & {
  id: string;
  runId: string;
  sequence: number;
  createdAt: string;
};

export type AIProgressReporter = (update: AIProgressUpdate) => Promise<void>;

