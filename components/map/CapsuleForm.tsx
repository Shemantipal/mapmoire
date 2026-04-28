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
  Sparkles,
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

/* Shared input style factory */
const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,248,238,0.8)",
  border: "1.5px solid rgba(176,120,64,0.3)",
  borderRadius: 12,
  color: "#2b160b",
  fontFamily: "'Lato', sans-serif",
  fontSize: 13,
  fontWeight: 400,
  outline: "none",
  transition: "border-color 0.18s",
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
    setCaption(""); setQuote(""); setImages([]);
    setSongQuery(""); setResults([]); setSelectedSong(null);
    setMood(null); setOverhyped(""); setHiddenGem("");
  };

  const isEmpty = !caption.trim() && !quote.trim() && !selectedSong && images.length === 0;

  return (
    <div
      className="rounded-2xl border border-[#c9a060]/50 overflow-hidden"
      style={{ background: "rgba(253,246,232,0.98)", fontFamily: "'Lato', sans-serif" }}
    >
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-[#f0ddb8]/40"
        style={{ borderBottom: open ? "1.5px solid rgba(176,120,64,0.2)" : "none" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "rgba(139,46,22,0.1)" }}
          >
            <Plus className="h-3.5 w-3.5" style={{ color: "#8b2e16" }} />
          </div>
          <span className="text-sm font-bold" style={{ color: "#2b160b", fontFamily: "'Playfair Display', serif" }}>
            New Memory Entry
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{ background: "rgba(139,46,22,0.1)", color: "#8b2e16" }}
          >
            +25 XP
          </span>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4" style={{ color: "#b07840" }} />
          : <ChevronDown className="h-4 w-4" style={{ color: "#b07840" }} />
        }
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-3.5 px-4 pb-4 pt-3">

              {/* Caption */}
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={`What happened in ${placeName}?`}
                rows={2}
                style={{ ...inputBase, padding: "10px 12px", resize: "none" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(139,46,22,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(176,120,64,0.3)")}
              />

              {/* Quote */}
              <div className="relative">
                <span
                  className="absolute left-3 top-2.5 text-xl leading-none select-none"
                  style={{ color: "rgba(176,120,64,0.5)" }}
                >"</span>
                <input
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="A quote or feeling…"
                  style={{ ...inputBase, padding: "10px 12px 10px 28px", fontStyle: "italic" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(139,46,22,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(176,120,64,0.3)")}
                />
              </div>

              {/* Mood */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#9b6b3a" }}>
                  Mood
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {MOOD_TAGS.map((tag) => (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => setMood(mood?.label === tag.label ? null : tag)}
                      className="rounded-full border px-2.5 py-1 text-xs transition-all"
                      style={{
                        fontFamily: "'Lato', sans-serif",
                        fontWeight: 600,
                        background: mood?.label === tag.label ? "rgba(139,46,22,0.12)" : "rgba(255,248,238,0.6)",
                        borderColor: mood?.label === tag.label ? "rgba(139,46,22,0.5)" : "rgba(176,120,64,0.3)",
                        color: mood?.label === tag.label ? "#8b2e16" : "#7b4b24",
                      }}
                    >
                      {tag.emoji} {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overhyped */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#b05030" }}>
                  🙄 Overhyped spots
                </p>
                <textarea
                  value={overhyped}
                  onChange={(e) => setOverhyped(e.target.value)}
                  placeholder={`What's not worth the hype in ${placeName}?`}
                  rows={2}
                  style={{
                    ...inputBase,
                    padding: "10px 12px",
                    resize: "none",
                    borderColor: "rgba(180,80,50,0.25)",
                    background: "rgba(255,240,230,0.5)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(180,80,50,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(180,80,50,0.25)")}
                />
              </div>

              {/* Hidden Gem */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#3a7a50" }}>
                  ✨ Hidden gem / best tip
                </p>
                <textarea
                  value={hiddenGem}
                  onChange={(e) => setHiddenGem(e.target.value)}
                  placeholder="Your secret find or must-know advice for future travellers…"
                  rows={2}
                  style={{
                    ...inputBase,
                    padding: "10px 12px",
                    resize: "none",
                    borderColor: "rgba(60,130,80,0.25)",
                    background: "rgba(230,248,238,0.5)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(60,130,80,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(60,130,80,0.25)")}
                />
              </div>

              {/* Song search */}
              <div className="space-y-2">
                <div className="relative">
                  <Music className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" style={{ color: "#3a7a50" }} />
                  <input
                    value={songQuery}
                    onChange={(e) => searchSongs(e.target.value)}
                    placeholder="Search a song for this memory…"
                    style={{ ...inputBase, padding: "10px 36px" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(139,46,22,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(176,120,64,0.3)")}
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin" style={{ color: "#b07840" }} />
                  )}
                </div>

                <AnimatePresence>
                  {results.length > 0 && !selectedSong && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="max-h-40 overflow-y-auto rounded-xl border border-[#c9a060]/40"
                      style={{ background: "rgba(253,246,232,0.98)" }}
                    >
                      {results.map((track) => (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => { setSelectedSong(track); setResults([]); setSongQuery(""); }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-[#f0ddb8]/50"
                        >
                          {track.image && (
                            <Image src={track.image} width={34} height={34} alt={track.name} className="rounded-lg flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold" style={{ color: "#2b160b" }}>{track.name}</p>
                            <p className="truncate text-[11px]" style={{ color: "#9b6b3a" }}>{track.artist}</p>
                          </div>
                          <Plus className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#3a7a50" }} />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedSong && (
                  <div
                    className="flex items-center gap-2.5 rounded-xl border px-3 py-2"
                    style={{ background: "rgba(220,245,230,0.5)", borderColor: "rgba(60,130,80,0.3)" }}
                  >
                    {selectedSong.image && (
                      <Image src={selectedSong.image} width={36} height={36} alt={selectedSong.name} className="rounded-lg flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold" style={{ color: "#1e5c38" }}>{selectedSong.name}</p>
                      <p className="truncate text-[11px]" style={{ color: "#3a7a50" }}>{selectedSong.artist}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedSong(null)}
                      className="rounded-full p-1 transition-colors hover:bg-[#c9a060]/20"
                    >
                      <X className="h-3 w-3" style={{ color: "#9b6b3a" }} />
                    </button>
                  </div>
                )}
              </div>

              {/* Photo upload */}
              <div>
                <label
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-xs transition-all hover:bg-[#f0ddb8]/30"
                  style={{ borderColor: "rgba(176,120,64,0.4)", color: "#9b6b3a", fontWeight: 600 }}
                >
                  <Camera className="h-3.5 w-3.5" />
                  {images.length > 0 ? `${images.length}/4 photos added` : "Add up to 4 photos"}
                  <input type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => handleImages(e.target.files)} />
                </label>

                {images.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    {images.map((img, i) => (
                      <div key={i} className="relative h-14 overflow-hidden rounded-xl border border-[#c9a060]/30">
                        <Image src={img} alt="" fill className="object-cover" unoptimized />
                        <button
                          type="button"
                          onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                          className="absolute right-0.5 top-0.5 rounded-full p-0.5"
                          style={{ background: "rgba(43,22,11,0.75)" }}
                        >
                          <X className="h-2.5 w-2.5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || isEmpty}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-bold transition-all disabled:opacity-40"
                style={{
                  background: saving || isEmpty ? "#c9a060" : "#8b2e16",
                  color: "#fff8ee",
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  border: "none",
                  boxShadow: saving || isEmpty ? "none" : "0 3px 12px rgba(139,46,22,0.35)",
                  cursor: saving || isEmpty ? "default" : "pointer",
                }}
              >
                {saving ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
                ) : (
                  <><Sparkles className="h-3.5 w-3.5" /> Seal this Memory</>
                )}
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}