"use client";

import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const Banner = ({ documentId }) => {
  const router = useRouter();
  const remove = useMutation(api.document.remove);
  const restore = useMutation(api.document.restoreTrash);

  const onRemove = () => {
    const promise = remove({
      id: documentId,
    });

    toast.promise(promise, {
      loading: "Deleting Note...",
      success: "Note deleted!",
      error: "failed to delete note",
    });
    router.push("/documents");
  };

  const onRestore = () => {
    const promise = restore({
      id: documentId,
    });

    toast.promise(promise, {
      loading: "Restoring Note...",
      success: "Note Restored!",
      error: "failed to restore note",
    });
  };
  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This page is in the Trash</p>
      <Button
        size="sm"
        variant="outline"
        onClick={onRestore}
        className="border-white bg-transparent hover:bg-primary/5 text-white p-1 px-2 h-auto font-normal"
      >
        Restore Page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white p-1 px-2 h-auto font-normal"
        >
          Delete Forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
