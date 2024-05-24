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
import SyntaxHighlighter from "react-syntax-highlighter";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

interface Props {
  content?: string | undefined;
}

export function GitStatusContentSheet({ content }: Props) {
  console.log('content', content)
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
          {content ? (
            <SyntaxHighlighter className="p-4 pb-0 text-sm rounded-lg bg-white">
              {content}
            </SyntaxHighlighter>
          ) : (
            ""
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
