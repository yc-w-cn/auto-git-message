import { DEFAULT_KEY, DEFAULT_SETTING } from "./constants";
import { ChatModelSettings } from "./types";

export function getSettings() {
  const valueText = localStorage.getItem(DEFAULT_KEY);
  if (!valueText) {
    return DEFAULT_SETTING;
  }
  return JSON.parse(valueText) as ChatModelSettings;
}
