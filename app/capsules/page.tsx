"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Camera,
  Filter,
  Loader2,
  Share2,
  Star,
  Film,
  Disc,
  Quote,
  Eye,
  ExternalLink,
  Search,
} from "lucide-react";

type Capsule = {
  id: string;
  placeName: string;
  state: string | null;
  caption: string | null;
  quote: string | null;
  mood: string | null;
  overhyped: string | null;
  hiddenGem: string | null;
  songTitle: string | null;
  artist: string | null;
  spotifyUrl: string | null;
  previewUrl: string | null;
  albumArt: string | null;
  images: string[];
  createdAt: string;
};

// ----------------------------------------------------------------------
// 1. VINTAGE UI COMPONENTS & EFFECTS
// ----------------------------------------------------------------------

const VintageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,900&display=swap');

    .mapmoire-page {
      font-family: 'Courier Prime', monospace;
      background-color: #ead8b8;
      color: #2b160b;
    }

    .mapmoire-serif {
      font-family: 'Playfair Display', serif;
    }

    .film-grain {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
      z-index: 50;
      opacity: 0.15;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      mix-blend-multiply;
    }

    /* Retro Inputs */
    .retro-input {
      background: #fff3dc;
      border: 3px solid #4b260f;
      color: #2b160b;
      font-family: 'Courier Prime', monospace;
      font-weight: bold;
      transition: all 0.2s;
      box-shadow: 4px 4px 0 #4b260f;
    }
    .retro-input:focus {
      outline: none;
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0 #4b260f;
    }
    .retro-input::placeholder { color: #8b6b5d; font-style: italic; }

    /* Retro Buttons */
    .retro-btn {
      background: #8b2e16;
      border: 3px solid #4b260f;
      color: #fff3dc;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      box-shadow: 4px 4px 0 #4b260f;
      transition: all 0.1s;
    }
    .retro-btn:active {
      transform: translate(4px, 4px);
      box-shadow: 0 0 0 #4b260f;
    }

    /* Ticket Chips */
    .ticket-chip {
      position: relative;
      background: #fff3dc;
      border: 3px solid #4b260f;
      color: #4b260f;
      font-weight: bold;
      text-transform: uppercase;
      padding: 8px 16px;
      box-shadow: 4px 4px 0 #4b260f;
      cursor: pointer;
      transition: all 0.1s;
      white-space: nowrap;
    }
    .ticket-chip:active {
      transform: translate(4px, 4px);
      box-shadow: 0 0 0 #4b260f;
    }
    .ticket-chip.active {
      background: #4b260f;
      color: #fff3dc;
    }

    /* Typewriter Tape */
    .dymo-tape {
      background: #111;
      color: #fff;
      font-family: monospace;
      text-transform: uppercase;
      padding: 2px 6px;
      box-shadow: 1px 1px 0 rgba(0,0,0,0.5);
      transform: rotate(-1deg);
      display: inline-block;
    }

    /* Image Sepia Effect */
    .vintage-photo {
      filter: sepia(0.6) contrast(1.1) brightness(0.9) grayscale(0.2);
    }

    /* Hide Scrollbar for mobile swiping */
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

function WaxSeal({ num }: { num: number }) {
  return (
    <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#8b2e16] shadow-[2px_2px_0_#4b260f] border-2 border-[#4b260f]">
      <div className="absolute inset-1 rounded-full border border-dashed border-[#fff3dc]/50" />
      <span className="mapmoire-serif text-xs sm:text-sm font-black text-[#fff3dc]">No.{num}</span>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. MODULAR HUT CAPSULE COMPONENT
// ----------------------------------------------------------------------

function HutCapsule({
  capsule,
  index,
  total,
  sharingId,
  onShare,
}: {
  capsule: Capsule;
  index: number;
  total: number;
  sharingId: string | null;
  onShare: (args: { type: "city" | "capsule"; placeName?: string; capsuleId?: string }) => void;
}) {
  const memNum = total - index;

  return (
    <div className="group relative mt-12 sm:mt-16 transition-transform sm:hover:-translate-y-1">
      {/* --- Hard Shadow Underlay --- */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3">
        <div 
          className="absolute bottom-[calc(100%-2px)] w-full h-[50px] sm:h-[70px] bg-[#4b260f]" 
          style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} 
        />
        <div className="w-full h-full bg-[#4b260f]" />
      </div>

      {/* --- Hut Roof --- */}
      <div 
        className="relative z-10 w-full h-[50px] sm:h-[70px] bg-[#4b260f] flex justify-center items-end pb-1"
        style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}
      >
        <div 
          className="absolute bottom-0 w-[calc(100%-6px)] sm:w-[calc(100%-8px)] h-[calc(100%-3px)] sm:h-[calc(100%-4px)] bg-[#8b2e16]"
          style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}
        />
        <div className="absolute -bottom-2 sm:-bottom-3 z-20">
          <WaxSeal num={memNum} />
        </div>
      </div>

      {/* --- Hut Body --- */}
      <div className="relative z-10 w-full bg-[#ead8b8] border-[3px] sm:border-4 border-t-0 border-[#4b260f] p-4 sm:p-5 pb-5 sm:pb-6">
        
        {/* Header Strip */}
        <div className="flex justify-between items-start mb-4 pt-2 gap-2">
          <div className="min-w-0">
            <h2 className="mapmoire-serif text-2xl sm:text-3xl font-black text-[#2b160b] leading-none uppercase tracking-tighter truncate">
              {capsule.placeName}
            </h2>
            {capsule.state && (
              <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#8b2e16] truncate">
                {capsule.state}
              </p>
            )}
          </div>
          
          <button
            onClick={() => onShare({ type: "capsule", capsuleId: capsule.id, placeName: capsule.placeName })}
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center border-3 border-[#4b260f] bg-[#fff3dc] text-[#4b260f] shadow-[2px_2px_0_#4b260f] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            {sharingId === capsule.id ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-[#8b2e16]" />
            ) : (
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>

        {/* Windows (Images) inside Polaroid Frames */}
        {capsule.images?.length > 0 && (
          <div className="mb-5 sm:mb-6 grid gap-4">
            {capsule.images.slice(0, 1).map((img, i) => (
              <div key={i} className="bg-[#fff3dc] p-2.5 sm:p-3 pb-6 sm:pb-8 border-3 border-[#4b260f] shadow-[4px_4px_0_rgba(75,38,15,0.2)] transform -rotate-1">
                <div className="relative h-40 sm:h-48 w-full overflow-hidden border-2 border-[#4b260f]">
                  <Image
                    src={img}
                    alt="Memory"
                    fill
                    className="object-cover vintage-photo"
                    unoptimized
                  />
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-[#fff3dc] opacity-80 font-mono text-[8px] sm:text-[10px] drop-shadow-md">
                    {new Date(capsule.createdAt).toLocaleDateString("en-US", { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Story Section */}
        <div className="space-y-4">
          {capsule.caption && (
            <div className="border-l-[3px] sm:border-l-4 border-[#8b2e16] pl-3 sm:pl-4">
              <p className="font-bold leading-relaxed text-[#4b260f] text-xs sm:text-sm">
                {capsule.caption}
              </p>
            </div>
          )}

          {capsule.quote && (
            <div className="bg-[#fff3dc] border-3 border-[#4b260f] p-3 sm:p-4 relative">
              <Quote className="absolute -top-3 -left-2 h-5 w-5 sm:h-6 sm:w-6 text-[#8b2e16] fill-[#8b2e16] bg-[#ead8b8]" />
              <p className="mapmoire-serif text-base sm:text-lg italic text-[#2b160b] text-center">
                "{capsule.quote}"
              </p>
            </div>
          )}

          {/* Dymo Tags */}
          {(capsule.mood || capsule.overhyped || capsule.hiddenGem) && (
            <div className="space-y-2.5 sm:space-y-3 py-2 border-y-[3px] sm:border-y-4 border-double border-[#4b260f]">
              {capsule.mood && (
                <div><span className="dymo-tape text-[10px] sm:text-xs bg-[#8b2e16]">MOOD: {capsule.mood}</span></div>
              )}
              {capsule.hiddenGem && (
                <div>
                  <span className="dymo-tape text-[10px] sm:text-xs bg-[#2b160b]">GEM</span>
                  <p className="mt-1 text-[10px] sm:text-xs font-bold text-[#4b260f] leading-snug">- {capsule.hiddenGem}</p>
                </div>
              )}
              {capsule.overhyped && (
                <div>
                  <span className="dymo-tape text-[10px] sm:text-xs bg-[#5a3218]">SKIP</span>
                  <p className="mt-1 text-[10px] sm:text-xs font-bold text-[#4b260f] leading-snug">- {capsule.overhyped}</p>
                </div>
              )}
            </div>
          )}

          {/* Analog Music Player */}
          {capsule.songTitle && (
            <div className="flex items-center gap-3 sm:gap-4 bg-[#fff3dc] border-3 border-[#4b260f] p-2 sm:p-3 shadow-[4px_4px_0_#4b260f]">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center bg-[#2b160b] rounded-full border-2 border-[#fff3dc] animate-[spin-slow_4s_linear_infinite]">
                 <Disc className="h-5 w-5 sm:h-6 sm:w-6 text-[#ead8b8]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-[#2b160b] uppercase text-xs sm:text-sm">{capsule.songTitle}</p>
                <p className="truncate text-[10px] sm:text-xs font-bold text-[#8b2e16]">{capsule.artist}</p>
              </div>
              {capsule.spotifyUrl && (
                <a
                  href={capsule.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center border-3 border-[#4b260f] bg-[#8b2e16] text-[#fff3dc] transition-transform sm:hover:-translate-y-1 shadow-[2px_2px_0_#4b260f]"
                >
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
              )}
            </div>
          )}

          {/* Footer Ledger */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 mt-2 border-t-2 border-dashed border-[#4b260f]">
            <div className="flex items-center gap-1.5 sm:gap-2 border-[2px] sm:border-3 border-[#4b260f] bg-[#fff3dc] px-2 py-1 shadow-[2px_2px_0_#4b260f]">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#2b160b] text-[#2b160b]" />
              <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest">+25 XP</span>
            </div>
            <p className="font-mono text-[10px] sm:text-xs font-bold uppercase text-[#8b2e16]">
              {new Date(capsule.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

export default function CapsulesPage() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("mapmoire-profile-image");
    if (savedProfile) setProfileImage(savedProfile);

    async function fetchCapsules() {
      try {
        const res = await fetch("/api/capsules");
        setCapsules(res.ok ? await res.json() : []);
      } finally {
        setLoading(false);
      }
    }
    fetchCapsules();
  }, []);

  const uniqueCities = useMemo(() => Array.from(new Set(capsules.map((c) => c.placeName))), [capsules]);

  const filteredCapsules = capsules.filter((c) => {
    const cityMatch = activeCity ? c.placeName === activeCity : true;
    const text = `${c.placeName} ${c.state} ${c.caption} ${c.quote} ${c.songTitle} ${c.artist} ${c.mood} ${c.overhyped} ${c.hiddenGem}`;
    return cityMatch && text.toLowerCase().includes(search.toLowerCase());
  });

  const xp = capsules.length * 25;
  const level = Math.max(1, Math.floor(xp / 100) + 1);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setProfileImage(result);
      localStorage.setItem("mapmoire-profile-image", result);
    };
    reader.readAsDataURL(file);
  };

  const createShareLink = async ({
    type,
    placeName,
    capsuleId,
  }: {
    type: "all" | "city" | "capsule";
    placeName?: string;
    capsuleId?: string;
  }) => {
    try {
      setSharingId(capsuleId || placeName || type);
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, placeName, capsuleId }),
      });
      if (!res.ok) return alert("Could not create share link.");
      const data = await res.json();
      await navigator.clipboard.writeText(data.url);
      setCopiedText(
        type === "all" ? "ARCHIVE COPIED" : type === "city" ? `${placeName} COPIED` : "MEMORY COPIED"
      );
      setTimeout(() => setCopiedText(""), 2200);
    } finally {
      setSharingId(null);
    }
  };

  return (
    <>
      <VintageStyles />
      
      <main className="mapmoire-page relative min-h-screen">
        <div className="film-grain" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
          
          {/* === VINTAGE EXPLORER ID / HEADER === */}
          <div className="bg-[#fff3dc] border-[3px] sm:border-4 border-[#4b260f] p-5 sm:p-8 shadow-[6px_6px_0_#4b260f] sm:shadow-[8px_8px_0_#4b260f] mb-8 sm:mb-12">
            
            {/* Header Title */}
            <div className="border-b-[3px] sm:border-b-4 border-double border-[#4b260f] pb-4 sm:pb-6 mb-6 sm:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 sm:gap-4">
              <div>
                <h1 className="mapmoire-serif text-4xl sm:text-5xl md:text-7xl font-black text-[#2b160b] uppercase tracking-tighter leading-none">
                  The Archive.
                </h1>
                <p className="font-bold text-[#8b2e16] mt-1 sm:mt-2 text-[10px] sm:text-base uppercase tracking-[0.2em] sm:tracking-[0.3em]">Mapmoire Field Ledger</p>
              </div>
              <div className="bg-[#2b160b] text-[#fff3dc] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base font-bold uppercase tracking-widest border-2 border-[#2b160b]">
                Vol. 01 // Active
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
              {/* Photo Area */}
              <div className="shrink-0 bg-[#fff3dc] p-2.5 pb-6 sm:p-3 sm:pb-8 border-3 border-[#4b260f] shadow-[4px_4px_0_rgba(75,38,15,0.2)] transform -rotate-2 w-full max-w-[160px] md:max-w-none">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-32 w-full md:h-40 md:w-32 overflow-hidden border-2 border-[#4b260f] bg-[#ead8b8] group flex items-center justify-center"
                >
                  {profileImage ? (
                    <Image src={profileImage} alt="Profile" fill className="object-cover vintage-photo" unoptimized />
                  ) : (
                    <div className="text-center text-[#4b260f]">
                      <Camera className="mx-auto h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                      <p className="text-[8px] sm:text-[10px] font-bold uppercase">Attach<br/>Photo</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[#4b260f]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[#fff3dc] font-bold text-[10px] sm:text-xs uppercase tracking-widest">Update</span>
                  </div>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleProfileChange} className="hidden" />
                <p className="text-center mt-2 sm:mt-3 font-mono text-[8px] sm:text-[10px] font-bold text-[#4b260f] uppercase">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
              </div>

              {/* Stats & Search */}
              <div className="flex-1 w-full flex flex-col justify-between">
                
                {/* Stats Table (2x2 on mobile, 4x1 on desktop) */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-[3px] sm:border-4 border-[#4b260f] bg-[#ead8b8] mb-5 sm:mb-6">
                  <div className="border-r-[2px] border-b-[2px] md:border-b-0 border-dashed border-[#4b260f] p-3 sm:p-4">
                    <p className="text-[9px] sm:text-[10px] font-bold text-[#8b2e16] uppercase tracking-widest">Rank</p>
                    <p className="text-lg sm:text-xl font-black text-[#2b160b] uppercase">Lv.{level}</p>
                  </div>
                  <div className="border-b-[2px] md:border-b-0 md:border-r-[2px] border-dashed border-[#4b260f] p-3 sm:p-4">
                    <p className="text-[9px] sm:text-[10px] font-bold text-[#8b2e16] uppercase tracking-widest">XP</p>
                    <p className="text-lg sm:text-xl font-black text-[#2b160b]">{xp}</p>
                  </div>
                  <div className="border-r-[2px] border-dashed border-[#4b260f] p-3 sm:p-4">
                    <p className="text-[9px] sm:text-[10px] font-bold text-[#8b2e16] uppercase tracking-widest">Ports</p>
                    <p className="text-lg sm:text-xl font-black text-[#2b160b]">{uniqueCities.length}</p>
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-[9px] sm:text-[10px] font-bold text-[#8b2e16] uppercase tracking-widest">Entries</p>
                    <p className="text-lg sm:text-xl font-black text-[#2b160b]">{capsules.length}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-[#4b260f]" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Retrieve coordinates..."
                      className="retro-input h-12 sm:h-14 w-full pl-10 sm:pl-12 pr-4 text-sm sm:text-base"
                    />
                  </div>
                  <button
                    onClick={() => createShareLink({ type: "all" })}
                    className="retro-btn flex h-12 sm:h-14 items-center justify-center gap-2 px-6 sm:px-8 text-sm sm:text-base"
                  >
                    {sharingId === "all" ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />}
                    {copiedText || "Publish"}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* === TICKET CHIP FILTERS (Swipeable on Mobile) === */}
          {!loading && uniqueCities.length > 0 && (
            <div className="mb-8 sm:mb-12 flex items-center gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-2 sm:pb-4">
              <div className="bg-[#2b160b] text-[#fff3dc] p-2.5 sm:p-3 border-2 border-[#2b160b] shrink-0">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <button
                onClick={() => setActiveCity(null)}
                className={`ticket-chip text-xs sm:text-sm ${activeCity === null ? "active" : ""}`}
              >
                All Regions [{capsules.length}]
              </button>
              {uniqueCities.map((city) => {
                const count = capsules.filter((c) => c.placeName === city).length;
                return (
                  <button
                    key={city}
                    onClick={() => setActiveCity(activeCity === city ? null : city)}
                    className={`ticket-chip text-xs sm:text-sm ${activeCity === city ? "active" : ""}`}
                  >
                    ★ {city} [{count}]
                  </button>
                );
              })}
            </div>
          )}

          {/* === LOADING STATE === */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 sm:py-32 border-4 border-dashed border-[#4b260f] bg-[#fff3dc]/50 mx-2 sm:mx-0">
              <Film className="h-10 w-10 sm:h-12 sm:w-12 text-[#8b2e16] animate-pulse mb-3 sm:mb-4" />
              <p className="font-bold text-lg sm:text-xl text-[#2b160b] uppercase tracking-widest text-center">Developing Film...</p>
            </div>
          )}

          {/* === EMPTY STATE === */}
          {!loading && filteredCapsules.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 sm:py-32 border-4 border-dashed border-[#4b260f] bg-[#fff3dc]/50 text-center mx-2 sm:mx-0 px-4">
              <Eye className="h-12 w-12 sm:h-16 sm:w-16 text-[#8b2e16] mb-4 sm:mb-6 opacity-50" />
              <h3 className="mapmoire-serif text-3xl sm:text-4xl font-black text-[#2b160b] mb-2">Blank Canvas.</h3>
              <p className="font-bold text-sm sm:text-base text-[#5a3218] uppercase tracking-widest">No memories documented yet.</p>
            </div>
          )}

          {/* === GRID OF HUT CAPSULES === */}
          {!loading && filteredCapsules.length > 0 && (
            <div className="grid items-start gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-12 md:grid-cols-2 xl:grid-cols-3 pt-4 sm:pt-6">
              {filteredCapsules.map((capsule, i) => (
                <HutCapsule
                  key={capsule.id}
                  capsule={capsule}
                  index={i}
                  total={filteredCapsules.length}
                  sharingId={sharingId}
                  onShare={createShareLink}
                />
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}