"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Loader2,
  MapPin,
  Music,
  Search,
  Share2,
  Copy,
  Check,
  Sparkles,
  Globe,
  Zap,
  Star,
  BookOpen,
  Filter,
} from "lucide-react";

type Capsule = {
  id: string;
  placeName: string;
  state: string | null;
  caption: string | null;
  quote: string | null;
  mood: string | null;
  songTitle: string | null;
  artist: string | null;
  spotifyUrl: string | null;
  previewUrl: string | null;
  albumArt: string | null;
  images: string[];
  createdAt: string;
};

/* ─── Stat Card ─────────────────────────────────────────────── */
function StatPill({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${color}`}>
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-lg font-black leading-none text-white">{value}</p>
        <p className="mt-0.5 text-[11px] font-medium opacity-60">{label}</p>
      </div>
    </div>
  );
}

/* ─── Memory Card ────────────────────────────────────────────── */
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
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/6 bg-[#0d1117] transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/20 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">

      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      {/* Images */}
      {capsule.images?.length > 0 ? (
        <div className={`grid gap-0.5 ${capsule.images.length === 1 ? "grid-cols-1" : capsule.images.length === 2 ? "grid-cols-2" : "grid-cols-2"}`}>
          {capsule.images.slice(0, 4).map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden ${
                capsule.images.length === 1 ? "h-52" :
                capsule.images.length === 2 ? "h-40" :
                i === 0 && capsule.images.length === 3 ? "col-span-2 h-36" : "h-28"
              }`}
            >
              <Image
                src={img}
                alt="Memory"
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/80 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center bg-gradient-to-br from-amber-950/30 to-slate-900/50">
          <Sparkles className="h-7 w-7 text-amber-700/40" />
        </div>
      )}

      {/* Overlay badges on image */}
      <div className="absolute left-3 top-4 flex items-center gap-2">
        <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-bold tracking-widest text-amber-400 backdrop-blur-sm">
          #{memNum}
        </span>
        {capsule.mood && (
          <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] text-white backdrop-blur-sm">
            {capsule.mood}
          </span>
        )}
      </div>

      {/* Share capsule button */}
      <button
        onClick={() => onShare({ type: "capsule", capsuleId: capsule.id, placeName: capsule.placeName })}
        className="absolute right-3 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-sm transition hover:bg-amber-500/30"
      >
        {sharingId === capsule.id
          ? <Loader2 className="h-3 w-3 animate-spin" />
          : <Share2 className="h-3 w-3" />
        }
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Location row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-1.5 text-base font-black text-white">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              {capsule.placeName}
            </h2>
            {capsule.state && (
              <p className="mt-0.5 text-[11px] text-slate-500">{capsule.state}</p>
            )}
          </div>
          <button
            onClick={() => onShare({ type: "city", placeName: capsule.placeName })}
            className="shrink-0 rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400 transition hover:border-amber-500/30 hover:text-amber-400"
          >
            Share City
          </button>
        </div>

        {/* Caption */}
        {capsule.caption && (
          <p className="text-sm leading-relaxed text-slate-300">{capsule.caption}</p>
        )}

        {/* Quote */}
        {capsule.quote && (
          <div className="relative rounded-2xl bg-slate-900/60 px-4 py-3">
            <span className="absolute left-2.5 top-1.5 text-2xl leading-none text-amber-700/30 select-none">"</span>
            <p className="pl-3 text-xs italic leading-relaxed text-amber-200/60">{capsule.quote}</p>
          </div>
        )}

        {/* Song */}
        {capsule.songTitle && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-900/30 bg-emerald-950/20 px-3 py-2.5">
            {capsule.albumArt && (
              <Image
                src={capsule.albumArt}
                alt={capsule.songTitle}
                width={38}
                height={38}
                className="rounded-xl shadow-lg"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-emerald-200">
                <Music className="mr-1 inline h-3 w-3 text-emerald-500" />
                {capsule.songTitle}
              </p>
              <p className="truncate text-[11px] text-emerald-700">{capsule.artist}</p>
            </div>
            {capsule.spotifyUrl && (
              <a
                href={capsule.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/80 text-white transition hover:bg-emerald-400"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
          <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-500">
            ⚡ +25 XP
          </span>
          <time className="text-[10px] text-slate-600">
            {new Date(capsule.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </time>
        </div>
      </div>
    </article>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function CapsulesPage() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState("");

  useEffect(() => {
    async function fetchCapsules() {
      try {
        const res = await fetch("/api/capsules");
        setCapsules(res.ok ? await res.json() : []);
      } catch (err) {
        console.error("Failed to fetch capsules:", err);
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
    const text = `${c.placeName} ${c.state} ${c.caption} ${c.quote} ${c.songTitle} ${c.artist} ${c.mood}`;
    const searchMatch = text.toLowerCase().includes(search.toLowerCase());
    return cityMatch && searchMatch;
  });

  const xp = capsules.length * 25;
  const level = Math.max(1, Math.floor(xp / 100) + 1);
  const progress = xp % 100;

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
      if (!res.ok) { alert("Could not create share link."); return; }
      const data = await res.json();
      await navigator.clipboard.writeText(data.url);
      setCopiedText(
        type === "all" ? "World link copied!" :
        type === "city" ? `${placeName} link copied!` :
        "Memory link copied!"
      );
      setTimeout(() => setCopiedText(""), 2200);
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setSharingId(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm   { font-family: 'DM Sans', sans-serif; }

        /* subtle topo grid watermark */
        .topo-bg {
          background-color: #080b10;
          background-image:
            linear-gradient(rgba(251,191,36,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251,191,36,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes shimmer {
          0%  { background-position: 200% center }
          100%{ background-position: -200% center }
        }
        .xp-bar {
          background: linear-gradient(90deg, #f59e0b, #fcd34d, #f59e0b);
          background-size: 200% 100%;
          animation: shimmer 2.5s linear infinite;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
      `}</style>

      <main className="topo-bg font-dm min-h-screen text-white">
        <div className="mx-auto max-w-7xl px-5 py-10">

          {/* ── HERO HEADER ── */}
          <div className="mb-8 overflow-hidden rounded-3xl border border-white/6 bg-[#0d1117] shadow-2xl">
            {/* amber top strip */}
            <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                {/* Left */}
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-px w-6 bg-amber-500/50" />
                    <span className="text-[11px] font-medium uppercase tracking-[.2em] text-amber-500/70">
                      Memory World
                    </span>
                  </div>
                  <h1 className="font-syne text-5xl font-extrabold leading-[.95] tracking-tight text-white md:text-6xl">
                    Story<br />
                    <span className="text-amber-400">Capsules</span>
                  </h1>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                    Your gamified travel archive — every city, photo, quote, song, and memory collected like treasures from another world.
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-2 lg:flex-col">
                  <StatPill
                    icon={<Zap className="h-4 w-4 text-amber-400" />}
                    value={xp}
                    label="Memory XP"
                    color="border-amber-900/30 bg-amber-950/30"
                  />
                  <StatPill
                    icon={<Star className="h-4 w-4 text-sky-400" />}
                    value={`Lv. ${level}`}
                    label="Explorer Level"
                    color="border-sky-900/30 bg-sky-950/30"
                  />
                  <StatPill
                    icon={<Globe className="h-4 w-4 text-emerald-400" />}
                    value={uniqueCities.length}
                    label="Cities Collected"
                    color="border-emerald-900/30 bg-emerald-950/30"
                  />
                  <StatPill
                    icon={<BookOpen className="h-4 w-4 text-pink-400" />}
                    value={capsules.length}
                    label="Total Entries"
                    color="border-pink-900/30 bg-pink-950/30"
                  />
                </div>
              </div>

              {/* XP bar */}
              <div className="mt-6">
                <div className="mb-1.5 flex justify-between text-[10px] text-slate-600">
                  <span>Level {level}</span>
                  <span>{progress} / 100 XP to next level</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="xp-bar h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(4, progress)}%` }}
                  />
                </div>
              </div>

              {/* Controls row */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search city, quote, song, mood..."
                    className="h-10 w-full rounded-full border border-white/8 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-amber-700/40 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => createShareLink({ type: "all" })}
                  className="flex h-10 items-center gap-2 rounded-full bg-amber-500 px-5 text-sm font-bold text-black transition hover:bg-amber-400"
                >
                  {sharingId === "all"
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : copiedText
                    ? <Check className="h-3.5 w-3.5" />
                    : <Share2 className="h-3.5 w-3.5" />
                  }
                  {copiedText || "Share World"}
                </button>
              </div>

              {/* Copied toast */}
              {copiedText && (
                <p className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                  <Copy className="h-3 w-3" /> {copiedText}
                </p>
              )}
            </div>
          </div>

          {/* ── CITY FILTER TABS ── */}
          {!loading && uniqueCities.length > 0 && (
            <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              <Filter className="h-3.5 w-3.5 shrink-0 text-slate-600" />
              <button
                onClick={() => setActiveCity(null)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  activeCity === null
                    ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                    : "border-white/8 bg-white/5 text-slate-400 hover:border-white/15 hover:text-white"
                }`}
              >
                All ({capsules.length})
              </button>
              {uniqueCities.map((city) => {
                const count = capsules.filter((c) => c.placeName === city).length;
                return (
                  <button
                    key={city}
                    onClick={() => setActiveCity(activeCity === city ? null : city)}
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                      activeCity === city
                        ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                        : "border-white/8 bg-white/5 text-slate-400 hover:border-white/15 hover:text-white"
                    }`}
                  >
                    📍 {city} <span className="ml-1 opacity-50">{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── STATES ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="mb-3 h-6 w-6 animate-spin text-amber-500" />
              <p className="text-sm text-slate-500">Loading your memory world...</p>
            </div>
          )}

          {!loading && filteredCapsules.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-white/6 bg-[#0d1117] py-20 text-center">
              <div className="mb-4 text-4xl">🗺️</div>
              <p className="font-syne text-xl font-bold text-white">No capsules found</p>
              <p className="mt-2 text-sm text-slate-500">
                {search ? "Try a different search term" : "Go back to the map and collect your first memory."}
              </p>
            </div>
          )}

          {/* ── CARD GRID ── */}
          {!loading && filteredCapsules.length > 0 && (
            <div className="card-grid">
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