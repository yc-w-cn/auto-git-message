import { getSettings } from "@/lib/settings/core";
import { chat } from "./providers/baidu/core";
import { SYSTEM } from "./prompts/system";
import { GitFileStatus } from "../git/git-file-status";
import { fileContentPromptWithLoader } from "./prompts/file-content";
import { PROMPT_INTRO_GIT_MESSAGE } from "./prompts/git-message";
import { PROMPT_JSON_RESULT } from "./prompts/json-result";
import { GitSuggestion } from "../git/git-suggestion";

export const availableProviders = ["ChatBaiduWenxin"];

export function checkProvider() {
  const { provider } = getSettings();
  if (!availableProviders.includes(provider)) {
    throw new Error(`PROVIDER ${provider} NOT SUPPORT YET`);
  }
}

export function extraGitMessage(jsonStringWithMarkers: string) {
  const jsonString = jsonStringWithMarkers
    .replace(/^```json/, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(jsonString) as GitSuggestion;
  } catch {
    return {
      summary: jsonString,
    } as GitSuggestion;
  }
}

export async function generateGitMessage(
  userPrompt: string,
  repositoryPath: string,
  selectedFiles: Record<string, GitFileStatus>
) {
  checkProvider();
  const prompts = [userPrompt];
  for (const selectedFileKey in selectedFiles) {
    const filename = selectedFileKey;
    const mode = selectedFiles[selectedFileKey];
    const filePrompt = await fileContentPromptWithLoader(
      mode,
      filename,
      repositoryPath
    );
    prompts.push(filePrompt);
  }
  prompts.push(PROMPT_INTRO_GIT_MESSAGE);
  prompts.push(PROMPT_JSON_RESULT);
  const result = await chat(prompts.join("\n\n"), SYSTEM);
  return extraGitMessage(result || "");
}
