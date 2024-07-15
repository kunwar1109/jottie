"use client";

import { useCoverImg } from "@/hooks/use-cover-img";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { SingleImageDropzone } from "../SingleImageDropzone";

export const CoverImageModal = () => {
  const coverImg = useCoverImg();
  const update = useMutation(api.document.updateDoc);
  const [file, setFile] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { edgestore } = useEdgeStore();
  const params = useParams();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImg.onClose();
  };

  const onChange = async (file) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);
      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImg.url,
        },
      });

      await update({ id: params.documentId, coverImg: res.url });
      onClose();
    }
  };

  return (
    <Dialog open={coverImg.isOpen} onOpenChange={coverImg.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center font-semibold text-lg">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
