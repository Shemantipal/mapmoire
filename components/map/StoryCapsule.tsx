"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Camera,
  Copy,
  Disc3,
  ExternalLink,
  Loader2,
  Music,
  Pause,
  Play,
  Plus,
  Quote,
  Share2,
  Sparkles,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Place } from "./map-data";

type Track = {
  id: string;
  name: string;
  artist: string;
  image: string;
  spotifyUrl: string;
  previewUrl: string | null;
};

type DbCapsule = {
  id: string;
  placeName: string;
  state: string | null;
  lat: number | null;
  lng: number | null;
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
export function StoryCapsule({
  place,
  onCapsuleAdded,
}: {
  place: Place;
  onCapsuleAdded?: (cityName: string) => void;
}) {  const [capsules, setCapsules] = useState<DbCapsule[]>([]);
  const [caption, setCaption] = useState("");
  const [quote, setQuote] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [songQuery, setSongQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [selectedSong, setSelectedSong] = useState<Track | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchCapsules() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/capsules?placeName=${encodeURIComponent(place.name)}`
        );

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

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlayingId(null);
    };
  }, [place.name]);

  const createShareLink = async () => {
    try {
      setSharing(true);
      setCopied(false);

      const res = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "city",
          placeName: place.name,
        }),
      });

      if (!res.ok) {
        alert("Could not create share link.");
        return;
      }

      const data = await res.json();
      await navigator.clipboard.writeText(data.url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Share failed:", error);
      alert("Something went wrong while creating share link.");
    } finally {
      setSharing(false);
    }
  };

  const searchSongs = async (q: string) => {
    setSongQuery(q);

    if (!q.trim()) {
      setResults([]);
      return;
    }

    try {
      setSearching(true);

      const res = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(q)}`
      );

      if (!res.ok) {
        setResults([]);
        return;
      }

      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Spotify search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleImages = (files: FileList | null) => {
    if (!files) return;

    const selectedFiles = Array.from(files).slice(0, 4 - images.length);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        setImages((prev) => [...prev, reader.result as string].slice(0, 4));
      };

      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const togglePreview = (capsule: DbCapsule) => {
    if (!capsule.previewUrl) return;

    if (playingId === capsule.id) {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlayingId(null);
      return;
    }

    audioRef.current?.pause();

    const newAudio = new Audio(capsule.previewUrl);
    audioRef.current = newAudio;

    newAudio.play();
    setPlayingId(capsule.id);

    newAudio.onended = () => {
      setPlayingId(null);
      audioRef.current = null;
    };
  };

  const addCapsule = async () => {
    if (
      !caption.trim() &&
      !quote.trim() &&
      !selectedSong &&
      images.length === 0
    ) {
      return;
    }

    try {
      setSaving(true);

      const res = await fetch("/api/capsules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placeName: place.name,
          state: place.state,
          lat: place.coords[0],
          lng: place.coords[1],
          caption,
          quote,
          songTitle: selectedSong?.name || null,
          artist: selectedSong?.artist || null,
          spotifyUrl: selectedSong?.spotifyUrl || null,
          previewUrl: selectedSong?.previewUrl || null,
          albumArt: selectedSong?.image || null,
          images,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(err);
        alert("Save failed. Check terminal.");
        return;
      }

      const savedCapsule = await res.json();

      setCapsules((prev) => [savedCapsule, ...prev]);
      console.log("sending completed:", place.name);
onCapsuleAdded?.(place.name);
      setCaption("");
      setQuote("");
      setImages([]);
      setSongQuery("");
      setResults([]);
      setSelectedSong(null);
    } catch (error) {
      console.error("Failed to save capsule:", error);
      alert("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-h-[470px] overflow-y-auto border-white/10 bg-zinc-950/85 text-white shadow-2xl backdrop-blur-2xl">
      <CardHeader className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/95 px-4 py-3 backdrop-blur-xl">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-400" />
            Capsules
          </span>

          <div className="flex items-center gap-2">
            <Badge className="bg-pink-500/20 text-xs text-pink-200">
              {place.name}
            </Badge>

            <button
              type="button"
              onClick={createShareLink}
              disabled={sharing}
              title="Copy share link for this city"
              className="rounded-full bg-white/10 p-2 text-pink-200 transition hover:bg-pink-500/20 disabled:opacity-50"
            >
              {copied ? (
                <Copy className="h-3.5 w-3.5 text-green-300" />
              ) : sharing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Share2 className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </CardTitle>

        {copied && (
          <p className="mt-2 text-xs text-green-300">
            Share link copied for {place.name} ✨
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4 p-3">
        <div className="space-y-2 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-pink-500/5 to-sky-500/10 p-3 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-pink-200">
              Add Memory Quest
            </p>
            <span className="rounded-full bg-yellow-400/15 px-2 py-1 text-[10px] text-yellow-200">
              +25 XP
            </span>
          </div>

          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Tiny caption..."
            className="h-9 rounded-xl border-white/10 bg-black/30 text-sm text-white placeholder:text-zinc-500"
          />

          <Input
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Quote / feeling..."
            className="h-9 rounded-xl border-white/10 bg-black/30 text-sm text-white placeholder:text-zinc-500"
          />

          <div className="space-y-2">
            <div className="relative">
              <Music className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-green-400" />
              <Input
                value={songQuery}
                onChange={(e) => searchSongs(e.target.value)}
                placeholder="Search song..."
                className="h-9 rounded-xl border-white/10 bg-black/30 pl-9 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            {searching && (
              <p className="flex items-center gap-2 text-xs text-zinc-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                Searching...
              </p>
            )}

            {results.length > 0 && !selectedSong && (
              <div className="max-h-44 overflow-y-auto rounded-2xl border border-white/10 bg-black/40 p-1.5">
                {results.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      setSelectedSong(track);
                      setResults([]);
                      setSongQuery("");
                    }}
                    className="flex w-full items-center gap-2 rounded-xl p-2 text-left transition hover:bg-white/10"
                  >
                    {track.image && (
                      <Image
                        src={track.image}
                        width={38}
                        height={38}
                        alt={track.name}
                        className="rounded-lg"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {track.name}
                      </p>
                      <p className="truncate text-[11px] text-zinc-400">
                        {track.artist}
                      </p>
                    </div>

                    <Plus className="h-3.5 w-3.5 text-green-400" />
                  </button>
                ))}
              </div>
            )}

            {selectedSong && (
              <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-3">
                <div className="flex gap-3">
                  {selectedSong.image && (
                    <Image
                      src={selectedSong.image}
                      width={52}
                      height={52}
                      alt={selectedSong.name}
                      className="rounded-xl shadow-lg"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {selectedSong.name}
                    </p>
                    <p className="truncate text-xs text-zinc-300">
                      {selectedSong.artist}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <a
                        href={selectedSong.spotifyUrl}
                        target="_blank"
                        className="rounded-full bg-green-500 px-2.5 py-1 text-[11px] font-semibold text-white"
                      >
                        Spotify
                      </a>

                      <button
                        type="button"
                        onClick={() => setSelectedSong(null)}
                        className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-pink-200"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                {!selectedSong.previewUrl && (
                  <p className="mt-2 text-[11px] text-zinc-500">
                    Preview unavailable. Opens in Spotify.
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-pink-400/30 bg-pink-500/10 px-3 py-3 text-xs font-medium text-pink-200 transition hover:bg-pink-500/15">
              <Camera className="h-3.5 w-3.5" />
              Upload 4 pictures
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImages(e.target.files)}
              />
            </label>

            {images.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-14 overflow-hidden rounded-xl"
                  >
                    <Image
                      src={image}
                      alt="Uploaded memory"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-1 top-1 rounded-full bg-black/70 p-1"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={addCapsule}
            disabled={saving}
            className="h-10 w-full rounded-full bg-pink-500 text-sm font-semibold hover:bg-pink-600"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-3.5 w-3.5" />
                Add Capsule
              </>
            )}
          </Button>
        </div>

        {loading && (
          <p className="text-xs text-zinc-400">Loading memory collection...</p>
        )}

        {!loading && capsules.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-sm font-semibold text-zinc-200">
              No capsules yet
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Start building your {place.name} memory world.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {capsules.map((capsule, index) => (
            <div
              key={capsule.id}
              className="overflow-hidden rounded-[1.6rem] border border-pink-400/20 bg-gradient-to-br from-pink-500/15 via-fuchsia-500/10 to-sky-500/10 p-3 shadow-xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <Badge className="bg-yellow-400/15 text-[10px] text-yellow-200">
                  Memory #{capsules.length - index}
                </Badge>
                <span className="text-[10px] text-zinc-500">
                  {new Date(capsule.createdAt).toLocaleDateString()}
                </span>
              </div>

              {capsule.images?.length > 0 && (
                <div
                  className={`mb-3 grid gap-1.5 ${
                    capsule.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {capsule.images.slice(0, 4).map((image, imageIndex) => (
                    <div
                      key={imageIndex}
                      className={`relative overflow-hidden rounded-2xl ${
                        capsule.images.length === 1 ? "h-28" : "h-20"
                      }`}
                    >
                      <Image
                        src={image}
                        alt="Story capsule"
                        fill
                        className="object-cover transition duration-500 hover:scale-105"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}

              {capsule.caption && (
                <p className="text-sm font-medium leading-5 text-zinc-100">
                  {capsule.caption}
                </p>
              )}

              {capsule.quote && (
                <div className="mt-2 flex gap-2 rounded-2xl bg-black/25 p-3 text-xs italic text-pink-100">
                  <Quote className="h-3.5 w-3.5 shrink-0 text-pink-300" />
                  <span>{capsule.quote}</span>
                </div>
              )}

              {capsule.songTitle && (
                <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {capsule.albumArt && (
                        <Image
                          src={capsule.albumArt}
                          width={48}
                          height={48}
                          alt={capsule.songTitle}
                          className={`rounded-xl shadow-lg ${
                            playingId === capsule.id ? "animate-spin" : ""
                          }`}
                          style={{
                            animationDuration: "6s",
                          }}
                        />
                      )}

                      <div className="absolute -bottom-1.5 -right-1.5 rounded-full bg-green-500 p-1">
                        <Disc3 className="h-3 w-3 text-white" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {capsule.songTitle}
                      </p>
                      <p className="truncate text-xs text-zinc-400">
                        {capsule.artist}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {capsule.previewUrl ? (
                      <button
                        type="button"
                        onClick={() => togglePreview(capsule)}
                        className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-600"
                      >
                        {playingId === capsule.id ? (
                          <>
                            <Pause className="h-3.5 w-3.5" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" />
                            Play
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] text-zinc-400">
                        No preview
                      </span>
                    )}

                    {capsule.spotifyUrl && (
                      <a
                        href={capsule.spotifyUrl}
                        target="_blank"
                        className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/15"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Spotify
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}