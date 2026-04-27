"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Loader2,
  Music,
  Plus,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Track, MOOD_TAGS, type MoodTag } from "./types";

type Props = {
  placeName: string;
  onSave: (data: {
    caption: string;
    quote: string;
    images: string[];
    selectedSong: Track | null;
    mood: MoodTag | null;
    overhyped: string;
    hiddenGem: string;
  }) => Promise<void>;
  saving: boolean;
};

export function CapsuleForm({ placeName, onSave, saving }: Props) {
  const [open, setOpen] = useState(true);
  const [caption, setCaption] = useState("");
  const [quote, setQuote] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [songQuery, setSongQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [selectedSong, setSelectedSong] = useState<Track | null>(null);
  const [searching, setSearching] = useState(false);
  const [mood, setMood] = useState<MoodTag | null>(null);
  const [overhyped, setOverhyped] = useState("");
  const [hiddenGem, setHiddenGem] = useState("");

  const searchSongs = async (q: string) => {
    setSongQuery(q);
    if (!q.trim()) { setResults([]); return; }
    try {
      setSearching(true);
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(q)}`);
      setResults(res.ok ? await res.json() : []);
    } catch { setResults([]); }
    finally { setSearching(false); }
  };

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 4 - images.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () =>
        setImages((prev) => [...prev, reader.result as string].slice(0, 4));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    await onSave({ caption, quote, images, selectedSong, mood, overhyped, hiddenGem });
    setCaption("");
    setQuote("");
    setImages([]);
    setSongQuery("");
    setResults([]);
    setSelectedSong(null);
    setMood(null);
    setOverhyped("");
    setHiddenGem("");
  };

  const isEmpty =
    !caption.trim() && !quote.trim() && !selectedSong && images.length === 0;

  return (
    <div className="rounded-2xl border border-amber-900/30 bg-[#16120a] overflow-hidden">
      {/* Form header toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
            <Plus className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold text-amber-100">New Memory Entry</span>
          <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
            +25 XP
          </span>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 text-amber-700" />
          : <ChevronDown className="h-4 w-4 text-amber-700" />
        }
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-amber-900/20 px-4 pb-4 pt-3">

              {/* Caption */}
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={`What happened in ${placeName}?`}
                rows={2}
                className="w-full resize-none rounded-xl border border-amber-900/20 bg-black/30 px-3 py-2.5 text-sm text-amber-50 placeholder:text-amber-900/60 focus:border-amber-700/40 focus:outline-none focus:ring-0"
              />

              {/* Quote */}
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-lg leading-none text-amber-700/40">"</span>
                <input
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="A quote or feeling..."
                  className="w-full rounded-xl border border-amber-900/20 bg-black/30 py-2.5 pl-8 pr-3 text-sm italic text-amber-100 placeholder:text-amber-900/60 focus:border-amber-700/40 focus:outline-none"
                />
              </div>

              {/* Mood tags */}
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-amber-700/70">
                  Mood
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {MOOD_TAGS.map((tag) => (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => setMood(mood?.label === tag.label ? null : tag)}
                      className={`rounded-full border px-2.5 py-1 text-xs transition ${
                        mood?.label === tag.label
                          ? "border-amber-500/60 bg-amber-500/20 text-amber-200"
                          : "border-amber-900/20 bg-black/20 text-amber-700 hover:border-amber-700/30 hover:text-amber-400"
                      }`}
                    >
                      {tag.emoji} {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overhyped */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400/70">
                  🙄 Overhyped Activities / Places
                </p>
                <textarea
                  value={overhyped}
                  onChange={(e) => setOverhyped(e.target.value)}
                  placeholder={`What's not worth the hype in ${placeName}?`}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-red-900/20 bg-red-950/10 px-3 py-2.5 text-sm text-amber-50 placeholder:text-red-900/40 focus:border-red-800/40 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Hidden Gem */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/70">
                  ✨ Best Tip / Hidden Gem
                </p>
                <textarea
                  value={hiddenGem}
                  onChange={(e) => setHiddenGem(e.target.value)}
                  placeholder="Your secret find or must-know advice for future travellers…"
                  rows={2}
                  className="w-full resize-none rounded-xl border border-emerald-900/20 bg-emerald-950/10 px-3 py-2.5 text-sm text-amber-50 placeholder:text-emerald-900/40 focus:border-emerald-800/40 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Song search */}
              <div className="space-y-2">
                <div className="relative">
                  <Music className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-600" />
                  <input
                    value={songQuery}
                    onChange={(e) => searchSongs(e.target.value)}
                    placeholder="Search a song for this memory..."
                    className="w-full rounded-xl border border-amber-900/20 bg-black/30 py-2.5 pl-9 pr-3 text-sm text-amber-100 placeholder:text-amber-900/60 focus:border-amber-700/40 focus:outline-none"
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-amber-700" />
                  )}
                </div>

                <AnimatePresence>
                  {results.length > 0 && !selectedSong && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="max-h-40 overflow-y-auto rounded-xl border border-amber-900/20 bg-black/50"
                    >
                      {results.map((track) => (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => { setSelectedSong(track); setResults([]); setSongQuery(""); }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-amber-900/20"
                        >
                          {track.image && (
                            <Image src={track.image} width={34} height={34} alt={track.name} className="rounded-lg" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-amber-100">{track.name}</p>
                            <p className="truncate text-[11px] text-amber-700">{track.artist}</p>
                          </div>
                          <Plus className="h-3 w-3 text-emerald-500 shrink-0" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedSong && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-emerald-900/30 bg-emerald-950/30 px-3 py-2">
                    {selectedSong.image && (
                      <Image src={selectedSong.image} width={36} height={36} alt={selectedSong.name} className="rounded-lg" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-emerald-200">{selectedSong.name}</p>
                      <p className="truncate text-[11px] text-emerald-700">{selectedSong.artist}</p>
                    </div>
                    <button type="button" onClick={() => setSelectedSong(null)}
                      className="rounded-full bg-white/5 p-1 text-amber-700 hover:text-amber-400">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

        
              <div>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-amber-800/30 bg-amber-950/20 py-3 text-xs text-amber-700 transition hover:border-amber-700/50 hover:text-amber-500">
                  <Camera className="h-3.5 w-3.5" />
                  {images.length > 0 ? `${images.length}/4 photos added` : "Add up to 4 photos"}
                  <input type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => handleImages(e.target.files)} />
                </label>

                {images.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    {images.map((img, i) => (
                      <div key={i} className="relative h-14 overflow-hidden rounded-xl">
                        <Image src={img} alt="" fill className="object-cover" unoptimized />
                        <button type="button" onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                          className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5">
                          <X className="h-2.5 w-2.5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || isEmpty}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-amber-500 text-sm font-bold text-black transition hover:bg-amber-400 disabled:opacity-40"
              >
                {saving
                  ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...</>
                  : <><Plus className="h-3.5 w-3.5" /> Seal this Memory</>
                }
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}