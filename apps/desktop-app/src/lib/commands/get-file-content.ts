import { readTextFile } from "@tauri-apps/api/fs";

export async function getFileContent(fullFilePath: string): Promise<string> {
  try {
    const content = await readTextFile(fullFilePath);
    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}
