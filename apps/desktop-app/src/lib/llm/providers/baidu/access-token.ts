import { makeProxyRequest } from "@/lib/commands/make-proxy-request";
import {
  BAIDU_ACCESS_TOKEN_KEY,
  BAIDU_ACCESS_TOKEN_EXIPRED_KEY,
} from "./constants";
import {
  BaiduAccessTokenError,
  BaiduAccessTokenErrorResponse,
  BaiduAccessTokenResponse,
} from "./types";
import { getSettings } from "@/lib/settings/core";

/**
 * 获取access_token
 * @see {@link https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Ilkkrb0i5}
 */
export async function loadAccessToken() {
  const accessTokenFromLocalStorage = getAccessTokenFromLocalStorage();
  if (accessTokenFromLocalStorage) return accessTokenFromLocalStorage;
  return getAccessTokenFromRemote();
}

export async function getAccessTokenFromRemote() {
  const options = getSettings();
  const url = "https://aip.baidubce.com/oauth/2.0/token";
  const method = "POST";
  const query = {
    grant_type: "client_credentials",
    client_id: options.apiKey,
    client_secret: options.secretKey,
  };
  try {
    const response = await makeProxyRequest<
      BaiduAccessTokenResponse | BaiduAccessTokenErrorResponse
    >({
      url,
      method,
      query,
    });
    if (response && "error" in response) {
      handleErrorResponse(response as BaiduAccessTokenErrorResponse);
      return null;
    }
    if (response) {
      localStorage.setItem(BAIDU_ACCESS_TOKEN_KEY, response.access_token);
      localStorage.setItem(
        BAIDU_ACCESS_TOKEN_EXIPRED_KEY,
        String(new Date().getTime() + response.expires_in * 1000)
      );
      return response.access_token;
    }
    return null;
  } catch (error) {
    console.error("请求过程中发生错误:", error);
    return null;
  }
}

export function getAccessTokenFromLocalStorage() {
  const accessToken = localStorage.getItem(BAIDU_ACCESS_TOKEN_KEY);
  if (!accessToken) return null;
  const accessTokenExpired = Number(
    localStorage.getItem(BAIDU_ACCESS_TOKEN_EXIPRED_KEY)
  );
  if (accessTokenExpired < new Date().getTime()) return null;
  return accessToken;
}

export const handleErrorResponse = (
  response: BaiduAccessTokenErrorResponse
) => {
  switch (response.error) {
    case BaiduAccessTokenError.InvalidClient:
      console.error(
        "API Key 或 Secret Key 不正确:",
        response.error_description
      );
      break;
    default:
      console.error("发生未知错误:", response.error_description);
      break;
  }
};
