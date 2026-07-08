import type { WorkerEnv } from "./types";

export function isAuthorized(request: Request, env: WorkerEnv) {
  const secret = env.AI_ROUTER_SHARED_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

