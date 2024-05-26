"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage, useBoolean } from "usehooks-ts";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ChatModelSettings } from "@/lib/settings/types";
import { DEFAULT_KEY, DEFAULT_SETTING } from "@/lib/settings/constants";

export function SettingButton() {
  const { toast } = useToast();
  const [setting, saveSetting] = useLocalStorage<ChatModelSettings>(
    DEFAULT_KEY,
    DEFAULT_SETTING
  );
  const [currentSetting, setCurrentSetting] =
    useState<ChatModelSettings>(setting);
  const { value, setValue, setFalse } = useBoolean();
  return (
    <Dialog open={value} onOpenChange={setValue}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="mt-auto rounded-lg"
          aria-label="Settings"
        >
          <Settings className="size-6" strokeWidth={2} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure the settings for the LLM model that the system needs to
            invoke.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Provider
            </Label>
            <Input
              value={currentSetting.provider}
              onChange={(e) =>
                setCurrentSetting({
                  ...currentSetting,
                  provider: e.currentTarget.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Model
            </Label>
            <Input
              value={currentSetting.model}
              onChange={(e) =>
                setCurrentSetting({
                  ...currentSetting,
                  model: e.currentTarget.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              API KEY
            </Label>
            <Input
              value={currentSetting.apiKey}
              onChange={(e) =>
                setCurrentSetting({
                  ...currentSetting,
                  apiKey: e.currentTarget.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              SECRET KEY
            </Label>
            <Input
              value={currentSetting.secretKey}
              onChange={(e) =>
                setCurrentSetting({
                  ...currentSetting,
                  secretKey: e.currentTarget.value,
                })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              saveSetting(currentSetting);
              toast({
                description: "Settings saved successfully.",
              });
              setFalse();
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
