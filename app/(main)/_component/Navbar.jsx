"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./Title";

export const Navbar = ({ collapsed, resetWidth }) => {
  const params = useParams();
  const document = useQuery(api.document.getById, {
    documentId: params.documentId,
  });

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
        <Title.Skeleton />
      </nav>
    );
  }

  if (document === null) {
    return null;
  }
  return (
    <>
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
        {collapsed && (
          <MenuIcon
            role="button"
            onClick={resetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
        </div>
      </nav>
    </>
  );
};
