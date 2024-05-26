import { loadGitFileContent } from "@/lib/git/git-file-content-loader"
import path from "path-browserify"

export function fileContentPrompt(
  mode: "added" | "modified" | "deleted",
  filename: string,
  content: string
) {
  const header = `Follow contents is from ${mode} file (filename: ${filename})`
  return header + "\n\n" + content + "\n\n" + `---> file content (filename: ${filename}) end here  <---`
}

export async function fileContentPromptWithLoader(
  mode: "added" | "modified" | "deleted",
  filename: string,
  repositoryPath: string
) {
  const fullPath = path.join(repositoryPath, filename)
  const content = await loadGitFileContent(mode, fullPath)
  return fileContentPrompt(mode, filename, content)
}

