import { GitStatus } from "@/lib/git/git-status";
import {
  FileIcon,
  GitBranch,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { FileContentChanges } from "./file-content-changes";
import { GitStatusContentSheet } from "./git-status-content-sheet";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface Props {
  repositoryPath: string | undefined;
  rawData: string;
  data: GitStatus;
}

export function GitStatusViewer({ data, repositoryPath, rawData }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col",
        "bg-white dark:bg-gray-950 rounded-lg w-full mx-auto"
      )}
    >
      <div className="flex-none flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-gray-50">
            {data.branch || "Unknown"}
          </span>
        </div>
        <div>
          <GitStatusContentSheet content={rawData} />
        </div>
      </div>
      <ScrollArea>
        <div className="flex-grow border-gray-200 dark:border-gray-800 pt-4 overflow-y-auto">
          <div className="grid grid-cols-[20px_1fr] items-start gap-2 mb-4">
            <PlusIcon className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-50">
                Added Files
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                {data.changesToBeCommitted.added.map((item, idx) => (
                  <li key={idx}>
                    <FileContentChanges
                      fileName={item}
                      repositoryPath={repositoryPath}
                      mode="added"
                    />
                  </li>
                ))}
                {data.untrackedFiles.map((item, idx) => (
                  <li key={idx}>
                    <FileContentChanges
                      fileName={item}
                      repositoryPath={repositoryPath}
                      mode="added"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-[20px_1fr] items-start gap-2 mb-4">
            <PencilIcon className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-50">
                Modified Files
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                {data.changesToBeCommitted.modified.map((item, idx) => (
                  <li key={idx}>
                    <FileContentChanges
                      fileName={item}
                      repositoryPath={repositoryPath}
                      mode="modified"
                    />
                  </li>
                ))}
                {data.changesNotStagedForCommit.modified.map((item, idx) => (
                  <li key={idx}>
                    <FileContentChanges
                      fileName={item}
                      repositoryPath={repositoryPath}
                      mode="modified"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-[20px_1fr] items-start gap-2 mb-4">
            <TrashIcon className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-50">
                Deleted Files
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                {data.changesToBeCommitted.deleted.map((item, idx) => (
                  <li key={idx}>
                    <FileContentChanges
                      fileName={item}
                      repositoryPath={repositoryPath}
                      mode="deleted"
                    />
                  </li>
                ))}
                {data.changesNotStagedForCommit.deleted.map((item, idx) => (
                  <li key={idx}>
                    <FileContentChanges
                      fileName={item}
                      repositoryPath={repositoryPath}
                      mode="deleted"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-[20px_1fr] items-start gap-2">
            <FileIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-50">
                Untracked Files
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                {data.untrackedFiles.map((item, idx) => (
                  <li key={idx}>
                    <FileContentChanges
                      fileName={item}
                      repositoryPath={repositoryPath}
                      mode="added"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
