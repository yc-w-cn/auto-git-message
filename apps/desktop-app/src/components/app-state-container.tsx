"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CornerDownLeft, RefreshCcwIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RepositorySetting } from "@/components/repository-setting";
import { RepositoryChanges } from "@/components/repository-changes";
import useForceUpdate from "@/hooks/use-force-update.hook";
import { cn } from "@/lib/utils";
import { generateGitMessage } from "@/lib/llm/core";
import { CopyIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "./ui/use-toast";
import { GitFileStatus } from "@/lib/git/git-file-status";
import { GitSuggestion } from "@/lib/git/git-suggestion";

interface Props {
  className?: string;
}

export function AppStateContainer({ className = "" }: Props) {
  const { toast } = useToast();
  const [repositoryPath, setRepositoryPath] = useState<string>("");
  const { lastUpdated, forceUpdate } = useForceUpdate();
  const [prompt, setPrompt] = useState(
    "According to the given changes, suggest git message for me."
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<
    Record<string, GitFileStatus>
  >({});
  const [suggestion, setSuggestion] = useState<GitSuggestion>({
    summary: "",
    description: "",
  });
  const [generating, setGenerating] = useState(false);

  const resetSelectedFiles = () => {
    setSelectedFiles({});
  };

  useEffect(() => {
    resetSelectedFiles();
  }, [repositoryPath]);

  const handleRefreshClick = () => {
    setIsSpinning(true);

    forceUpdate();

    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
  };

  const countSelectedFiles = useMemo(
    () => Object.keys(selectedFiles).length,
    [selectedFiles]
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({ description: "Copied to clipboard" });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className={cn("flex flex-col h-screen md:overflow-hidden", className)}>
      <header className="fixed top-0 w-full md:static flex-none flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <h1 className="text-xl font-semibold">AutoGitMessage</h1>
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex ml-auto gap-1.5 text-sm"
          onClick={handleRefreshClick}
        >
          <RefreshCcwIcon
            className={cn("size-3.5", isSpinning ? "animate-spin" : "")}
          />
          Refresh
        </Button>
      </header>

      <main
        className={cn(
          "mt-[57px] md:mt-0 flex flex-col md:flex-row md:flex-grow md:overflow-hidden ",
          "static gap-4 p-4"
        )}
      >
        <div className={cn("flex-1", "flex flex-col items-start gap-4")}>
          <RepositorySetting
            repositoryPath={repositoryPath}
            onRepositoryPathChange={setRepositoryPath}
          />
          <RepositoryChanges
            repositoryPath={repositoryPath}
            timestamp={lastUpdated}
            selectedFiles={selectedFiles}
            onSelectedFilesChange={setSelectedFiles}
          />
        </div>
        <div
          className={cn(
            "flex-1 min-w-[250px]",
            "flex flex-col w-full items-start gap-6"
          )}
        >
          <fieldset className="flex-1 min-h-[200px] flex flex-col gap-6 rounded-lg border p-4 w-full items-start">
            <legend className="-ml-1 px-1 text-sm font-medium">Input</legend>
            <div className="flex-grow flex flex-col gap-3 w-full relative">
              <Label htmlFor="message" className="flex-none">
                Prompt
              </Label>
              <Textarea
                id="message"
                value={prompt}
                onChange={(e) => setPrompt(e.currentTarget.value)}
                placeholder="Type your prompt here..."
                maxLength={200}
                className="min-h-12 resize-none flex-grow shadow-none pb-12"
              ></Textarea>
              <div className="absolute left-0 bottom-2 flex justify-between w-full px-2 items-center">
                <span className="text-sm font-medium">
                  {countSelectedFiles === 0 && "No Files Selected"}
                  {countSelectedFiles === 1 && "Selected 1 File"}
                  {countSelectedFiles > 1 &&
                    `Selected ${countSelectedFiles} Files`}
                </span>
                {generating}
                <Button
                  type="submit"
                  size="sm"
                  disabled={generating || countSelectedFiles === 0}
                  onClick={async () => {
                    setGenerating(true);
                    try {
                      const answer = await generateGitMessage(
                        prompt,
                        repositoryPath,
                        selectedFiles
                      );
                      setSuggestion(answer);
                    } catch (e) {
                      console.error("Error: ", e);
                    } finally {
                      setGenerating(false);
                    }
                  }}
                >
                  {generating ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Generating
                    </>
                  ) : (
                    <>
                      Send Prompt
                      <CornerDownLeft className="size-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </fieldset>
          <fieldset className="flex-1 min-h-[250px] flex flex-col gap-6 rounded-lg border p-4 w-full items-start">
            <legend className="-ml-1 px-1 text-sm font-medium">Output</legend>
            <div className="flex-none flex flex-col gap-3 w-full relative">
              <Label htmlFor="summary">Summary (Required)</Label>
              <Input
                id="summary"
                value={suggestion.summary}
                placeholder="Summary (Required)"
                className="shadow-none"
                readOnly
              />
              <Button
                onClick={() => copyToClipboard(suggestion.summary || "")}
                variant="link"
                className="absolute right-0 bottom-0 text-gray-300 hover:text-black"
              >
                <CopyIcon />
              </Button>
            </div>
            <div className="flex-grow flex flex-col gap-3 w-full relative">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={suggestion.description}
                placeholder="Description"
                className="min-h-12 resize-none shadow-none flex-grow"
                readOnly
              />
              <Button
                onClick={() => copyToClipboard(suggestion.description || "")}
                variant="link"
                className="absolute right-0 bottom-0 text-gray-300 hover:text-black"
              >
                <CopyIcon />
              </Button>
            </div>
          </fieldset>
        </div>
      </main>
    </div>
  );
}
