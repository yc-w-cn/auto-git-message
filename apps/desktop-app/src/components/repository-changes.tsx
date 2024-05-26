"use client";

import { useEffect, useState } from "react";
import { extractFileList, GitStatus, parseGitStatus } from "@/lib/git/git-status";
import { GitStatusViewer } from "./git-status-viewer";
import { checkGitStatus } from "@/lib/commands/check-git-status";
import { GitFileStatus } from "@/lib/git/git-file-status";

interface Props {
  repositoryPath: string | undefined;
  timestamp: number;
  selectedFiles: Record<string, GitFileStatus>;
  onSelectedFilesChange: (_: Record<string, GitFileStatus>) => void;
}

export function RepositoryChanges({
  repositoryPath,
  timestamp,
  selectedFiles,
  onSelectedFilesChange,
}: Props) {
  const [statusText, setStatusText] = useState<string>("");
  const [gitStatus, setGitStatus] = useState<GitStatus>({
    branch: "",
    upstream: "",
    changesToBeCommitted: {
      modified: [],
      deleted: [],
      added: [],
    },
    changesNotStagedForCommit: {
      modified: [],
      deleted: [],
    },
    untrackedFiles: [],
  });

  useEffect(() => {
    if (repositoryPath) {
      checkGitStatus(repositoryPath).then((text) => {
        setStatusText(text);
      });
    } else {
      setStatusText("");
    }
  }, [repositoryPath, timestamp]);

  useEffect(() => {
    parseGitStatus(statusText, repositoryPath).then((res) => {
      setGitStatus(res)
      const fileList = extractFileList(res)
      const filteredSelectedFiles = Object.fromEntries(
        Object.entries(selectedFiles).filter(([key]) => fileList.includes(key))
      );
      onSelectedFilesChange(filteredSelectedFiles)
    });
  }, [statusText, repositoryPath]);

  return (
    <div className="flex-grow flex-shrink overflow-hidden flex w-full items-start gap-6">
      <fieldset className="flex gap-6 rounded-lg border px-4 py-2 w-full h-full">
        <legend className="-ml-1 px-1 text-sm font-medium">Changes</legend>
        <GitStatusViewer
          data={gitStatus}
          repositoryPath={repositoryPath}
          rawData={statusText}
          selectedFiles={selectedFiles}
          onSelectedFilesChange={onSelectedFilesChange}
        />
      </fieldset>
    </div>
  );
}
