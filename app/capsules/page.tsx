"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Copy,
  ExternalLink,
  Loader2,
  MapPin,
  Music,
  Quote,
  Search,
  Share2,
  Sparkles,
  Trophy,
  Wand2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Capsule = {
  id: string;
  placeName: string;
  state: string | null;
  caption: string | null;
  quote: string | null;

  songTitle: string | null;
  artist: string | null;
  spotifyUrl: string | null;
  previewUrl: string | null;
  albumArt: string | null;

  images: string[];
  createdAt: string;
};

export default function CapsulesPage() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState("");

  useEffect(() => {
    async function fetchCapsules() {
      try {
        const res = await fetch("/api/capsules");

        if (!res.ok) {
          setCapsules([]);
          return;
        }

        const data = await res.json();
        setCapsules(data);
      } catch (error) {
        console.error("Failed to fetch capsules:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCapsules();
  }, []);

  const filteredCapsules = capsules.filter((capsule) => {
    const text = `${capsule.placeName} ${capsule.state} ${capsule.caption} ${capsule.quote} ${capsule.songTitle} ${capsule.artist}`;
    return text.toLowerCase().includes(search.toLowerCase());
  });

  const uniqueCities = useMemo(() => {
    return Array.from(new Set(capsules.map((item) => item.placeName)));
  }, [capsules]);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          placeName,
          capsuleId,
        }),
      });

      if (!res.ok) {
        alert("Could not create share link.");
        return;
      }

      const data = await res.json();
      await navigator.clipboard.writeText(data.url);

      setCopiedText(
        type === "all"
          ? "Whole memory world link copied ✨"
          : type === "city"
            ? `${placeName} memory link copied ✨`
            : "Memory card link copied ✨"
      );

      setTimeout(() => setCopiedText(""), 2000);
    } catch (error) {
      console.error("Share failed:", error);
      alert("Something went wrong while sharing.");
    } finally {
      setSharingId(null);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#4c0519,#020617_45%,#020617)] px-5 py-10 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge className="mb-4 bg-pink-500/20 text-pink-200">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Memory World
              </Badge>

              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Story Capsules
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-300">
                Your gamified travel archive — every city, photo, quote, song,
                and memory collected like treasures from another world.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-4">
                <Trophy className="mb-2 h-5 w-5 text-yellow-300" />
                <p className="text-2xl font-black">{xp}</p>
                <p className="text-xs text-yellow-100/70">Memory XP</p>
              </div>

              <div className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-4">
                <Wand2 className="mb-2 h-5 w-5 text-sky-300" />
                <p className="text-2xl font-black">Lv. {level}</p>
                <p className="text-xs text-sky-100/70">Explorer Level</p>
              </div>

              <div className="rounded-3xl border border-pink-400/20 bg-pink-400/10 p-4">
                <MapPin className="mb-2 h-5 w-5 text-pink-300" />
                <p className="text-2xl font-black">{uniqueCities.length}</p>
                <p className="text-xs text-pink-100/70">Cities Collected</p>
              </div>
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city, quote, song..."
                className="h-12 rounded-full border-white/10 bg-black/30 pl-11 text-white placeholder:text-zinc-500"
              />
            </div>

            <Button
              onClick={() => createShareLink({ type: "all" })}
              className="rounded-full bg-pink-500 px-5 hover:bg-pink-600"
            >
              {sharingId === "all" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="mr-2 h-4 w-4" />
              )}
              Share Whole World
            </Button>
          </div>

          {copiedText && (
            <p className="mt-4 rounded-full bg-green-500/15 px-4 py-2 text-sm text-green-200">
              {copiedText}
            </p>
          )}
        </div>

        {!loading && uniqueCities.length > 0 && (
          <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
            {uniqueCities.map((city) => (
              <button
                key={city}
                onClick={() => setSearch(city)}
                className="shrink-0 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:bg-pink-500/20"
              >
                🏙️ {city}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-pink-300" />
            <p className="text-sm text-zinc-400">Loading your memory world...</p>
          </div>
        )}

        {!loading && filteredCapsules.length === 0 && (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-xl font-bold">No capsules found yet.</p>
            <p className="mt-2 text-sm text-zinc-400">
              Go back to the map and collect your first memory treasure.
            </p>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCapsules.map((capsule, index) => (
            <Card
              key={capsule.id}
              className="group overflow-hidden rounded-[2rem] border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-pink-400/40 hover:bg-pink-500/10"
            >
              <div className="relative">
                {capsule.images?.length > 0 ? (
                  <div
                    className={`grid gap-1 p-2 ${
                      capsule.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {capsule.images.slice(0, 4).map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className={`relative overflow-hidden rounded-3xl ${
                          capsule.images.length === 1
                            ? "h-56"
                            : imgIndex === 0
                              ? "h-44"
                              : "h-44"
                        }`}
                      >
                        <Image
                          src={image}
                          alt="Story capsule"
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="m-2 flex h-40 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500/20 to-sky-500/20">
                    <Sparkles className="h-8 w-8 text-pink-300" />
                  </div>
                )}

                <div className="absolute left-5 top-5 rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur-xl">
                  Memory #{filteredCapsules.length - index}
                </div>

                <button
                  onClick={() =>
                    createShareLink({
                      type: "capsule",
                      capsuleId: capsule.id,
                      placeName: capsule.placeName,
                    })
                  }
                  className="absolute right-5 top-5 rounded-full bg-black/60 p-2 text-pink-200 backdrop-blur-xl hover:bg-pink-500/40"
                >
                  {sharingId === capsule.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                </button>
              </div>

              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="flex items-center gap-2 text-xl font-black">
                      <MapPin className="h-5 w-5 text-pink-400" />
                      {capsule.placeName}
                    </h2>
                    {capsule.state && (
                      <p className="mt-1 text-sm text-zinc-500">
                        {capsule.state}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      createShareLink({
                        type: "city",
                        placeName: capsule.placeName,
                      })
                    }
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-pink-200 hover:bg-pink-500/20"
                  >
                    Share City
                  </button>
                </div>

                {capsule.caption && (
                  <p className="text-sm leading-6 text-zinc-200">
                    {capsule.caption}
                  </p>
                )}

                {capsule.quote && (
                  <div className="flex gap-3 rounded-3xl bg-black/30 p-4 text-sm italic text-pink-100">
                    <Quote className="h-4 w-4 shrink-0 text-pink-300" />
                    <span>{capsule.quote}</span>
                  </div>
                )}

                {capsule.songTitle && (
                  <div className="rounded-3xl border border-green-400/20 bg-green-500/10 p-3">
                    <div className="flex items-center gap-3">
                      {capsule.albumArt && (
                        <Image
                          src={capsule.albumArt}
                          alt={capsule.songTitle}
                          width={46}
                          height={46}
                          className="rounded-2xl"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          <Music className="mr-1 inline h-4 w-4 text-green-400" />
                          {capsule.songTitle}
                        </p>
                        <p className="truncate text-xs text-zinc-400">
                          {capsule.artist}
                        </p>
                      </div>

                      {capsule.spotifyUrl && (
                        <a
                          href={capsule.spotifyUrl}
                          target="_blank"
                          className="rounded-full bg-green-500 p-2 text-white"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <Badge className="bg-yellow-400/15 text-yellow-200">
                    +25 XP
                  </Badge>

                  <p className="text-xs text-zinc-500">
                    {new Date(capsule.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}