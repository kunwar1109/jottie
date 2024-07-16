"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Toolbar } from "@/components/Toolbar";
import { Cover } from "@/components/Cover";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const DocumentIdPage = ({ params }) => {
  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/Editor"), {
        ssr: false,
      }),
    [],
  );
  const document = useQuery(api.document.getById, {
    documentId: params.documentId,
  });

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-3xl lg:max-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <p>Not Found!</p>;
  }

  return (
    <div className="pb-40">
      <Cover preview url={document.coverImg} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar preview initalData={document} />
        <Editor
          editable={false}
          initialContent={document.content}
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export default DocumentIdPage;
