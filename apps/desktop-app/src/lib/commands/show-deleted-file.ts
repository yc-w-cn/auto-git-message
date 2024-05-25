import { Command } from "@tauri-apps/api/shell";

export async function showDeletedFile(fileFullPath: string): Promise<string> {
  try {
    const command = new Command("run-git-show-command", [
      "show",
      "HEAD:" + fileFullPath,
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
