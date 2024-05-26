import { Command } from "@tauri-apps/api/shell";

export async function checkFileChanges(fileFullPath: string): Promise<string> {
  try {
    const command = new Command("run-git-diff-command", [
      "diff",
      fileFullPath,
    ]);
    const output = await command.execute();

    if (output.code === 0) {
      return output.stdout;
    } else {
      return `Error: ${output.stderr}`;
    }
  } catch (error) {
    return `Error: ${error}`;
  }
}