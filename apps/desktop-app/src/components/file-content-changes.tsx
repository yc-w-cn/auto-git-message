"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useMemo, useState } from "react";
import path from "path-browserify";
import SyntaxHighlighter from "react-syntax-highlighter";
import { arduinoLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { checkIsDirectory } from "@/lib/commands/check-is-directory";
import { checkFileChanges } from "@/lib/commands/check-file-changes";
import { getFileContent } from "@/lib/commands/get-file-content";
import { showDeletedFile } from "@/lib/commands/show-deleted-file";

interface Props {
  fileName: string;
  repositoryPath: string | undefined;
  mode?: "added" | "modified" | "deleted";
}

export function FileContentChanges({ repositoryPath, fileName, mode }: Props) {
  const [fileChanges, setFileChanges] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDir, setIsDir] = useState<boolean | null>(null);

  useEffect(() => {
    if (!repositoryPath || !fileName) return;
    const fileFullPath = path.join(repositoryPath, fileName);
    checkIsDirectory(fileFullPath).then((res) => res && setIsDir(res));
  }, [repositoryPath, fileName]);

  useEffect(() => {
    if (!open || !repositoryPath || !fileName) return;
    const fileFullPath = path.join(repositoryPath, fileName);
    if (!fileFullPath) {
      setFileChanges("");
      return;
    }
    if (mode === "added") {
      setLoading(true);
      getFileContent(fileFullPath)
        .then((content) => {
          setFileChanges(content);
        })
        .catch((error) => {
          console.error("Failed to read file content:", error);
        })
        .finally(() => setLoading(false));
    } else if (mode === "deleted") {
      setLoading(true);
      showDeletedFile(fileFullPath)
        .then((content) => {
          setFileChanges(content);
        })
        .catch((error) => {
          console.error("Failed to read file content:", error);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      checkFileChanges(fileFullPath)
        .then((text) => {
          setFileChanges(text);
        })
        .catch((error) => {
          console.error("Failed to check file changes:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [repositoryPath, fileName, open]);

  const prefix = useMemo(() => {
    if (mode === "added") {
      return "[+]";
    }
    if (mode === "modified") {
      return "[M]";
    }
    if (mode === "deleted") {
      return "[-]";
    }
    return "";
  }, [mode]);

  if ([null, true].includes(isDir)) return <></>;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="text-left truncate">
        {prefix}
        {fileName}
      </SheetTrigger>
      <SheetContent className="sm:max-w-full w-2/3 flex flex-col">
        <SheetHeader>
          <SheetTitle>File Content Changes</SheetTitle>
          <SheetDescription>
            {loading ? "Loading..." : path.join(repositoryPath || "", fileName)}
          </SheetDescription>
        </SheetHeader>
        {!loading && (
          <SyntaxHighlighter
            style={arduinoLight}
            language={mode === "modified" ? "diff" : undefined}
            showLineNumbers={true}
            className="flex-grow"
            codeTagProps={{
              style: {
                height: "100%",
                overflow: "auto",
                fontSize: 12,
              },
            }}
            customStyle={{ padding: 0, width: "100%", overflowX: "auto" }}
          >
            {fileChanges.replaceAll("\n\n", "\n")}
          </SyntaxHighlighter>
        )}
      </SheetContent>
    </Sheet>
  );
}
