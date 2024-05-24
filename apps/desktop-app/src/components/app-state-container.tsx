"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RefreshCcwIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RepositorySetting } from "@/components/repository-setting";
import { RepositoryChanges } from "@/components/repository-changes";
import useForceUpdate from "@/hooks/use-force-update.hook";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function AppStateContainer({ className = "" }: Props) {
  const [repositoryPath, setRepositoryPath] = useState<string>("");
  const { lastUpdated, forceUpdate } = useForceUpdate();
  const [prompt, setPrompt] = useState(
    "According to the given changes, suggest git message for me."
  );
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefreshClick = () => {
    setIsSpinning(true);
    forceUpdate();

    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
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
          />
        </div>
        <div
          className={cn(
            "flex-1 min-w-[250px]",
            "flex flex-col w-full items-start gap-6"
          )}
        >
          <fieldset className="flex-1 min-h-[250px] flex flex-col gap-6 rounded-lg border p-4 w-full items-start">
            <legend className="-ml-1 px-1 text-sm font-medium">Input</legend>
            <div className="flex-grow flex flex-col gap-3 w-full">
              <Label htmlFor="message" className="flex-none">
                Prompt
              </Label>
              <Textarea
                id="message"
                value={prompt}
                onChange={(e) => setPrompt(e.currentTarget.value)}
                placeholder="Type your prompt here..."
                className="min-h-12 resize-none flex-grow shadow-none"
              />
            </div>
            <div className="flex-none text-center w-full">
              <Button>Generate</Button>
            </div>
          </fieldset>
          <fieldset className="flex-1 min-h-[250px] flex flex-col gap-6 rounded-lg border p-4 w-full items-start">
            <legend className="-ml-1 px-1 text-sm font-medium">Output</legend>
            <div className="flex-none flex flex-col gap-3 w-full">
              <Label htmlFor="summary">Summary (Required)</Label>
              <Input
                id="summary"
                placeholder="Summary (Required)"
                className="shadow-none"
              />
            </div>
            <div className="flex-grow flex flex-col gap-3 w-full">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description"
                className="min-h-12 resize-none shadow-none flex-grow"
              />
            </div>
          </fieldset>
        </div>
      </main>
    </div>
  );
}
