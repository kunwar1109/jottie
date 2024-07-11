"use client";

import { Spinner } from "@/components/Spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Navigation } from "./_component/Navigation";
import { SearchCommand } from "@/components/SearchCommand";

const MainLayout = ({ children }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center dark:bg-[#1f1f1f]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    redirect("/");
  }

  return (
    <div className="h-full flex dark:bg-[#1f1f1f]">
      <Navigation />
      <main className="h-full flex-1 overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
