"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
import { useEffect } from "react";

const Editor = ({ onChange, initialContent, editable }) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });

    return response.url;
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    uploadFile: handleUpload,
  });

  useEffect(() => {
    let timeout;
    if (editor) {
      timeout = setTimeout(() => {
        const firstBlock = editor.document[0];
        if (firstBlock)
          editor.updateBlock(firstBlock, { type: firstBlock.type });
      }, 100);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [editor]);
  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={() => onChange(JSON.stringify(editor.document, null, 2))}
      />
    </div>
  );
};

export default Editor;
