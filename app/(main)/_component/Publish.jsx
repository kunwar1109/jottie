"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { Check, Copy, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Publish = ({ initialData }) => {
  const origin = useOrigin();
  const update = useMutation(api.document.updateDoc);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: true,
    }).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: "Publishing Note...",
      success: "Note Published!",
      error: "failed to publish note",
    });
  };

  const onUnPublish = () => {
    setSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: false,
    }).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: "Unpublishing Note...",
      success: "Note unpublished!",
      error: "failed to unpublish note",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 h-4 w-4 animate-pulse" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on web
              </p>
            </div>
            <div className="flex items center">
              <input
                value={url}
                className="flex-1 px-2 text-xs border  rounded-l-md h-8 truncate bg-muted"
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8  rounded-l-none"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              disabled={isSubmitting}
              className="w-full text-xs"
              onClick={onUnPublish}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flexflex-col items-center justify-center">
            <Globe className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others
            </span>
            <Button
              disabled={isSubmitting}
              className="w-full text-xs"
              onClick={onPublish}
              size="sm"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
