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
  X,
  ChevronLeft,
  ChevronRight,
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

    .retro-input::placeholder {
      color: #8b6b5d;
      font-style: italic;
    }

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

    .vintage-photo {
      filter: sepia(0.5) contrast(1.1) brightness(0.9) grayscale(0.2);
    }

    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }

    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    @media (max-width: 640px) {
      .ticket-chip {
        padding: 7px 12px;
        border-width: 2px;
        box-shadow: 3px 3px 0 #4b260f;
      }

      .mobile-compact-card {
        max-width: 335px;
        margin-left: auto;
        margin-right: auto;
      }
    }
  `}</style>
);

function WaxSeal({ num }: { num: number }) {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#4b260f] bg-[#8b2e16] shadow-[2px_2px_0_#4b260f] sm:h-12 sm:w-12">
      <div className="absolute inset-1 rounded-full border border-dashed border-[#fff3dc]/50" />
      <span className="mapmoire-serif text-[10px] font-black text-[#fff3dc] sm:text-sm">
        No.{num}
      </span>
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
  onImageClick,
}: {
  capsule: Capsule;
  index: number;
  total: number;
  sharingId: string | null;
  onShare: (args: {
    type: "city" | "capsule";
    placeName?: string;
    capsuleId?: string;
  }) => void;
  onImageClick: (images: string[], index: number) => void;
}) {
  const memNum = total - index;

  return (
    <div className="group relative mt-8 transition-transform sm:mt-16 sm:hover:-translate-y-1 mobile-compact-card">
      {/* Hard Shadow Underlay */}
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 sm:translate-x-3 sm:translate-y-3">
        <div
          className="absolute bottom-[calc(100%-2px)] h-[38px] w-full bg-[#4b260f] sm:h-[70px]"
          style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
        />
        <div className="h-full w-full bg-[#4b260f]" />
      </div>

      {/* Hut Roof */}
      <div
        className="relative z-10 flex h-[38px] w-full items-end justify-center bg-[#4b260f] pb-1 sm:h-[70px]"
        style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
      >
        <div
          className="absolute bottom-0 h-[calc(100%-3px)] w-[calc(100%-6px)] bg-[#8b2e16] sm:h-[calc(100%-4px)] sm:w-[calc(100%-8px)]"
          style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
        />
        <div className="absolute -bottom-2 z-20 sm:-bottom-3">
          <WaxSeal num={memNum} />
        </div>
      </div>

      {/* Hut Body */}
      <div className="relative z-10 w-full border-[2.5px] border-t-0 border-[#4b260f] bg-[#ead8b8] p-3 pb-4 sm:border-4 sm:p-5 sm:pb-6">
        {/* Header Strip */}
        <div className="mb-3 flex items-start justify-between gap-2 pt-1.5 sm:mb-4 sm:pt-2">
          <div className="min-w-0">
            <h2 className="mapmoire-serif truncate text-xl font-black uppercase leading-none tracking-tighter text-[#2b160b] sm:text-3xl">
              {capsule.placeName}
            </h2>

            {capsule.state && (
              <p className="mt-1 truncate text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b2e16] sm:text-xs sm:tracking-[0.2em]">
                {capsule.state}
              </p>
            )}
          </div>

          <button
            onClick={() =>
              onShare({
                type: "capsule",
                capsuleId: capsule.id,
                placeName: capsule.placeName,
              })
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-[#4b260f] bg-[#fff3dc] text-[#4b260f] shadow-[2px_2px_0_#4b260f] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:h-10 sm:w-10 sm:border-3"
          >
            {sharingId === capsule.id ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#8b2e16] sm:h-5 sm:w-5" />
            ) : (
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>

        {/* Windows Images */}
        {capsule.images?.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-1.5 sm:mb-6 sm:gap-3">
            {capsule.images.slice(0, 4).map((img, i) => (
              <div
                key={i}
                onClick={() => onImageClick(capsule.images, i)}
                className="cursor-pointer border-2 border-[#4b260f] bg-[#fff3dc] p-1 pb-3 shadow-[2px_2px_0_rgba(75,38,15,0.2)] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_rgba(75,38,15,0.4)] sm:p-2 sm:pb-6"
              >
                <div className="relative aspect-square w-full overflow-hidden border border-[#4b260f] bg-[#2b160b]">
                  <Image
                    src={img}
                    alt={`Memory ${i + 1}`}
                    fill
                    className="vintage-photo object-cover transition-transform duration-500 hover:scale-105"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Story Section */}
        <div className="space-y-3 sm:space-y-4">
          {capsule.caption && (
            <div className="border-l-[3px] border-[#8b2e16] pl-3 sm:border-l-4 sm:pl-4">
              <p className="text-[11px] font-bold leading-relaxed text-[#4b260f] sm:text-sm">
                {capsule.caption}
              </p>
            </div>
          )}

          {capsule.quote && (
            <div className="relative border-2 border-[#4b260f] bg-[#fff3dc] p-2.5 sm:border-3 sm:p-4">
              <Quote className="absolute -left-2 -top-3 h-4 w-4 fill-[#8b2e16] text-[#8b2e16] sm:h-6 sm:w-6" />
              <p className="mapmoire-serif text-center text-sm italic text-[#2b160b] sm:text-lg">
                "{capsule.quote}"
              </p>
            </div>
          )}

          {(capsule.mood || capsule.overhyped || capsule.hiddenGem) && (
            <div className="space-y-2 border-y-[2.5px] border-double border-[#4b260f] py-2 sm:space-y-3 sm:border-y-4">
              {capsule.mood && (
                <div>
                  <span className="dymo-tape bg-[#8b2e16] text-[9px] sm:text-xs">
                    MOOD: {capsule.mood}
                  </span>
                </div>
              )}

              {capsule.hiddenGem && (
                <div>
                  <span className="dymo-tape bg-[#2b160b] text-[9px] sm:text-xs">
                    GEM
                  </span>
                  <p className="mt-1 text-[9px] font-bold leading-snug text-[#4b260f] sm:text-xs">
                    - {capsule.hiddenGem}
                  </p>
                </div>
              )}

              {capsule.overhyped && (
                <div>
                  <span className="dymo-tape bg-[#5a3218] text-[9px] sm:text-xs">
                    SKIP
                  </span>
                  <p className="mt-1 text-[9px] font-bold leading-snug text-[#4b260f] sm:text-xs">
                    - {capsule.overhyped}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Music Player */}
          {capsule.songTitle && (
            <div className="flex items-center gap-2 border-2 border-[#4b260f] bg-[#fff3dc] p-2 shadow-[3px_3px_0_#4b260f] sm:gap-4 sm:border-3 sm:p-3 sm:shadow-[4px_4px_0_#4b260f]">
              <div className="flex h-9 w-9 shrink-0 animate-[spin-slow_4s_linear_infinite] items-center justify-center rounded-full border-2 border-[#fff3dc] bg-[#2b160b] sm:h-12 sm:w-12">
                <Disc className="h-4 w-4 text-[#ead8b8] sm:h-6 sm:w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold uppercase text-[#2b160b] sm:text-sm">
                  {capsule.songTitle}
                </p>
                <p className="truncate text-[9px] font-bold text-[#8b2e16] sm:text-xs">
                  {capsule.artist}
                </p>
              </div>

              {capsule.spotifyUrl && (
                <a
                  href={capsule.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-[#4b260f] bg-[#8b2e16] text-[#fff3dc] shadow-[2px_2px_0_#4b260f] transition-transform sm:h-10 sm:w-10 sm:border-3 sm:hover:-translate-y-1"
                >
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
              )}
            </div>
          )}

          {/* Footer Ledger */}
          <div className="mt-1 flex items-center justify-between border-t-2 border-dashed border-[#4b260f] pt-3 sm:mt-2 sm:pt-4">
            <div className="flex items-center gap-1.5 border-2 border-[#4b260f] bg-[#fff3dc] px-2 py-1 shadow-[2px_2px_0_#4b260f] sm:gap-2 sm:border-3">
              <Star className="h-3 w-3 fill-[#2b160b] text-[#2b160b] sm:h-4 sm:w-4" />
              <span className="text-[9px] font-bold uppercase tracking-widest sm:text-xs">
                +25 XP
              </span>
            </div>

            <p className="font-mono text-[9px] font-bold uppercase text-[#8b2e16] sm:text-xs">
              {new Date(capsule.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
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

  const [lightboxData, setLightboxData] = useState<{
    images: string[];
    currentIndex: number;
  } | null>(null);

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

  const uniqueCities = useMemo(
    () => Array.from(new Set(capsules.map((c) => c.placeName))),
    [capsules]
  );

  const filteredCapsules = capsules.filter((c) => {
    const cityMatch = activeCity ? c.placeName === activeCity : true;
    const text = `${c.placeName} ${c.state} ${c.caption} ${c.quote} ${c.songTitle} ${c.artist} ${c.mood} ${c.overhyped} ${c.hiddenGem}`;
    return cityMatch && text.toLowerCase().includes(search.toLowerCase());
  });

  const xp = capsules.length * 25;
  const level = Math.max(1, Math.floor(xp / 100) + 1);

  const travelPatternQuote = useMemo(() => {
    if (uniqueCities.length === 0) return "A blank map awaits its first ink.";
    if (uniqueCities.length === 1)
      return `A focused expedition deep into the heart of ${uniqueCities[0]}.`;
    if (uniqueCities.length === 2)
      return `Tracing the invisible lines connecting ${uniqueCities[0]} and ${uniqueCities[1]}.`;
    if (uniqueCities.length === 3)
      return `A wandering spirit, leaving footprints across ${uniqueCities[0]}, ${uniqueCities[1]}, and the corners of ${uniqueCities[2]}.`;

    const last = uniqueCities[uniqueCities.length - 1];
    const firstFew = uniqueCities.slice(0, 2).join(", ");
    return `A relentless voyager navigating from ${firstFew}, all the way to ${last}, and everywhere in between.`;
  }, [uniqueCities]);

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
        type === "all"
          ? "ARCHIVE COPIED"
          : type === "city"
            ? `${placeName} COPIED`
            : "MEMORY COPIED"
      );

      setTimeout(() => setCopiedText(""), 2200);
    } finally {
      setSharingId(null);
    }
  };

  const openLightbox = (images: string[], index: number) => {
    setLightboxData({ images, currentIndex: index });
  };

  const closeLightbox = () => {
    setLightboxData(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (lightboxData) {
      setLightboxData({
        ...lightboxData,
        currentIndex:
          (lightboxData.currentIndex + 1) % lightboxData.images.length,
      });
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (lightboxData) {
      setLightboxData({
        ...lightboxData,
        currentIndex:
          (lightboxData.currentIndex - 1 + lightboxData.images.length) %
          lightboxData.images.length,
      });
    }
  };

  return (
    <>
      <VintageStyles />

      <main className="mapmoire-page relative min-h-screen">
        <div className="film-grain" />

        <div className="relative z-10 mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-12">
          {/* Header */}
          <div className="relative mb-8 overflow-hidden border-[3px] border-[#4b260f] bg-[#fff3dc] p-4 shadow-[5px_5px_0_#4b260f] sm:mb-12 sm:border-4 sm:p-8 sm:shadow-[8px_8px_0_#4b260f]">
            <div className="relative z-10 mb-7 flex flex-col items-start justify-between gap-3 border-b-[3px] border-double border-[#4b260f] pb-4 sm:mb-10 sm:flex-row sm:items-end sm:gap-4 sm:border-b-4 sm:pb-6">
              <div>
                <h1 className="mapmoire-serif text-4xl font-black uppercase leading-none tracking-tighter text-[#2b160b] sm:text-5xl md:text-7xl">
                  The Archive.
                </h1>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b2e16] sm:mt-2 sm:text-base sm:tracking-[0.3em]">
                  Mapmoire Field Ledger
                </p>
              </div>

              <div className="bg-[#1a0b05] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#fff3dc] shadow-[4px_4px_0_#8b2e16] sm:px-5 sm:py-2.5 sm:text-base">
                Vol. 01 // Active
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-stretch gap-7 lg:flex-row lg:gap-10">
              {/* Profile Photo */}
              <div className="relative z-20 flex shrink-0 flex-col items-center justify-center">
                <div className="w-[165px] -rotate-2 transform border-[3px] border-[#1a0b05] bg-[#fff3dc] p-2.5 pb-7 shadow-[6px_6px_0_#1a0b05] transition-all duration-300 hover:rotate-0 hover:scale-105 sm:w-[220px] sm:border-4 sm:p-4 sm:pb-12 sm:shadow-[8px_8px_0_#1a0b05] md:w-[260px]">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden border-[3px] border-[#1a0b05] bg-[#ead8b8]"
                  >
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Profile"
                        fill
                        className="vintage-photo object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="text-center text-[#1a0b05]">
                        <Camera className="mx-auto mb-2 h-8 w-8 sm:h-10 sm:w-10" />
                        <p className="text-[10px] font-black uppercase tracking-widest sm:text-xs">
                          Attach
                          <br />
                          Photo
                        </p>
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-[#1a0b05]/80 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="border-2 border-[#fff3dc] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#fff3dc] sm:text-sm">
                        Update
                      </span>
                    </div>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileChange}
                    className="hidden"
                  />

                  <p className="mt-3 text-center font-mono text-[10px] font-black uppercase tracking-widest text-[#1a0b05] sm:mt-5 sm:text-xs">
                    ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Right Content */}
              <div className="flex w-full flex-1 flex-col justify-between gap-6 sm:gap-8">
                <div className="relative flex flex-1 flex-col justify-center border-[3px] border-dashed border-[#4b260f] bg-[#ead8b8] p-4 sm:p-6">
                  <Quote className="absolute -left-3 -top-4 h-6 w-6 fill-[#8b2e16] bg-[#fff3dc] p-1 text-[#8b2e16] sm:h-8 sm:w-8" />
                  <p className="mapmoire-serif text-center text-lg font-medium italic leading-snug text-[#1a0b05] sm:text-2xl md:text-3xl">
                    "{travelPatternQuote}"
                  </p>
                </div>

                <div className="flex flex-col items-stretch gap-5 xl:flex-row xl:gap-6">
                  <div className="grid flex-1 grid-cols-2 border-[3px] border-[#1a0b05] bg-[#ead8b8] shadow-[4px_4px_0_#1a0b05] sm:border-4 md:grid-cols-4">
                    <div className="border-b-[2px] border-r-[2px] border-dashed border-[#1a0b05] p-3 sm:p-4 md:border-b-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b2e16] sm:text-xs">
                        Rank
                      </p>
                      <p className="text-xl font-black uppercase text-[#1a0b05] sm:text-2xl">
                        Lv.{level}
                      </p>
                    </div>

                    <div className="border-b-[2px] border-dashed border-[#1a0b05] p-3 sm:p-4 md:border-b-0 md:border-r-[2px]">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b2e16] sm:text-xs">
                        XP
                      </p>
                      <p className="text-xl font-black text-[#1a0b05] sm:text-2xl">
                        {xp}
                      </p>
                    </div>

                    <div className="border-r-[2px] border-dashed border-[#1a0b05] p-3 sm:p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b2e16] sm:text-xs">
                        Ports
                      </p>
                      <p className="text-xl font-black text-[#1a0b05] sm:text-2xl">
                        {uniqueCities.length}
                      </p>
                    </div>

                    <div className="p-3 sm:p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b2e16] sm:text-xs">
                        Entries
                      </p>
                      <p className="text-xl font-black text-[#1a0b05] sm:text-2xl">
                        {capsules.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:gap-4">
                    <div className="relative flex-1 sm:w-[240px]">
                      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1a0b05]" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Retrieve..."
                        className="retro-input h-full min-h-[52px] w-full border-[#1a0b05] pl-12 pr-4 text-sm shadow-[4px_4px_0_#1a0b05] sm:min-h-[56px] sm:text-base"
                      />
                    </div>

                    <button
                      onClick={() => createShareLink({ type: "all" })}
                      className="retro-btn flex min-h-[52px] items-center justify-center gap-2 border-[#1a0b05] px-6 text-sm shadow-[4px_4px_0_#1a0b05] sm:min-h-[56px] sm:px-8 sm:text-base"
                    >
                      {sharingId === "all" ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Share2 className="h-5 w-5" />
                      )}
                      {copiedText || "Publish"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          {!loading && uniqueCities.length > 0 && (
            <div className="mb-7 flex items-center gap-3 overflow-x-auto pb-2 sm:mb-12 sm:gap-4 sm:pb-4 hide-scrollbar">
              <div className="shrink-0 border-2 border-[#2b160b] bg-[#2b160b] p-2.5 text-[#fff3dc] sm:p-3">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>

              <button
                onClick={() => setActiveCity(null)}
                className={`ticket-chip text-[11px] sm:text-sm ${
                  activeCity === null ? "active" : ""
                }`}
              >
                All Regions [{capsules.length}]
              </button>

              {uniqueCities.map((city) => {
                const count = capsules.filter((c) => c.placeName === city).length;

                return (
                  <button
                    key={city}
                    onClick={() => setActiveCity(activeCity === city ? null : city)}
                    className={`ticket-chip text-[11px] sm:text-sm ${
                      activeCity === city ? "active" : ""
                    }`}
                  >
                    ★ {city} [{count}]
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="mx-1 flex flex-col items-center justify-center border-4 border-dashed border-[#4b260f] bg-[#fff3dc]/50 py-24 sm:mx-0 sm:py-32">
              <Film className="mb-3 h-10 w-10 animate-pulse text-[#8b2e16] sm:mb-4 sm:h-12 sm:w-12" />
              <p className="text-center text-lg font-bold uppercase tracking-widest text-[#2b160b] sm:text-xl">
                Developing Film...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredCapsules.length === 0 && (
            <div className="mx-1 flex flex-col items-center justify-center border-4 border-dashed border-[#4b260f] bg-[#fff3dc]/50 px-4 py-24 text-center sm:mx-0 sm:py-32">
              <Eye className="mb-4 h-12 w-12 text-[#8b2e16] opacity-50 sm:mb-6 sm:h-16 sm:w-16" />
              <h3 className="mapmoire-serif mb-2 text-3xl font-black text-[#2b160b] sm:text-4xl">
                Blank Canvas.
              </h3>
              <p className="text-sm font-bold uppercase tracking-widest text-[#5a3218] sm:text-base">
                No memories documented yet.
              </p>
            </div>
          )}

          {/* Capsule Grid */}
          {!loading && filteredCapsules.length > 0 && (
            <div className="grid items-start gap-y-8 pt-2 sm:gap-x-8 sm:gap-y-12 sm:pt-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCapsules.map((capsule, i) => (
                <HutCapsule
                  key={capsule.id}
                  capsule={capsule}
                  index={i}
                  total={filteredCapsules.length}
                  sharingId={sharingId}
                  onShare={createShareLink}
                  onImageClick={openLightbox}
                />
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {lightboxData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2b160b]/80 p-4 backdrop-blur-sm sm:p-8">
            <div className="absolute inset-0" onClick={closeLightbox} />

            <div className="relative z-10 w-full max-w-4xl border-4 border-[#4b260f] bg-[#fff3dc] p-3 pb-14 shadow-[10px_10px_0_rgba(26,13,6,0.5)] sm:p-6 sm:pb-24 sm:shadow-[16px_16px_0_rgba(26,13,6,0.5)]">
              <button
                className="absolute -right-3 -top-3 z-20 flex h-10 w-10 items-center justify-center border-4 border-[#4b260f] bg-[#8b2e16] text-[#fff3dc] shadow-[4px_4px_0_#4b260f] transition-transform hover:scale-105 sm:-right-6 sm:-top-6 sm:h-12 sm:w-12"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>

              <div className="relative aspect-square w-full border-4 border-[#4b260f] bg-[#2b160b] md:aspect-video">
                <Image
                  src={lightboxData.images[lightboxData.currentIndex]}
                  alt="Full Size Memory"
                  fill
                  className="vintage-photo object-contain"
                  unoptimized
                />
              </div>

              {lightboxData.images.length > 1 && (
                <div className="pointer-events-none absolute left-0 right-0 top-1/2 flex -translate-y-1/2 justify-between px-2 sm:-mx-8">
                  <button
                    className="pointer-events-auto flex h-11 w-11 items-center justify-center border-4 border-[#4b260f] bg-[#fff3dc] text-[#4b260f] shadow-[4px_4px_0_#4b260f] transition-colors hover:bg-[#ead8b8] active:translate-y-1 active:shadow-none sm:h-16 sm:w-16"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-7 w-7 sm:h-10 sm:w-10" />
                  </button>

                  <button
                    className="pointer-events-auto flex h-11 w-11 items-center justify-center border-4 border-[#4b260f] bg-[#fff3dc] text-[#4b260f] shadow-[4px_4px_0_#4b260f] transition-colors hover:bg-[#ead8b8] active:translate-y-1 active:shadow-none sm:h-16 sm:w-16"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-7 w-7 sm:h-10 sm:w-10" />
                  </button>
                </div>
              )}

              <div className="absolute bottom-4 right-5 font-mono text-sm font-bold tracking-widest text-[#8b6b5d] opacity-80 sm:bottom-6 sm:right-8 sm:text-lg">
                {lightboxData.currentIndex + 1} / {lightboxData.images.length}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}