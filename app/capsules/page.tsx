"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Anchor,
  BookOpen,
  Camera,
  Check,
  Compass,
  Copy,
  ExternalLink,
  Feather,
  Filter,
  Globe,
  Loader2,
  MapPin,
  Music,
  Search,
  Share2,
  Star,
  Wind,
  Sparkles,
  Heart,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

// Mood tag with hanging rope animation
function MoodTag({ mood }: { mood: string }) {
  const moodColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    alive: { bg: "#d4f5e2", border: "#2d9b5f", text: "#1a6b3f", glow: "rgba(45,155,95,0.3)" },
    peaceful: { bg: "#d6eaff", border: "#3a7bc8", text: "#1d4e89", glow: "rgba(58,123,200,0.3)" },
    nostalgic: { bg: "#fde8d4", border: "#c4763b", text: "#8b4513", glow: "rgba(196,118,59,0.3)" },
    adventurous: { bg: "#fff0cc", border: "#c4930f", text: "#7a5c00", glow: "rgba(196,147,15,0.3)" },
    melancholic: { bg: "#ece8f5", border: "#7c5cbf", text: "#4a3580", glow: "rgba(124,92,191,0.3)" },
  };

  const lowerMood = mood.toLowerCase();
  const colors = moodColors[lowerMood] || { bg: "#fff0e8", border: "#c23a16", text: "#8b2e16", glow: "rgba(194,58,22,0.3)" };

  return (
    <div className="flex justify-start" style={{ perspective: "400px" }}>
      <div
        className="relative inline-flex flex-col items-center"
        style={{ transformOrigin: "top center" }}
      >
        {/* Rope string */}
        <div
          className="w-px"
          style={{
            height: "12px",
            background: `linear-gradient(to bottom, ${colors.border}, ${colors.border}88)`,
            animation: "ropeSwing 3s ease-in-out infinite",
          }}
        />
        {/* The tag */}
        <div
          className="relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em]"
          style={{
            background: colors.bg,
            border: `1.5px solid ${colors.border}`,
            color: colors.text,
            boxShadow: `0 4px 12px ${colors.glow}, 0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)`,
            animation: "tagPendulum 3s ease-in-out infinite",
            transformOrigin: "top center",
          }}
        >
          <span>✦</span>
          <span>{mood}</span>
          {/* Hole at top */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full border"
            style={{ background: "#fff", borderColor: colors.border }}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div
     className="relative flex flex-col items-center justify-center gap-1 rounded-2xl p-3 text-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fff8ed 0%, #fdecc8 100%)",
        border: "1.5px solid rgba(123,75,36,0.3)",
        boxShadow: "0 4px 0 #c9a46c, 0 6px 20px rgba(43,22,11,0.12)",
      }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 0%, rgba(139,46,22,0.2), transparent 60%)",
        }}
      />
      <div
       className="relative flex h-8 w-8 items-center justify-center rounded-full"
        style={{
          background: "linear-gradient(135deg, #8b2e16, #c23a16)",
          boxShadow: "0 2px 8px rgba(139,46,22,0.4)",
        }}
      >
        <span className="text-[#fff3dc]">{icon}</span>
      </div>
      <p className="relative font-serif text-2xl font-black leading-none text-[#2b160b]">{value}</p>
      <p className="relative font-serif text-[8px] uppercase tracking-[0.3em] text-[#7b4b24]">{label}</p>
    </div>
  );
}

function WaxSeal({ num }: { num: number }) {
  return (
    <div
      className="flex h-11 w-11 items-center justify-center rounded-full"
      style={{
        background: "radial-gradient(circle at 35% 35%, #d94a22, #74210e)",
        border: "2px solid #5a1a0a",
        boxShadow: "0 3px 8px rgba(116,33,14,0.5), inset 0 1px 0 rgba(255,200,180,0.3)",
      }}
    >
      <span className="font-serif text-[9px] font-black text-[#fff3dc]">#{num}</span>
    </div>
  );
}

function PortStamp() {
  return (
    <div
      className="absolute bottom-3 right-3 z-20"
      style={{
        transform: "rotate(-8deg)",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
      }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background: "rgba(246,223,179,0.96)",
          border: "2px solid #5f1b08",
          boxShadow: "0 0 0 3px rgba(95,27,8,0.1)",
        }}
      >
        <div
          className="absolute inset-[5px] rounded-full border border-dashed"
          style={{ borderColor: "#8b2e16" }}
        />
        <div className="text-center text-[#651f0b]">
          <Anchor className="mx-auto h-3 w-3" />
          <p className="font-serif text-[5.5px] font-black tracking-[0.16em]">PORT</p>
          <p className="font-serif text-[8px] font-black leading-none tracking-[0.08em]">VISITED</p>
        </div>
      </div>
    </div>
  );
}

function CompassDecor({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className="opacity-20">
      <circle cx="30" cy="30" r="28" stroke="#5C3D1E" strokeWidth="0.6" fill="none" />
      <circle cx="30" cy="30" r="20" stroke="#5C3D1E" strokeWidth="0.6" fill="none" />
      <circle cx="30" cy="30" r="4" fill="#5C3D1E" />
      <polygon points="30,2 27,20 30,16 33,20" fill="#5C3D1E" />
      <polygon points="30,58 27,40 30,44 33,40" fill="#8B6B3D" />
      <polygon points="58,30 40,27 44,30 40,33" fill="#8B6B3D" />
      <polygon points="2,30 20,27 16,30 20,33" fill="#8B6B3D" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line
          key={i}
          x1="30" y1="30"
          x2={30 + 16 * Math.cos((deg * Math.PI) / 180)}
          y2={30 + 16 * Math.sin((deg * Math.PI) / 180)}
          stroke="#5C3D1E"
          strokeWidth="0.4"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}

function MemoryCard({
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
    <div
      className="group relative"
      style={{ animation: `cardReveal 0.5s ease-out ${index * 0.08}s both` }}
    >
      {/* Card shadow layer */}
      <div
        className="absolute inset-0 rounded-[1.8rem] translate-x-2 translate-y-2 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3"
        style={{ background: "#8b2e16", opacity: 0.35, borderRadius: "1.8rem" }}
      />

      <div
        className="relative overflow-hidden rounded-[1.8rem] text-[#2b160b] transition-transform duration-300 group-hover:-translate-y-0.5"
        style={{
          background: "linear-gradient(160deg, #fdf6e3 0%, #f0dbb8 60%, #e8d0a8 100%)",
          border: "2px solid rgba(99,55,24,0.6)",
        }}
      >
        {/* Paper texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Top left seal */}
        <div className="absolute left-3 top-3 z-30"><WaxSeal num={memNum} /></div>

        {/* Share button */}
        <button
          onClick={() => onShare({ type: "capsule", capsuleId: capsule.id, placeName: capsule.placeName })}
          className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
          style={{
            background: "rgba(255,243,220,0.95)",
            border: "1.5px solid rgba(111,63,29,0.5)",
            boxShadow: "0 2px 8px rgba(43,22,11,0.15)",
          }}
        >
          {sharingId === capsule.id ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#8b2e16]" />
          ) : (
            <Share2 className="h-4 w-4 text-[#4b260f]" />
          )}
        </button>

        {/* Images */}
        {capsule.images?.length > 0 ? (
          <div
            className={`grid gap-[2px] border-b-2 border-[#6f3f1d]/30 ${
              capsule.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {capsule.images.slice(0, 2).map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden ${capsule.images.length === 1 ? "h-52" : "h-48"}`}
              >
                <Image
                  src={img}
                  alt="Memory"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  style={{ filter: "sepia(0.12) contrast(1.05)" }}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/50 via-transparent to-transparent" />
                <PortStamp />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex h-44 items-center justify-center border-b-2 border-[#6f3f1d]/30"
            style={{ background: "linear-gradient(135deg, #ead7b5, #d4b890)" }}
          >
            <CompassDecor />
          </div>
        )}

        <div className="relative z-10 space-y-3.5 p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-1.5 font-serif text-2xl font-black leading-tight text-[#2b160b]">
                <MapPin className="h-4 w-4 shrink-0" style={{ color: "#c23a16" }} />
                {capsule.placeName}
              </h2>
              {capsule.state && (
                <p className="mt-0.5 font-serif text-[10px] uppercase tracking-[0.25em]" style={{ color: "#7b4b24" }}>
                  {capsule.state}
                </p>
              )}
            </div>
            <button
              onClick={() => onShare({ type: "city", placeName: capsule.placeName })}
              className="shrink-0 rounded-xl px-3 py-1.5 font-serif text-[9px] uppercase tracking-widest transition-colors hover:opacity-80"
              style={{
                background: "rgba(255,243,220,0.8)",
                border: "1px solid rgba(123,75,36,0.4)",
                color: "#4b260f",
              }}
            >
              Share
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1" style={{ background: "rgba(123,75,36,0.25)" }} />
            <Anchor className="h-3 w-3" style={{ color: "rgba(123,75,36,0.4)" }} />
            <div className="h-px flex-1" style={{ background: "rgba(123,75,36,0.25)" }} />
          </div>

          {/* Caption */}
          {capsule.caption && (
            <p className="font-serif text-[13px] leading-relaxed text-[#3b2414]">
              {capsule.caption}
            </p>
          )}

          {/* Quote */}
          {capsule.quote && (
            <div
              className="relative rounded-2xl px-4 py-3"
              style={{
                background: "linear-gradient(135deg, rgba(234,215,181,0.7), rgba(240,224,195,0.5))",
                borderLeft: "3px solid #9c2c0d",
                border: "1px solid rgba(156,44,13,0.2)",
                borderLeftWidth: "3px",
              }}
            >
              <Feather
                className="absolute right-3 top-3 h-3.5 w-3.5"
                style={{ color: "rgba(123,75,36,0.3)" }}
              />
              <p className="pr-6 font-serif text-xs italic leading-relaxed" style={{ color: "#5a3218" }}>
                &ldquo;{capsule.quote}&rdquo;
              </p>
            </div>
          )}

         
          {(capsule.mood || capsule.overhyped || capsule.hiddenGem) && (
            <div className="space-y-2.5">
             
              {capsule.mood && <MoodTag mood={capsule.mood} />}

              {capsule.overhyped && (
                <div
                  className="rounded-2xl px-3.5 py-2.5"
                  style={{
                    background: "linear-gradient(135deg, rgba(254,226,226,0.6), rgba(254,240,240,0.4))",
                    border: "1px solid rgba(185,28,28,0.2)",
                  }}
                >
                  <p
                    className="mb-1 font-serif text-[8px] font-black uppercase tracking-[0.2em]"
                    style={{ color: "rgba(153,27,27,0.7)" }}
                  >
                    🙄 Overhyped Spot
                  </p>
                  <p className="font-serif text-xs leading-relaxed" style={{ color: "#4b260f" }}>
                    {capsule.overhyped}
                  </p>
                </div>
              )}

              {capsule.hiddenGem && (
                <div
                  className="rounded-2xl px-3.5 py-2.5"
                  style={{
                    background: "linear-gradient(135deg, rgba(209,250,229,0.5), rgba(236,253,245,0.4))",
                    border: "1px solid rgba(6,95,70,0.2)",
                  }}
                >
                  <p
                    className="mb-1 font-serif text-[8px] font-black uppercase tracking-[0.2em]"
                    style={{ color: "rgba(6,78,59,0.7)" }}
                  >
                    ✨ Hidden Gem / Best Tip
                  </p>
                  <p className="font-serif text-xs leading-relaxed" style={{ color: "#4b260f" }}>
                    {capsule.hiddenGem}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Song */}
          {capsule.songTitle && (
            <div
              className="flex items-center gap-3 rounded-2xl p-2.5 transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, rgba(255,243,220,0.9), rgba(240,225,195,0.7))",
                border: "1px solid rgba(123,75,36,0.3)",
              }}
            >
              {capsule.albumArt ? (
                <Image
                  src={capsule.albumArt}
                  alt={capsule.songTitle}
                  width={44}
                  height={44}
                  className="rounded-xl"
                  style={{ filter: "sepia(0.2)", boxShadow: "0 2px 8px rgba(43,22,11,0.2)" }}
                />
              ) : (
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
                  style={{ background: "linear-gradient(135deg, #ead7b5, #d4b890)" }}
                >
                  <Music className="h-4 w-4" style={{ color: "#7b4b24" }} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-sm font-black text-[#2b160b]">{capsule.songTitle}</p>
                <p className="truncate font-serif text-[9px] uppercase tracking-widest" style={{ color: "#7b4b24" }}>
                  {capsule.artist}
                </p>
              </div>
              {capsule.spotifyUrl && (
                <a
                  href={capsule.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110"
                  style={{
                    background: "rgba(255,243,220,0.9)",
                    border: "1px solid rgba(123,75,36,0.35)",
                  }}
                >
                  <ExternalLink className="h-3.5 w-3.5" style={{ color: "#4b260f" }} />
                </a>
              )}
            </div>
          )}

          {/* Footer */}
          <div
            className="flex items-center justify-between border-t pt-3"
            style={{ borderColor: "rgba(123,75,36,0.2)" }}
          >
            <div
              className="flex items-center gap-1.5 rounded-xl px-2.5 py-1 font-serif text-[9px] uppercase tracking-widest"
              style={{
                background: "rgba(194,58,22,0.1)",
                border: "1px solid rgba(194,58,22,0.3)",
                color: "#8b2e16",
              }}
            >
              <Star className="h-3 w-3" />
              +25 XP
            </div>
            <time className="font-serif text-[10px] uppercase tracking-wider" style={{ color: "rgba(123,75,36,0.65)" }}>
              {new Date(capsule.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CapsulesPage() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [profileHover, setProfileHover] = useState(false);
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
  const progress = xp % 100;

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
        type === "all" ? "Chronicle copied!" : type === "city" ? `${placeName} copied!` : "Memory copied!"
      );
      setTimeout(() => setCopiedText(""), 2200);
    } finally {
      setSharingId(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

        :root {
          --parchment: #e6d0a7;
          --ink: #2b160b;
          --rust: #8b2e16;
          --gold: #c9a46c;
          --cream: #fff3dc;
        }

        * { font-family: 'Libre Baskerville', serif; }
        .font-serif { font-family: 'Playfair Display', serif; }

        @keyframes ropeSwing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }

        @keyframes tagPendulum {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes headerFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139,46,22,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(139,46,22,0); }
        }

        .profile-ring {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }

        .header-title {
          animation: headerFloat 4s ease-in-out infinite;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #2b160b 0%, #c23a16 40%, #8b2e16 60%, #2b160b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        .page-bg {
          background-color: #e6d0a7;
          background-image:
            radial-gradient(circle at 15% 10%, rgba(139,46,22,0.14), transparent 35%),
            radial-gradient(circle at 85% 80%, rgba(123,75,36,0.14), transparent 35%),
            linear-gradient(rgba(92,61,30,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(92,61,30,0.055) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 36px 36px, 36px 36px;
        }

     .main-card {
  background: linear-gradient(160deg, #fdf5e0 0%, #f2dcb4 55%, #ead4a8 100%);
  border: 2px solid rgba(79,42,18,0.65);
  box-shadow: 7px 7px 0 #8b2e16, 0 14px 36px rgba(43,22,11,0.16);
}

        .search-input {
          background: rgba(255,243,220,0.9);
          border: 1.5px solid rgba(123,75,36,0.4);
          color: #2b160b;
          border-radius: 1rem;
          font-family: 'Playfair Display', serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus {
          border-color: rgba(139,46,22,0.6);
          box-shadow: 0 0 0 3px rgba(139,46,22,0.1);
          outline: none;
        }
        .search-input::placeholder { color: rgba(123,75,36,0.45); }

        .publish-btn {
          background: linear-gradient(135deg, #8b2e16, #c23a16);
          border: none;
          color: #fff3dc;
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border-radius: 1rem;
          box-shadow: 0 4px 0 #5a1a0a, 0 6px 20px rgba(139,46,22,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .publish-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 0 #5a1a0a, 0 10px 25px rgba(139,46,22,0.4);
        }
        .publish-btn:active {
          transform: translateY(1px);
          box-shadow: 0 2px 0 #5a1a0a, 0 3px 10px rgba(139,46,22,0.3);
        }

        .city-chip {
          font-family: 'Playfair Display', serif;
          font-size: 11px;
          font-weight: 700;
          border-radius: 1rem;
          padding: 6px 14px;
          border: 1.5px solid rgba(123,75,36,0.4);
          background: rgba(255,243,220,0.85);
          color: #4b260f;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .city-chip:hover { background: rgba(234,215,181,0.9); transform: translateY(-1px); }
        .city-chip.active {
          background: linear-gradient(135deg, #8b2e16, #c23a16);
          color: #fff3dc;
          border-color: #5a1a0a;
          box-shadow: 0 3px 0 #5a1a0a;
        }

        .scrollbar-thin::-webkit-scrollbar { height: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(123,75,36,0.3); border-radius: 2px; }
      `}</style>

      <main className="relative min-h-screen page-bg text-[#2b160b]">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6">

          {/* === HERO HEADER CARD === */}
         <div className="main-card mb-6 overflow-hidden rounded-[1.7rem]">
            {/* Top banner */}
            <div
              className="border-b px-8 py-2.5 text-center"
              style={{
                background: "linear-gradient(90deg, #c4a26b, #d4b47d, #c4a26b)",
                borderColor: "rgba(123,75,36,0.3)",
              }}
            >
              <p className="font-serif text-[9px] uppercase tracking-[0.4em]" style={{ color: "#5a3218" }}>
                ✦ Order of Wanderers ✦ Mapmoire Travel Archive ✦
              </p>
            </div>

            <div className="p-4 md:p-5">
              {/* Main layout: Profile | Content | Stats */}
           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">

                {/* === PROFILE SECTION === */}
                <div className="flex flex-col items-center gap-3 lg:items-center lg:w-32 shrink-0">
                  {/* Big profile picture */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onMouseEnter={() => setProfileHover(true)}
                    onMouseLeave={() => setProfileHover(false)}
                    className="profile-ring relative overflow-hidden transition-transform duration-300 hover:scale-105"
                    style={{
                      width: 96,
height: 96,
borderRadius: "1.35rem",
                      border: "3px solid #5a3218",
                      background: "linear-gradient(135deg, #ead2a8, #d4b890)",
                      boxShadow: "6px 6px 0 #9b6d3d, 0 0 0 6px rgba(201,164,108,0.3)",
                    }}
                  >
                    {profileImage ? (
                      <Image src={profileImage} alt="Profile" fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#7b4b24]">
                        <Camera className="h-10 w-10" style={{ opacity: 0.6 }} />
                        <span className="font-serif text-[9px] uppercase tracking-widest text-center px-2" style={{ lineHeight: 1.4 }}>
                          Add Photo
                        </span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-1 transition-opacity duration-200"
                      style={{
                        background: "rgba(43,22,11,0.7)",
                        opacity: profileHover ? 1 : 0,
                      }}
                    >
                      <Camera className="h-7 w-7 text-[#fff3dc]" />
                      <span className="font-serif text-[9px] uppercase tracking-widest text-[#fff3dc]">Change</span>
                    </div>
                  </button>

                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleProfileChange} className="hidden" />

                  <div className="text-center">
                    <p className="font-serif text-xs font-black uppercase tracking-[0.25em]" style={{ color: "#2b160b" }}>
                      Travel Keeper
                    </p>
                    <p className="mt-0.5 font-serif text-[9px] uppercase tracking-[0.2em]" style={{ color: "#7b4b24" }}>
                      Explorer · Lv.{level}
                    </p>
                  </div>

                  {/* XP bar */}
                  <div className="w-full max-w-[148px]">
                    <div className="mb-1.5 flex justify-between">
                      <span className="font-serif text-[8px] uppercase tracking-widest" style={{ color: "#7b4b24" }}>XP</span>
                      <span className="font-serif text-[8px]" style={{ color: "rgba(123,75,36,0.7)" }}>{progress}/100</span>
                    </div>
                    <div
                      className="h-2.5 overflow-hidden rounded-full"
                      style={{ background: "#fff3dc", border: "1px solid rgba(123,75,36,0.3)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max(5, progress)}%`,
                          background: "linear-gradient(90deg, #8b2e16, #c23a16)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* === CENTER CONTENT === */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-px flex-1" style={{ background: "rgba(123,75,36,0.25)" }} />
                    <CompassDecor size={32} />
                    <div className="h-px flex-1" style={{ background: "rgba(123,75,36,0.25)" }} />
                  </div>

                 <h1 className="header-title font-serif text-4xl font-black leading-none md:text-5xl">
                    Story{" "}
                    <span className="shimmer-text">Capsules</span>
                  </h1>

                  <div className="my-4 flex items-center gap-2">
                    <div className="h-px flex-1" style={{ background: "rgba(123,75,36,0.2)" }} />
                    <Wind className="h-4 w-4" style={{ color: "rgba(123,75,36,0.5)" }} />
                    <div className="h-px flex-1" style={{ background: "rgba(123,75,36,0.2)" }} />
                  </div>

                 <p className="font-serif text-base italic leading-relaxed md:text-lg" style={{ color: "#5a3218", maxWidth: 620 }}>
                    A soft retro archive of places, songs, tiny quotes and travel memories
                    collected like postcards from your world.
                  </p>

             
                  <div className="mt-6 grid grid-cols-3 gap-3 lg:hidden">
                    <StatCard icon={<Star className="h-4 w-4" />} value={xp} label="Memory XP" />
                    <StatCard icon={<Globe className="h-4 w-4" />} value={uniqueCities.length} label="Ports" />
                    <StatCard icon={<BookOpen className="h-4 w-4" />} value={capsules.length} label="Entries" />
                  </div>
                </div>

                
             <div className="hidden lg:grid lg:grid-cols-3 lg:gap-3 lg:w-[330px] shrink-0">
                  <StatCard icon={<Star className="h-4 w-4" />} value={xp} label="Memory XP" />
                  <StatCard icon={<Globe className="h-4 w-4" />} value={uniqueCities.length} label="Ports" />
                  <StatCard icon={<BookOpen className="h-4 w-4" />} value={capsules.length} label="Entries" />
                </div>
              </div>

              {/* Search + Publish bar */}
              <div
                className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center"
                style={{ borderColor: "rgba(123,75,36,0.2)" }}
              >
                <div className="relative flex-1 sm:max-w-sm">
                  <Search
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: "rgba(123,75,36,0.55)" }}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search memory..."
                    className="search-input h-11 w-full pl-10 pr-4 text-sm"
                  />
                </div>

                <button
                  onClick={() => createShareLink({ type: "all" })}
                  className="publish-btn flex h-11 items-center justify-center gap-2 px-7 text-xs"
                >
                  {sharingId === "all" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : copiedText ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  {copiedText || "Publish"}
                </button>
              </div>

              {copiedText && (
                <p
                  className="mt-2 flex items-center gap-1.5 font-serif text-xs italic"
                  style={{ color: "#8b2e16" }}
                >
                  <Copy className="h-3 w-3" /> {copiedText}
                </p>
              )}
            </div>
          </div>

          {/* === CITY FILTER CHIPS === */}
          {!loading && uniqueCities.length > 0 && (
            <div className="mb-6 flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
              <Filter className="h-4 w-4 shrink-0" style={{ color: "rgba(123,75,36,0.6)" }} />
              <button
                onClick={() => setActiveCity(null)}
                className={`city-chip ${activeCity === null ? "active" : ""}`}
              >
                All ({capsules.length})
              </button>
              {uniqueCities.map((city) => {
                const count = capsules.filter((c) => c.placeName === city).length;
                return (
                  <button
                    key={city}
                    onClick={() => setActiveCity(activeCity === city ? null : city)}
                    className={`city-chip ${activeCity === city ? "active" : ""}`}
                  >
                    ⚓ {city} {count}
                  </button>
                );
              })}
            </div>
          )}

          {/* === LOADING === */}
          {loading && (
            <div
              className="flex flex-col items-center justify-center rounded-[2rem] py-24"
              style={{
                background: "linear-gradient(135deg, #f2dfbd, #ead2a8)",
                border: "1.5px solid rgba(123,75,36,0.35)",
              }}
            >
              <CompassDecor size={60} />
              <Loader2 className="mt-5 h-6 w-6 animate-spin" style={{ color: "#7b4b24" }} />
              <p className="mt-3 font-serif text-sm italic" style={{ color: "#7b4b24" }}>
                Loading memories...
              </p>
            </div>
          )}

          {/* === EMPTY === */}
          {!loading && filteredCapsules.length === 0 && (
            <div
              className="flex flex-col items-center justify-center rounded-[2rem] py-24 text-center"
              style={{
                background: "linear-gradient(135deg, #f2dfbd, #ead2a8)",
                border: "1.5px solid rgba(123,75,36,0.35)",
              }}
            >
              <CompassDecor size={80} />
              <p className="mt-6 font-serif text-xl font-black text-[#2b160b]">No memories found</p>
            </div>
          )}

          {/* === ENTRIES COUNT === */}
          {!loading && filteredCapsules.length > 0 && (
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "rgba(123,75,36,0.3)" }} />
              <p className="font-serif text-[9px] uppercase tracking-[0.35em]" style={{ color: "#7b4b24" }}>
                {filteredCapsules.length} entries logged
              </p>
              <div className="h-px flex-1" style={{ background: "rgba(123,75,36,0.3)" }} />
            </div>
          )}

          {/* === CARDS GRID === */}
          {!loading && filteredCapsules.length > 0 && (
            <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCapsules.map((capsule, i) => (
                <MemoryCard
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