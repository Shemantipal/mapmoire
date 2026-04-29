"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";
import { Copy, Loader2, Share2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Place } from "./map-data";

import { CapsuleCard } from "./CapsuleCard";
import type { DbCapsule } from "./types";
import { CapsuleForm } from "./CapsuleForm";

type CapsuleFormSaveData = Parameters<
  NonNullable<ComponentProps<typeof CapsuleForm>["onSave"]>
>[0];

export function StoryCapsule({
  place,
  onCapsuleAdded,
}: {
  place: Place;
  onCapsuleAdded?: (cityName: string) => void;
}) {
  const [capsules, setCapsules] = useState<DbCapsule[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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

        setCapsules(res.ok ? await res.json() : []);
      } catch (err) {
        console.error("Failed to fetch capsules:", err);
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

  const handleSave = async ({
    caption,
    quote,
    images,
    selectedSong,
    mood,
    overhyped,
    hiddenGem,
  }: CapsuleFormSaveData): Promise<void> => {
    if (
      !caption.trim() &&
      !quote.trim() &&
      !selectedSong &&
      images.length === 0 &&
      !overhyped.trim() &&
      !hiddenGem.trim()
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
          images,

          mood: mood?.label || null,

          songTitle: selectedSong?.name || null,
artist: selectedSong?.artist || null,
spotifyUrl: null,
previewUrl: null,
albumArt: selectedSong?.image || null,

          overhyped,
          hiddenGem,
        }),
      });

      if (!res.ok) {
        alert("Save failed.");
        return;
      }

      const saved = await res.json();

      setCapsules((prev) => [saved, ...prev]);
      onCapsuleAdded?.(place.name);
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

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
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setSharing(false);
    }
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

    const audio = new Audio(capsule.previewUrl);
    audioRef.current = audio;

    audio.play();
    setPlayingId(capsule.id);

    audio.onended = () => {
      setPlayingId(null);
      audioRef.current = null;
    };
  };

  return (
    <div
      className="flex max-h-[520px] flex-col overflow-hidden rounded-2xl border border-amber-900/25 shadow-2xl"
      style={{
        background: "linear-gradient(160deg, #100d07 0%, #0e0b06 100%)",
      }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-amber-900/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />

          <span className="text-sm font-bold text-amber-100">
            {place.name}
          </span>

          <span className="rounded-full bg-amber-900/30 px-2 py-0.5 text-[10px] text-amber-500">
            {capsules.length} {capsules.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        <button
          type="button"
          onClick={createShareLink}
          disabled={sharing}
          title="Share this city's memories"
          className="flex items-center gap-1.5 rounded-full border border-amber-900/30 bg-amber-900/20 px-3 py-1.5 text-xs text-amber-400 transition hover:bg-amber-900/40 disabled:opacity-50"
        >
          {sharing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : copied ? (
            <Copy className="h-3 w-3 text-emerald-400" />
          ) : (
            <Share2 className="h-3 w-3" />
          )}

          <span>{copied ? "Copied!" : "Share"}</span>
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3 [scrollbar-width:thin] [scrollbar-color:#3d2a0a_transparent]">
        <CapsuleForm
          placeName={place.name}
          onSave={handleSave}
          saving={saving}
        />

        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-amber-700" />
          </div>
        )}

        {!loading && capsules.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 text-3xl">📖</div>

            <p className="text-sm font-semibold text-amber-200/50">
              No entries yet
            </p>

            <p className="mt-1 text-xs text-amber-900/60">
              Seal your first memory from {place.name}
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {capsules.map((capsule, i) => (
            <motion.div
              key={capsule.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <CapsuleCard
                capsule={capsule}
                index={i}
                total={capsules.length}
                playingId={playingId}
                onTogglePlay={togglePreview}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}