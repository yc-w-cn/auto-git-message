"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { invoke } from "@tauri-apps/api/tauri";
import { config } from "@/config";

export function GithubButton() {
  const openGithubLink = () => {
    invoke("open_browser", { url: config.github });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="mt-auto rounded-lg"
      aria-label="Settings"
      onClick={() => openGithubLink()}
    >
      <GitHubLogoIcon className="size-6" strokeWidth={2} />
    </Button>
  );
}
