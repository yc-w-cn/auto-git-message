import { loadGitFileContent } from "@/lib/git/git-file-content-loader";

export function fileContentPrompt(
  mode: "added" | "modified" | "deleted",
  filename: string,
  content: string
) {
  const header = `Follow contents is from ${mode} file (filename: ${filename})`;
  return (
    header +
    "\n\n" +
    content +
    "\n\n" +
    `---> file content (filename: ${filename}) end here  <---`
  );
}

export async function fileContentPromptWithLoader(
  mode: "added" | "modified" | "deleted",
  filename: string,
  repositoryPath: string
) {
  const content = await loadGitFileContent(mode, repositoryPath, filename);
  return fileContentPrompt(mode, filename, content);
}
