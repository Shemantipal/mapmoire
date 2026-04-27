"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Anchor,
  BookOpen,
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

function StatCartouche({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <Card className="rounded-xl border-[#7b4b24]/40 bg-[#ead7b5] shadow-sm">
      <CardContent className="flex items-center gap-2 p-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#7b4b24]/50 bg-[#f7ead0] text-[#5a3218]">
          {icon}
        </div>
        <div>
          <p className="font-serif text-lg font-black leading-none text-[#2b160b]">
            {value}
          </p>
          <p className="mt-0.5 font-serif text-[9px] uppercase tracking-widest text-[#7b4b24]">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function WaxSeal({ num }: { num: number }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#74210e] bg-[#c23a16] shadow-md">
      <span className="font-serif text-[10px] font-black text-[#fff3dc]">
        #{num}
      </span>
    </div>
  );
}

function PortVisitedStamp() {
  return (
    <div className="absolute right-3 bottom-3 z-20 rotate-[-8deg]">
      <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full border-[2px] border-[#5f1b08] bg-[#f6dfb3]/90 shadow-[0_0_0_3px_rgba(95,27,8,.12)]">
        <div className="absolute inset-[5px] rounded-full border border-dashed border-[#8b2e16]" />
        <div className="text-center text-[#651f0b]">
          <Anchor className="mx-auto h-2.5 w-2.5" />
          <p className="font-serif text-[6px] font-black tracking-[0.16em]">
            PORT
          </p>
          <p className="font-serif text-[8px] font-black leading-none tracking-[0.08em]">
            VISITED
          </p>
        </div>
      </div>
    </div>
  );
}

function CompassRose({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className="opacity-25">
      <circle cx="30" cy="30" r="28" stroke="#5C3D1E" strokeWidth="0.5" />
      <circle cx="30" cy="30" r="20" stroke="#5C3D1E" strokeWidth="0.5" />
      <circle cx="30" cy="30" r="4" fill="#5C3D1E" />
      <polygon points="30,2 27,20 30,16 33,20" fill="#5C3D1E" />
      <polygon points="30,58 27,40 30,44 33,40" fill="#8B6B3D" />
      <polygon points="58,30 40,27 44,30 40,33" fill="#8B6B3D" />
      <polygon points="2,30 20,27 16,30 20,33" fill="#8B6B3D" />
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
  onShare: (args: {
    type: "city" | "capsule";
    placeName?: string;
    capsuleId?: string;
  }) => void;
}) {
  const memNum = total - index;

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-2 border-[#6f3f1d]/60 bg-[#f2dfbd] text-[#2b160b] shadow-[0_8px_24px_rgba(82,48,20,0.16)] transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(82,48,20,0.24)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,#fff7df_0%,transparent_42%)] opacity-70" />

      <div className="absolute left-3 top-3 z-30">
        <WaxSeal num={memNum} />
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          onShare({
            type: "capsule",
            capsuleId: capsule.id,
            placeName: capsule.placeName,
          })
        }
        className="absolute right-3 top-3 z-30 h-8 w-8 rounded-full border-[#6f3f1d]/60 bg-[#fff3dc]/90 text-[#4b260f] hover:bg-[#ead7b5]"
      >
        {sharingId === capsule.id ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Share2 className="h-3.5 w-3.5" />
        )}
      </Button>

      {capsule.images?.length > 0 ? (
        <div
          className={`grid gap-[2px] border-b-2 border-[#6f3f1d]/40 ${
            capsule.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {capsule.images.slice(0, 2).map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden ${
               capsule.images.length === 1 ? "h-28" : "h-24"
              }`}
            >
              <Image
                src={img}
                alt="Memory"
                fill
                className="object-cover sepia-[0.18] transition duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/35 via-transparent to-transparent" />
              <PortVisitedStamp />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center border-b-2 border-[#6f3f1d]/40 bg-[#ead7b5]">
          <CompassRose />
        </div>
      )}

<CardContent className="relative z-10 space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
           <h2 className="line-clamp-1 flex items-center gap-1.5 font-serif text-base font-black text-[#2b160b]">
              <MapPin className="h-4 w-4 text-[#c23a16]" />
              {capsule.placeName}
            </h2>

            {capsule.state && (
              <p className="mt-0.5 font-serif text-[10px] uppercase tracking-[0.18em] text-[#7b4b24]">
                {capsule.state}
              </p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onShare({ type: "city", placeName: capsule.placeName })
            }
            className="h-8 rounded-lg border-[#7b4b24]/50 bg-[#fff3dc]/70 px-3 font-serif text-[9px] uppercase tracking-widest text-[#4b260f] hover:bg-[#ead7b5]"
          >
            Share
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-[#7b4b24]/30" />
          <Anchor className="h-3 w-3 text-[#7b4b24]/50" />
          <div className="h-px flex-1 bg-[#7b4b24]/30" />
        </div>

  

        {capsule.caption && (
          <p className="line-clamp-2 font-serif text-sm leading-relaxed text-[#3b2414]">
            {capsule.caption}
          </p>
        )}

        {capsule.quote && (
          <div className="relative rounded-xl border-l-4 border-[#9c2c0d] bg-[#ead7b5]/80 px-2.5 py-1.5">
            <Feather className="absolute right-2 top-2 h-3.5 w-3.5 text-[#7b4b24]/35" />
            <p className="line-clamp-2 font-serif text-xs italic text-[#5a3218]">
              &ldquo;{capsule.quote}&rdquo;
            </p>
          </div>
        )}

       {(capsule.mood || capsule.overhyped || capsule.hiddenGem) && (
  <div className="rounded-xl border border-[#6f3f1d]/30 bg-[#fff3dc]/55 p-2">
    <div className="grid gap-2 sm:grid-cols-2">
      {capsule.mood && (
        <div className="flex items-center rounded-lg border border-[#8b2e16]/25 bg-[#8b2e16]/10 px-2.5 py-2">
          <p className="line-clamp-1 font-serif text-[10px] font-black uppercase tracking-widest text-[#8b2e16]">
            ✦ {capsule.mood}
          </p>
        </div>
      )}

      {capsule.overhyped && (
        <div className="rounded-lg border border-red-900/20 bg-red-950/5 px-2.5 py-2">
          <p className="font-serif text-[7px] font-black uppercase tracking-[0.16em] text-red-800/70">
            🙄 Overhyped
          </p>
          <p className="mt-0.5 line-clamp-1 font-serif text-[10px] text-[#4b260f]">
            {capsule.overhyped}
          </p>
        </div>
      )}

      {capsule.hiddenGem && (
        <div className="rounded-lg border border-emerald-900/20 bg-emerald-950/5 px-2.5 py-2 sm:col-span-2">
          <p className="font-serif text-[7px] font-black uppercase tracking-[0.16em] text-emerald-800/70">
            ✨ Hidden Gem
          </p>
          <p className="mt-0.5 line-clamp-1 font-serif text-[10px] text-[#4b260f]">
            {capsule.hiddenGem}
          </p>
        </div>
      )}
    </div>
  </div>
)}

        {capsule.songTitle && (
          <div className="flex items-center gap-3 rounded-xl border border-[#7b4b24]/35 bg-[#fff3dc]/70 p-2">
            {capsule.albumArt ? (
              <Image
                src={capsule.albumArt}
                alt={capsule.songTitle}
                width={34}
                height={34}
                className="rounded-lg sepia-[0.25]"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ead7b5]">
                <Music className="h-4 w-4 text-[#7b4b24]" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-xs font-black text-[#2b160b]">
                {capsule.songTitle}
              </p>
              <p className="truncate font-serif text-[9px] uppercase tracking-widest text-[#7b4b24]">
                {capsule.artist}
              </p>
            </div>

            {capsule.spotifyUrl && (
              <Button
                asChild
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-full border-[#7b4b24]/40 bg-[#f8ead0] text-[#4b260f]"
              >
                <a
                  href={capsule.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#7b4b24]/25 pt-3">
          <Badge className="rounded-lg border border-[#c23a16]/40 bg-[#c23a16]/10 font-serif text-[9px] uppercase tracking-widest text-[#8b2e16]">
            +25 XP
          </Badge>

          <time className="font-serif text-[10px] uppercase tracking-wider text-[#7b4b24]/70">
            {new Date(capsule.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
        </div>
      </CardContent>
    </Card>
  );
}

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

      if (!res.ok) return alert("Could not create share link.");

      const data = await res.json();
      await navigator.clipboard.writeText(data.url);

      setCopiedText(
        type === "all"
          ? "Chronicle copied!"
          : type === "city"
          ? `${placeName} copied!`
          : "Memory copied!"
      );

      setTimeout(() => setCopiedText(""), 2200);
    } finally {
      setSharingId(null);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#e8d7b7] text-[#2b160b]">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(rgba(92,61,30,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(92,61,30,0.055) 1px, transparent 1px), radial-gradient(circle at 20% 10%, rgba(139,46,22,0.12), transparent 35%), radial-gradient(circle at 90% 80%, rgba(123,75,36,0.14), transparent 35%)",
          backgroundSize: "42px 42px, 42px 42px, 100% 100%, 100% 100%",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-8">
<Card className="mb-5 overflow-hidden rounded-[1.25rem] border-[2px] border-[#4f2a12] bg-[#f3dfb9] text-[#2b160b] shadow-[5px_5px_0_#8b2e16]">
          <div className="border-b border-[#7b4b24]/30 bg-[#d9bd8d] px-8 py-2 text-center">
            <p className="font-serif text-[9px] uppercase tracking-[.35em] text-[#5a3218]">
              ✦ Order of Wanderers ✦ Mapmoire Travel Archive ✦
            </p>
          </div>

         <CardContent className="p-4 md:p-5">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
          <div className="mb-2 flex max-w-md items-center gap-3">
  <div className="h-px flex-1 bg-[#7b4b24]/35" />
  <CompassRose size={30} />
  <div className="h-px flex-1 bg-[#7b4b24]/35" />
</div>

                <h1 className="font-serif text-3xl font-black leading-none text-[#2b160b] md:text-4xl">
                  Story{" "}
                  <span className="text-[#8b2e16]">Capsules</span>
                </h1>

                <div className="my-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-[#7b4b24]/30" />
                  <Wind className="h-3.5 w-3.5 text-[#7b4b24]/60" />
                  <div className="h-px flex-1 bg-[#7b4b24]/30" />
                </div>

                <p className="font-serif text-sm italic leading-relaxed text-[#5a3218]">
                  A cute retro collection of ports, songs, quotes and memories
                  from your travel world.
                </p>

                <div className="mt-5 max-w-sm">
                  <div className="mb-1 flex justify-between">
                    <span className="font-serif text-[10px] uppercase tracking-widest text-[#7b4b24]">
                      Explorer · Level {level}
                    </span>
                    <span className="font-serif text-[10px] text-[#7b4b24]/70">
                      {progress} / 100 XP
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full border border-[#7b4b24]/35 bg-[#f8ead0]">
                    <div
                      className="h-full rounded-full bg-[#8b2e16]"
                      style={{ width: `${Math.max(4, progress)}%` }}
                    />
                  </div>
                </div>
              </div>

<div className="grid grid-cols-3 gap-2">
                <StatCartouche
                  icon={<Star className="h-3.5 w-3.5" />}
                  value={xp}
                  label="Memory XP"
                />
                <StatCartouche
                  icon={<Globe className="h-3.5 w-3.5" />}
                  value={uniqueCities.length}
                  label="Ports"
                />
                <StatCartouche
                  icon={<BookOpen className="h-3.5 w-3.5" />}
                  value={capsules.length}
                  label="Entries"
                />
              </div>
            </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-[#7b4b24]/25 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7b4b24]/60" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search memory..."
                  className="h-10 rounded-xl border-[#7b4b24]/40 bg-[#fff3dc] pl-10 font-serif text-[#2b160b] placeholder:text-[#7b4b24]/50"
                />
              </div>

              <Button
                onClick={() => createShareLink({ type: "all" })}
                className="rounded-xl bg-[#8b2e16] font-serif uppercase tracking-widest text-[#fff3dc] hover:bg-[#c23a16]"
              >
                {sharingId === "all" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : copiedText ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Share2 className="mr-2 h-4 w-4" />
                )}
                {copiedText || "Publish"}
              </Button>
            </div>

            {copiedText && (
              <p className="mt-2 flex items-center gap-2 font-serif text-xs italic text-[#8b2e16]">
                <Copy className="h-3 w-3" /> {copiedText}
              </p>
            )}
          </CardContent>
        </Card>

        {!loading && uniqueCities.length > 0 && (
          <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 shrink-0 text-[#7b4b24]/70" />

            <Button
              variant="outline"
              onClick={() => setActiveCity(null)}
              className={`rounded-xl border-[#7b4b24]/45 bg-[#fff3dc] font-serif text-xs text-[#4b260f] ${
                activeCity === null ? "bg-[#8b2e16] text-[#fff3dc]" : ""
              }`}
            >
              All ({capsules.length})
            </Button>

            {uniqueCities.map((city) => {
              const count = capsules.filter((c) => c.placeName === city).length;

              return (
                <Button
                  key={city}
                  variant="outline"
                  onClick={() => setActiveCity(activeCity === city ? null : city)}
                  className={`rounded-xl border-[#7b4b24]/45 bg-[#fff3dc] font-serif text-xs text-[#4b260f] ${
                    activeCity === city ? "bg-[#8b2e16] text-[#fff3dc]" : ""
                  }`}
                >
                  ⚓ {city} {count}
                </Button>
              );
            })}
          </div>
        )}

        {loading && (
          <Card className="border-[#7b4b24]/40 bg-[#f2dfbd]">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <CompassRose size={56} />
              <Loader2 className="mt-4 h-5 w-5 animate-spin text-[#7b4b24]" />
              <p className="mt-3 font-serif text-sm italic text-[#7b4b24]">
                Loading memories...
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && filteredCapsules.length === 0 && (
          <Card className="rounded-2xl border-[#7b4b24]/40 bg-[#f2dfbd]">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <CompassRose size={72} />
              <p className="mt-6 font-serif text-xl font-black text-[#2b160b]">
                No memories found
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && filteredCapsules.length > 0 && (
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#7b4b24]/35" />
            <p className="font-serif text-[10px] uppercase tracking-[.3em] text-[#7b4b24]">
              {filteredCapsules.length} entries logged
            </p>
            <div className="h-px flex-1 bg-[#7b4b24]/35" />
          </div>
        )}

        {!loading && filteredCapsules.length > 0 && (
        <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  );
}