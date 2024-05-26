"use client";

import { ModeToggle } from "@/components/ModeToggle";
import { useScrollTop } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const scrolled = useScrollTop();
  return (
    <nav
      className={cn(
        "z-50 bg-background dark:bg-[#1f1f1f] fixed top-0 w-full flex items-center p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <div className="hidden md:block font-bold text-xl md:text-2xl cursor-pointer">
        Jottie
      </div>
      <div className="justify-between md:justify-end md:ml-auto w-full flex items-center gap-x-2">
        <ModeToggle />
      </div>
    </nav>
  );
};
