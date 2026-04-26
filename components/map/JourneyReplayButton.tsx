"use client";

import { Route } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JourneyReplayButton({
  isTouring,
  onClick,
}: {
  isTouring: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={isTouring}
      className="rounded-full bg-pink-500 px-6 hover:bg-pink-600"
    >
      <Route className="mr-2 h-4 w-4" />
      {isTouring ? "Replaying..." : "Replay Journey"}
    </Button>
  );
}