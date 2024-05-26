import { checkFileChanges } from "../commands/check-file-changes";
import { getFileContent } from "../commands/get-file-content";
import { showDeletedFile } from "../commands/show-deleted-file";
import { GitFileStatus } from "./git-file-status";

export function loadGitFileContent(mode: GitFileStatus | undefined, fileFullPath: string) {
  if (mode === "added") {
    return getFileContent(fileFullPath);
  }
  if (mode === "deleted") {
    return showDeletedFile(fileFullPath);
  }
  return checkFileChanges(fileFullPath);
}
