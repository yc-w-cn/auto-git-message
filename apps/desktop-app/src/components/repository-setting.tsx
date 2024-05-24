"use client";

import { Label } from "./ui/label";
import { useToast } from "@/components/ui/use-toast";
import { open } from "@tauri-apps/api/dialog";
import { ArrowRightIcon, FolderEditIcon, FolderIcon } from "lucide-react";

interface Props {
  repositoryPath: string;
  onRepositoryPathChange: (_: string) => void;
}

export function RepositorySetting({
  repositoryPath,
  onRepositoryPathChange,
}: Props) {
  const { toast } = useToast();

  const openFolderDialog = async () => {
    try {
      const selected = await open({
        defaultPath: ".",
        directory: true,
        multiple: false,
      });

      if (Array.isArray(selected)) {
        // do nothing
      } else if (selected) {
        onRepositoryPathChange(selected);
      } else {
        // cancel: do nothing
      }
    } catch (error) {
      toast({ title: "Error while opening folder dialog" });
      console.error("Error while opening folder dialog:", error);
    }
  };

  return (
    <div className="flex-none grid w-full items-start gap-6">
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">Repository</legend>
        <div className="w-full" onClick={openFolderDialog}>
          <Label
            className="flex items-center justify-between bg-gray-100 hover:bg-gray-200/60 dark:bg-gray-800 rounded-md px-4 py-3 cursor-pointer"
            htmlFor="file-folder"
          >
            <div className="flex items-center space-x-3">
              <FolderIcon className="flex-none h-6 w-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {showFolderPath(repositoryPath)}
              </span>
            </div>
            {repositoryPath ? (
              <FolderEditIcon className="flex-none h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ArrowRightIcon className="flex-none h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </Label>
        </div>
      </fieldset>
    </div>
  );
}

function showFolderPath(fullpath: string, emptyText = "Select a folder") {
  if (fullpath) {
    return fullpath.split("/").at(-1) || emptyText;
  }
  return emptyText;
}
