export function json(
  body: unknown,
  init: ResponseInit = {}
) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  headers.set("x-content-type-options", "nosniff");
  return Response.json(body, { ...init, headers });
}

export function errorResponse(
  requestId: string,
  message: string,
  status: number
) {
  return json(
    {
      success: false,
      result: null,
      errors: [{ message }],
      requestId,
    },
    { status }
  );
}

