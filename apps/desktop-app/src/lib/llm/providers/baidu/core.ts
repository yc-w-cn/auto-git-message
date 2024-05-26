import { getSettings } from "@/lib/settings/core";
import { loadAccessToken } from "./access-token";
import { models } from "./models";
import { makeProxyRequest } from "@/lib/commands/make-proxy-request";
import { BaiduChatRequest, BaiduChatResponse } from "./types";
import { HumanMessage } from "@/lib/llm/message/human-message";

export function getUrl(modelName: string, accessToken: string) {
  if (modelName in models) {
    return `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${models[modelName]}?access_token=${accessToken}`;
  } else {
    throw new Error(`Invalid model name: ${modelName}`);
  }
}

/**
 * https://cloud.baidu.com/doc/WENXINWORKSHOP/s/6ltgkzya5
 */
export async function chat(prompt: string, system?: string) {
  const accessToken = await loadAccessToken();
  if (!accessToken) {
    throw new Error(`Invalid accessToken.`);
  }
  const settings = getSettings();
  const url = getUrl(settings.model, accessToken);
  const result = await makeProxyRequest<BaiduChatResponse, BaiduChatRequest>({
    url,
    method: "POST",
    body: {
      messages: [HumanMessage(prompt)],
      system,
    },
  });
  return result?.result;
}
