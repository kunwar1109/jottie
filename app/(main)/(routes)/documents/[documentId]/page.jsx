"use client";

import { Toolbar } from "@/components/Toolbar";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const DocumentIdPage = ({ params }) => {
  const document = useQuery(api.document.getById, {
    documentId: params.documentId,
  });

  if (document === undefined) {
    return <p>Loading...</p>;
  }

  if (document === null) {
    return <p>Not Found!</p>;
  }
  return (
    <div className="pb-40">
      <div className="h-[35vh]" />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initalData={document} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
