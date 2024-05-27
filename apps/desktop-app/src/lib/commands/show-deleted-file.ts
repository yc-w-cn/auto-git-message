import { Command } from "@tauri-apps/api/shell";

export async function showDeletedFile(
  repositoryPath: string,
  filePath: string
): Promise<string> {
  try {
    const command = new Command("run-git-show-command", [
      "-C",
      repositoryPath,
      "show",
      "HEAD:" + filePath,
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
