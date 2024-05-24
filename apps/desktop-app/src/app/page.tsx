import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HomeIcon } from "lucide-react";
import { GithubButton } from "@/components/github-button";
import { AppStateContainer } from "@/components/app-state-container";
import { SettingButton } from "@/components/setting-button";

const Home: React.FC = () => {
  return (
    <div className="flex h-screen w-full pl-[53px] md:overflow-hidden">
      <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r bg-white">
        <div className="border-b p-2">
          <Image
            width={80}
            height={80}
            src="/logo.png"
            className="size-10 fill-foreground"
            alt="LOGO"
          />
        </div>
        <nav className="grid gap-1 p-2">
          <Button
            variant="ghost"
            size="icon"
            className="mt-auto rounded-lg bg-muted"
            aria-label="Settings"
          >
            <HomeIcon className="size-6" strokeWidth={2} />
          </Button>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <GithubButton />
          <SettingButton />
        </nav>
      </aside>
      <AppStateContainer className="flex-grow" />
    </div>
  );
};

export default Home;
