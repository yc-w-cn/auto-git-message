"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useMemo } from "react";

interface Props {
  content?: string | undefined;
}

export function GitStatusContentSheet({ content }: Props) {
  const txt2html = (text: string | undefined = "") => {
    return text.replaceAll("\n\n", "\n").replaceAll("\n", "<br />");
  };
  const __html = useMemo(() => txt2html(content), [content]);
  return (
    <Sheet>
      <SheetTrigger disabled={!content} asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg"
          aria-label="Git Status Information"
        >
          <InfoCircledIcon className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-screen">
          <SheetHeader>
            <SheetTitle>Git Status</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <section
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html,
            }}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
