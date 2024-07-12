"use client";

import { ImageIcon, Smile, X } from "lucide-react";
import { IconPicker } from "./IconPicker";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextAreaAutoSize from "react-textarea-autosize";

export const Toolbar = ({ initalData, preview }) => {
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initalData.title || "Untitled");

  const update = useMutation(api.document.updateDoc);
  const removeIcon = useMutation(api.document.removeIcon);

  const enableInput = () => {
    if (preview) {
      return;
    }
    setIsEditing(true);
    setTimeout(() => {
      setValue(initalData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onInput = (value) => {
    setValue(value);
    update({
      id: initalData._id,
      title: value || "Untitled",
    });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  const iconSelect = (icon) => {
    update({
      id: initalData._id,
      icon,
    });
  };

  const onRemoveIcon = () => {
    removeIcon({
      id: initalData._id,
    });
  };
  return (
    <div className="pl-[54px] group relative">
      {!!initalData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={iconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initalData.icon}
            </p>
          </IconPicker>
          <Button
            className="rounded-full opacity-0 group-hover:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
            onClick={onRemoveIcon}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initalData.icon && preview && (
        <p className="text-6xl pt-6">{initalData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initalData.icon && !preview && (
          <IconPicker asChild onChange={iconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add Icon
            </Button>
          </IconPicker>
        )}
        {!initalData.coverImg && !preview && (
          <Button
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
            onClick={() => {}}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextAreaAutoSize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initalData.title}
        </div>
      )}
    </div>
  );
};
