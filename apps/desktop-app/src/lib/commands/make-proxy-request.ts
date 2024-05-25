import { invoke } from "@tauri-apps/api/tauri";

export interface RequestOptions {
  url: string;
  method: "GET" | "POST";
  headers?: Record<string, any>;
  body?: any;
  proxy?: string;
}

export async function makeProxyRequest<T = any>(options: RequestOptions) {
  const { url, method } = options;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  let body = null;
  if (method === "POST") {
    body = JSON.stringify(options.body);
  }
  try {
    const response = await invoke<T>("proxy_request", {
      method,
      url,
      headers,
      body: body || null,
      proxyUrl: options.proxy || null,
    });
    console.log("Response:", response);
    return response
  } catch (error) {
    console.error("Error:", error);
  }
}
