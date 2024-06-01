"use client";

import { ModeToggle } from "@/components/ModeToggle";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useScrollTop } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";

export const Navbar = () => {
  const scrolled = useScrollTop();
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <nav
      className={cn(
        "z-50 bg-background dark:bg-[#1f1f1f] fixed top-0 w-full flex items-center p-6",
        scrolled && "border-b shadow-sm",
      )}
    >
      <div className="hidden md:block font-bold text-xl md:text-2xl cursor-pointer">
        Jottie
      </div>
      <div className="justify-between md:justify-end md:ml-auto w-full flex items-center gap-x-2">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Get Jottie free</Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">Enter Jottie</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
};
