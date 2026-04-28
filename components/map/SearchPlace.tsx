"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";

export function SearchPlace({
  onSearch,
}: {
  onSearch: (place: string) => void;
}) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSearch = () => {
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <div
      className="flex items-center gap-2 rounded-xl transition-all"
      style={{
        background: focused ? "rgba(255,248,238,1)" : "rgba(255,248,238,0.7)",
        border: `1.5px solid ${focused ? "rgba(139,46,22,0.5)" : "rgba(176,120,64,0.35)"}`,
        boxShadow: focused ? "0 0 0 3px rgba(139,46,22,0.08)" : "none",
        padding: "6px 8px 6px 12px",
      }}
    >
      {/* Pin icon */}
      <MapPin
        className="h-4 w-4 flex-shrink-0 transition-colors"
        style={{ color: focused ? "#8b2e16" : "#b07840" }}
      />

      {/* Input */}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search any place… Rishikesh, Delhi, Goa"
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#2b160b",
          fontFamily: "'Lato', sans-serif",
          fontSize: 13,
          fontWeight: 400,
        }}
        className="placeholder:text-[#b07840]/60"
      />

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all hover:opacity-90 active:scale-95"
        style={{
          background: "#8b2e16",
          color: "#fff8ee",
          fontFamily: "'Lato', sans-serif",
          fontWeight: 700,
          letterSpacing: "0.04em",
          border: "none",
          boxShadow: "0 2px 8px rgba(139,46,22,0.28)",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <Search className="h-3.5 w-3.5" />
        Search
      </button>
    </div>
  );
}