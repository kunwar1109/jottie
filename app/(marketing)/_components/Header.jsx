"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Header = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, Plans. Unified. Welcome to{" "}
        <span className="underline">Jottie</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Jottie is the connected workspace where <br />
        better, faster works happen.
      </h3>
      <Button>
        Enter Jottie
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};
