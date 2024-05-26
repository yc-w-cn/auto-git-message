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
import { Checkbox } from "@/components/ui/checkbox";
import { GitFileStatus } from "@/lib/git/git-file-status";

interface Props {
  repositoryPath: string | undefined;
  rawData: string;
  data: GitStatus;
  selectedFiles: Record<string, GitFileStatus>;
  onSelectedFilesChange: (_: Record<string, GitFileStatus>) => void;
}

export function GitStatusViewer({
  data,
  repositoryPath,
  rawData,
  selectedFiles,
  onSelectedFilesChange,
}: Props) {
  const addSelectedFiles = (newItem: string, newItemMode: GitFileStatus) => {
    if (!(newItem in selectedFiles)) {
      onSelectedFilesChange({ ...selectedFiles, [newItem]: newItemMode });
    }
  };

  const removeSelectedFiles = (removeItem: string) => {
    const newSelectedFiles = Object.keys(selectedFiles).reduce((acc, key) => {
      if (key !== removeItem) {
        acc[key] = selectedFiles[key];
      }
      return acc;
    }, {} as Record<string, GitFileStatus>);

    onSelectedFilesChange(newSelectedFiles);
  };

  const handleCheckedChange = (
    checked: boolean | "indeterminate",
    item: string,
    mode: GitFileStatus
  ) => (checked ? addSelectedFiles(item, mode) : removeSelectedFiles(item));

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
                  <li key={idx} className="flex items-center space-x-1">
                    <Checkbox
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        handleCheckedChange(checked, item, "added")
                      }
                    />
                    <FileContentChanges
                      fileName={item}
                      repositoryPath={repositoryPath}
                      mode="added"
                    />
                  </li>
                ))}
                {data.untrackedFiles.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-1">
                    <Checkbox
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        handleCheckedChange(checked, item, "added")
                      }
                    />
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
                  <li key={idx} className="flex items-center space-x-1">
                    <Checkbox
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        handleCheckedChange(checked, item, "modified")
                      }
                    />
                    <FileContentChanges
                      fileName={item}
                      repositoryPath={repositoryPath}
                      mode="modified"
                    />
                  </li>
                ))}
                {data.changesNotStagedForCommit.modified.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-1">
                    <Checkbox
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        handleCheckedChange(checked, item, "modified")
                      }
                    />
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
                  <li key={idx} className="flex items-center space-x-1">
                    <Checkbox
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        handleCheckedChange(checked, item, "deleted")
                      }
                    />
                    <FileContentChanges
                      fileName={item}
                      repositoryPath={repositoryPath}
                      mode="deleted"
                    />
                  </li>
                ))}
                {data.changesNotStagedForCommit.deleted.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-1">
                    <Checkbox
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        handleCheckedChange(checked, item, "deleted")
                      }
                    />
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
        </div>
      </ScrollArea>
    </div>
  );
}
