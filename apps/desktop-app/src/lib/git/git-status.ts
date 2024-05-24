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

export function parseGitStatus(statusText: string): GitStatus {
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
    if (line.startsWith('位于分支')) {
      branch = line.replace('位于分支', '').trim();
    } else if (line.includes('您的分支与上游分支')) {
      const match = line.match(/'(.+)'/);
      upstream = match ? match[1] : '';
    } else if (line.includes('要提交的变更：')) {
      section = 'changesToBeCommitted';
    } else if (line.includes('尚未暂存以备提交的变更：')) {
      section = 'changesNotStagedForCommit';
    } else if (line.includes('未跟踪的文件:')) {
      section = 'untrackedFiles';
    } else if (line.includes('修改尚未加入提交')) {
      section = '';
    } else if (line.startsWith('修改：')) {
      const fileName = line.replace('修改：', '').trim();
      if (section === 'changesNotStagedForCommit') {
        changesNotStagedForCommit.modified.push(fileName);
      } else if (section === 'changesToBeCommitted') {
        changesToBeCommitted.modified.push(fileName);
      }
    } else if (line.startsWith('删除：')) {
      const fileName = line.replace('删除：', '').trim();
      if (section === 'changesNotStagedForCommit') {
        changesNotStagedForCommit.deleted.push(fileName);
      } else if (section === 'changesToBeCommitted') {
        changesToBeCommitted.deleted.push(fileName);
      }
    } else if (line.startsWith('新文件：')) {
      const fileName = line.replace('新文件：', '').trim();
      if (section === 'changesToBeCommitted') {
        changesToBeCommitted.added.push(fileName);
      }
    } else if (section === 'untrackedFiles' && line && !line.startsWith('（')) {
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
