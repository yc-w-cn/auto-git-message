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

export function AppStateContainer() {
  const [repositoryPath, setRepositoryPath] = useState<string>("");
  const { lastUpdated, forceUpdate } = useForceUpdate();
  const [prompt, setPrompt] = useState(
    "According to the given changes, suggest git message for me."
  );

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky md:static flex-none flex h-[57px] items-center gap-1 border-b bg-background px-4">
        <h1 className="text-xl font-semibold">AutoGitMessage</h1>
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex ml-auto gap-1.5 text-sm"
        >
          <RefreshCcwIcon className="size-3.5" />
          Refresh
        </Button>
      </header>

      <main className="static grid gap-4 md:overflow-hidden p-4 md:grid-cols-2 flex-grow flex-shrink overflow-hidden">
        <div className="relative flex-col items-start gap-4 md:flex">
          <RepositorySetting
            repositoryPath={repositoryPath}
            onRepositoryPathChange={setRepositoryPath}
          />
          <RepositoryChanges repositoryPath={repositoryPath} />
        </div>
        <section className="flex-none flex flex-col w-full items-start gap-6">
          <fieldset className="flex-1 flex flex-col gap-6 rounded-lg border p-4 w-full items-start">
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
          <fieldset className="flex-1 flex flex-col gap-6 rounded-lg border p-4 w-full items-start">
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
        </section>
      </main>
    </div>
  );
}
