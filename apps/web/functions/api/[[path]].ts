const API_ORIGIN = 'https://relief-vehicle-api.sarojregmi-official.workers.dev';

export async function onRequest(context: { request: Request }): Promise<Response> {
  const incoming = new URL(context.request.url);
  const target = `${API_ORIGIN}${incoming.pathname}${incoming.search}`;
  return fetch(new Request(target, context.request));
}
