"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { readTextFile } from "@tauri-apps/api/fs";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Command } from "@tauri-apps/api/shell";
import { useEffect, useMemo, useState } from "react";
import path from "path-browserify";
import SyntaxHighlighter from "react-syntax-highlighter";
import { invoke } from "@tauri-apps/api/tauri";

interface Props {
  fileName: string;
  repositoryPath: string | undefined;
  mode?: "added";
}

export function GitFileViewer({ repositoryPath, fileName, mode }: Props) {
  const [fileChanges, setFileChanges] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDir, setIsDir] = useState<boolean | null>(null);

  const checkIsDirectory = async (fileFullPath: string) => {
    try {
      const result = await invoke<boolean>("is_directory", {
        path: fileFullPath,
      });
      setIsDir(result);
    } catch (error) {
      console.error("Error checking directory:", error);
    }
  };

  async function getFileContent(fullFilePath: string): Promise<string> {
    try {
      const content = await readTextFile(fullFilePath);
      return content;
    } catch (error) {
      console.error("Error reading file:", error);
      throw error;
    }
  }

  async function checkFileChanges(fileFullPath: string): Promise<string> {
    try {
      const command = new Command("run-git-diff-command", [
        "diff",
        fileFullPath,
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
    if (!repositoryPath || !fileName) return;
    const fileFullPath = path.join(repositoryPath, fileName);
    checkIsDirectory(fileFullPath);
  }, [repositoryPath, fileName]);

  useEffect(() => {
    if (!open || !repositoryPath || !fileName) return;
    const fileFullPath = path.join(repositoryPath, fileName);
    if (fileFullPath && mode === "added") {
      setLoading(true);
      getFileContent(fileFullPath)
        .then((content) => {
          setFileChanges(content);
        })
        .catch((error) => {
          console.error("Failed to read file content:", error);
        })
        .finally(() => setLoading(false));
    } else if (fileFullPath) {
      setLoading(true);
      checkFileChanges(fileFullPath)
        .then((text) => {
          setFileChanges(text);
        })
        .catch((error) => {
          console.error("Failed to check file changes:", error);
        })
        .finally(() => setLoading(false));
    } else {
      setFileChanges("");
    }
  }, [repositoryPath, fileName, open]);

  const prefix = useMemo(() => {
    if (mode === "added") {
      return "[+]";
    }
    return "";
  }, [mode]);

  if ([null, true].includes(isDir)) return <></>;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        {prefix}
        {fileName}
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-screen">
          <SheetHeader>
            <SheetTitle>File Content Changes</SheetTitle>
            <SheetDescription>{loading && "Loading..."}</SheetDescription>
          </SheetHeader>
          {fileChanges ? (
            <SyntaxHighlighter className="p-4 pb-0 text-sm rounded-lg bg-white">
              {fileChanges}
            </SyntaxHighlighter>
          ) : (
            ""
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
