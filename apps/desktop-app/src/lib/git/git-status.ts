import { checkIsDirectory } from "../commands/check-is-directory";
import path from "path-browserify";

export type GitStatus = {
  branch: string;
  upstream: string;
  changesToBeCommitted: {
    modified: string[];
    deleted: string[];
    added: string[];
  };
  changesNotStagedForCommit: {
    modified: string[];
    deleted: string[];
  };
  untrackedFiles: string[];
};

export const extractFileList = (gitStatus: GitStatus): string[] => {
  const { changesToBeCommitted, changesNotStagedForCommit, untrackedFiles } = gitStatus;
  
  const fileList: string[] = [
    ...changesToBeCommitted.modified,
    ...changesToBeCommitted.deleted,
    ...changesToBeCommitted.added,
    ...changesNotStagedForCommit.modified,
    ...changesNotStagedForCommit.deleted,
    ...untrackedFiles,
  ];

  return fileList;
};

export async function parseGitStatus(
  statusText: string,
  repositoryPath: string | undefined = ""
): Promise<GitStatus> {
  const lines = statusText.split("\n").map((line) => line.trim());
  let branch = "";
  let upstream = "";
  const changesToBeCommitted = {
    modified: [] as string[],
    deleted: [] as string[],
    added: [] as string[],
  };
  const changesNotStagedForCommit = {
    modified: [] as string[],
    deleted: [] as string[],
  };
  const untrackedFiles: string[] = [];

  let section = "";

  for (const line of lines) {
    // 支持中文和英文的分支和上游分支信息
    if (line.startsWith("位于分支") || line.startsWith("On branch")) {
      branch = line.replace("位于分支", "").replace("On branch", "").trim();
    } else if (line.includes("您的分支与上游分支") || line.includes("Your branch is up to date with")) {
      const match = line.match(/'(.+)'/);
      upstream = match ? match[1] : "";
    } else if (line.includes("要提交的变更：") || line.includes("Changes to be committed:")) {
      section = "changesToBeCommitted";
    } else if (line.includes("尚未暂存以备提交的变更：") || line.includes("Changes not staged for commit:")) {
      section = "changesNotStagedForCommit";
    } else if (line.includes("未跟踪的文件:") || line.includes("Untracked files:")) {
      section = "untrackedFiles";
    } else if (line.includes("修改尚未加入提交") || line.includes("no changes added to commit")) {
      section = "";
    } else if (line.startsWith("修改：") || line.startsWith("modified:")) {
      const fileName = line.replace("修改：", "").replace("modified:", "").trim();
      if (await checkIsDirectory(path.join(repositoryPath, fileName))) continue;
      if (section === "changesNotStagedForCommit") {
        changesNotStagedForCommit.modified.push(fileName);
      } else if (section === "changesToBeCommitted") {
        changesToBeCommitted.modified.push(fileName);
      }
    } else if (line.startsWith("删除：") || line.startsWith("deleted:")) {
      const fileName = line.replace("删除：", "").replace("deleted:", "").trim();
      if (await checkIsDirectory(path.join(repositoryPath, fileName))) continue;
      if (section === "changesNotStagedForCommit") {
        changesNotStagedForCommit.deleted.push(fileName);
      } else if (section === "changesToBeCommitted") {
        changesToBeCommitted.deleted.push(fileName);
      }
    } else if (line.startsWith("新文件：") || line.startsWith("new file:")) {
      const fileName = line.replace("新文件：", "").replace("new file:", "").trim();
      if (await checkIsDirectory(path.join(repositoryPath, fileName))) continue;
      if (section === "changesToBeCommitted") {
        changesToBeCommitted.added.push(fileName);
      }
    } else if (section === "untrackedFiles" && line && !line.startsWith("（") && !line.startsWith("(")) {
      if (await checkIsDirectory(path.join(repositoryPath, line))) continue;
      untrackedFiles.push(line);
    }
  }

  return {
    branch,
    upstream,
    changesToBeCommitted,
    changesNotStagedForCommit,
    untrackedFiles,
  };
}
