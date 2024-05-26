import { ChatModelSettings } from "./types";

export const DEFAULT_KEY = "AUTO_GIT_MESSAGE__CHAT_MODEL_SETTINGS"

export const DEFAULT_SETTING = {
  provider: process.env.NEXT_PUBLIC_LLM_PROVIDER || "ChatBaiduWenxin",
  model: process.env.NEXT_PUBLIC_LLM_MODEL || "ERNIE-Speed-128K",
  apiKey: process.env.NEXT_PUBLIC_LLM_API_KEY || "YOUR_BAIDU_API_KEY",
  secretKey: process.env.NEXT_PUBLIC_LLM_SECRET_KEY || "YOUR_BAIDU_SECRET_KEY",
} satisfies ChatModelSettings;