import { isAuthorized } from "./auth";
import { generate } from "./generate";
import { errorResponse, json } from "./http";
import type { WorkerEnv } from "./types";

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const requestId = request.headers.get("cf-ray") || crypto.randomUUID();
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "braided-digital-workers-ai",
        environment: env.ENVIRONMENT,
        requestId,
      });
    }

    if (request.method !== "POST" || url.pathname !== "/v1/generate") {
      return errorResponse(requestId, "Nie znaleziono endpointu.", 404);
    }
    if (!isAuthorized(request, env)) {
      return errorResponse(requestId, "Brak autoryzacji.", 401);
    }

    return generate(request, env, requestId);
  },
} satisfies ExportedHandler<WorkerEnv>;

