import { invoke } from "@tauri-apps/api/tauri";

export interface RequestOptions<TBody = any> {
  url: string;
  method: "GET" | "POST";
  headers?: Record<string, any>;
  body?: TBody;
  proxy?: string;
  query?: Record<string, any>;
}

export async function makeProxyRequest<TResponse = any, TRequest = any>(
  options: RequestOptions<TRequest>
) {
  const { method, query } = options;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  let body = null;
  if (method === "POST") {
    body = JSON.stringify(options.body);
  }
  // 构建查询字符串
  const url =
    options.url +
    (query
      ? (options.url.includes("?") ? "&" : "?") +
        new URLSearchParams(query).toString()
      : "");
  try {
    console.log('makeProxyRequest', {
      method,
      url,
      headers,
      body: body || null,
      proxyUrl: options.proxy || null,
    })
    const response = await invoke<string>("proxy_request", {
      method,
      url,
      headers,
      body: body || null,
      proxyUrl: options.proxy || null,
    });
    const json = JSON.parse(response) as TResponse
    console.log("Response:", json);
    return json;
  } catch (error) {
    console.error("Error:", error);
  }
}
