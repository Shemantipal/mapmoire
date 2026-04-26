"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchPlace({
  onSearch,
}: {
  onSearch: (place: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="absolute left-1/2 top-6 z-[1000] w-[92%] max-w-2xl -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full border border-white/15 bg-zinc-950/85 p-2 shadow-2xl backdrop-blur-2xl">
        <div className="ml-3 flex items-center gap-2 text-pink-300">
          <MapPin className="h-5 w-5" />
        </div>

        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(value)}
          placeholder="Search any place... Rishikesh, Delhi, Goa"
          className="h-12 flex-1 border-0 bg-transparent text-base text-white placeholder:text-zinc-500 focus-visible:ring-0"
        />

        <Button
          onClick={() => onSearch(value)}
          className="h-12 rounded-full bg-pink-500 px-6 hover:bg-pink-600"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}