"use client";

import { useEffect, useMemo, useState } from "react";
import { Command } from "@tauri-apps/api/shell";
import { parseGitStatus } from "@/lib/git/git-status";
import { GitStatusViewer } from "./git-status-viewer";

interface Props {
  repositoryPath: string | undefined;
  timestamp: number
}

export function RepositoryChanges({ repositoryPath, timestamp }: Props) {
  const [statusText, setStatusText] = useState<string>("");

  async function checkGitStatus(directory: string): Promise<string> {
    try {
      const command = new Command("run-git-status-command", [
        "-C",
        directory,
        "status",
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

  useEffect(() => {
    if (repositoryPath) {
      checkGitStatus(repositoryPath).then((text) => {
        setStatusText(text);
      });
    } else {
      setStatusText("");
    }
  }, [repositoryPath, timestamp]);

  const gitStatus = useMemo(() => parseGitStatus(statusText), [statusText]);

  return (
    <div className="flex-grow flex-shrink overflow-hidden flex w-full items-start gap-6">
      <fieldset className="flex gap-6 rounded-lg border px-4 py-2 w-full h-full">
        <legend className="-ml-1 px-1 text-sm font-medium">Changes</legend>
        <GitStatusViewer
          data={gitStatus}
          repositoryPath={repositoryPath}
          rawData={statusText}
        />
      </fieldset>
    </div>
  );
}
