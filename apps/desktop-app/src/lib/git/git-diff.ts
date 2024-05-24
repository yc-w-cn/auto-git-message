interface FileChange {
  filename: string;
  additions: number;
  deletions: number;
}

export function parseGitDiff(diff: string): FileChange[] {
  const fileChanges: FileChange[] = [];
  let currentFile: FileChange | null = null;

  const lines = diff.split("\n");
  lines.forEach((line) => {
    if (line.startsWith("diff --git")) {
      // 新文件变更开始
      currentFile = {
        filename: line.split(" ")[2],
        additions: 0,
        deletions: 0,
      };
    } else if (line.startsWith("+")) {
      // 新增行
      if (currentFile) {
        currentFile.additions++;
      }
    } else if (line.startsWith("-")) {
      // 删除行
      if (currentFile) {
        currentFile.deletions++;
      }
    } else if (line.startsWith("@@")) {
      // diff 上下文行
      // 如果存在当前文件变更，则将其添加到结果中
      if (currentFile) {
        fileChanges.push(currentFile);
        currentFile = null;
      }
    }
  });

  return fileChanges;
}
