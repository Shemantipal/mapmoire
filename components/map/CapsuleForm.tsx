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
  Quote as QuoteIcon,
  Disc,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types (Assuming these match your types.ts) ---
export type Track = {
  id: string;
  name: string;
  artist: string;
  image?: string;
};

export type MoodTag = {
  label: string;
  emoji: string;
};

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

// Assuming you import this, but defined here for the component to work
const MOOD_TAGS: MoodTag[] = [
  { label: "Nostalgic", emoji: "🕰️" },
  { label: "Thrilled", emoji: "⚡" },
  { label: "Peaceful", emoji: "🍃" },
  { label: "Chaotic", emoji: "🌪️" },
  { label: "Romantic", emoji: "🍷" },
  { label: "Disappointed", emoji: "🌧️" },
];

// ----------------------------------------------------------------------
// MODULAR SUB-COMPONENTS (Vintage Styled)
// ----------------------------------------------------------------------

const RetroTextarea = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b2e16]">
        {label}
      </p>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-3 h-4 w-4 text-[#8b2e16] fill-[#8b2e16]/20" />
      )}
      <textarea
        className={`w-full bg-[#fff3dc] border-[3px] border-[#4b260f] text-[#2b160b] placeholder:text-[#8b6b5d] placeholder:italic focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[4px_4px_0_#4b260f] focus:shadow-[2px_2px_0_#4b260f] transition-all resize-none ${
          Icon ? "pl-10 pr-3 py-3" : "p-3"
        } ${props.className || "font-mono text-sm"}`}
        {...props}
      />
    </div>
  </div>
);

const RetroInput = ({ icon: Icon, rightIcon: RightIcon, ...props }: any) => (
  <div className="relative w-full">
    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b260f]" />}
    <input
      className={`w-full bg-[#fff3dc] border-[3px] border-[#4b260f] text-[#2b160b] placeholder:text-[#8b6b5d] placeholder:italic focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[4px_4px_0_#4b260f] focus:shadow-[2px_2px_0_#4b260f] transition-all font-mono text-sm ${
        Icon ? "pl-10" : "pl-3"
      } ${RightIcon ? "pr-10" : "pr-3"} py-3`}
      {...props}
    />
    {RightIcon && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <RightIcon />
      </div>
    )}
  </div>
);

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

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
    if (!q.trim()) {
      setResults([]);
      return;
    }
    try {
      setSearching(true);
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(q)}`);
      setResults(res.ok ? await res.json() : []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    Array.from(files)
      .slice(0, 4 - images.length)
      .forEach((file) => {
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

  const isEmpty = !caption.trim() && !quote.trim() && !selectedSong && images.length === 0;

  return (
    <div className="border-[4px] border-[#4b260f] bg-[#ead8b8] shadow-[8px_8px_0_#4b260f] overflow-visible">
      
      {/* --- HEADER TOGGLE --- */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between bg-[#fff3dc] px-4 py-4 text-left transition-colors hover:bg-[#ffeac2] border-b-[4px] border-double border-[#4b260f]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border-2 border-[#4b260f] bg-[#8b2e16] shadow-[2px_2px_0_#4b260f]">
            <Plus className="h-4 w-4 text-[#fff3dc]" />
          </div>
          <span className="font-serif text-lg font-black tracking-tight text-[#2b160b] uppercase">
            Log Memory
          </span>
          <span className="border-2 border-[#4b260f] bg-[#fff3dc] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#2b160b] shadow-[2px_2px_0_#4b260f]">
            +25 XP
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-[#4b260f]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#4b260f]" />
        )}
      </button>

      {/* --- FORM BODY --- */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-6 px-5 py-6">
              
              {/* Caption */}
              <RetroTextarea
                value={caption}
                onChange={(e: any) => setCaption(e.target.value)}
                placeholder={`What happened in ${placeName}?`}
                rows={3}
                label="The Story"
              />

              {/* Quote */}
              <RetroTextarea
                value={quote}
                onChange={(e: any) => setQuote(e.target.value)}
                placeholder="A quote overheard, or a fleeting thought..."
                rows={2}
                icon={QuoteIcon}
                className="font-serif text-lg italic placeholder:text-base placeholder:font-serif"
              />

              {/* Grid for Overhyped & Hidden Gem */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <RetroTextarea
                  value={hiddenGem}
                  onChange={(e: any) => setHiddenGem(e.target.value)}
                  placeholder="Secret diner? Quiet park?"
                  rows={2}
                  label="💎 Hidden Gem"
                />
                <RetroTextarea
                  value={overhyped}
                  onChange={(e: any) => setOverhyped(e.target.value)}
                  placeholder="Tourist trap? Skip it?"
                  rows={2}
                  label="🙄 Overhyped"
                />
              </div>

              {/* Mood Tags */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#8b2e16]">
                  Vibe Check
                </p>
                <div className="flex flex-wrap gap-2">
                  {MOOD_TAGS.map((tag) => {
                    const isActive = mood?.label === tag.label;
                    return (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => setMood(isActive ? null : tag)}
                        className={`border-[3px] border-[#4b260f] px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                          isActive
                            ? "bg-[#4b260f] text-[#fff3dc] translate-x-[2px] translate-y-[2px] shadow-none"
                            : "bg-[#fff3dc] text-[#4b260f] shadow-[3px_3px_0_#4b260f] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-[#ffeac2]"
                        }`}
                      >
                        {tag.emoji} {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Song Search */}
              <div className="space-y-2 relative z-20">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#8b2e16]">
                  Soundtrack
                </p>
                <RetroInput
                  value={songQuery}
                  onChange={(e: any) => searchSongs(e.target.value)}
                  placeholder="Search the archive for a track..."
                  icon={Music}
                  rightIcon={() =>
                    searching ? <Loader2 className="h-4 w-4 animate-spin text-[#8b2e16]" /> : null
                  }
                />

                <AnimatePresence>
                  {results.length > 0 && !selectedSong && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 mt-2 max-h-48 overflow-y-auto border-[3px] border-[#4b260f] bg-[#fff3dc] shadow-[6px_6px_0_#4b260f] z-50"
                    >
                      {results.map((track) => (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => {
                            setSelectedSong(track);
                            setResults([]);
                            setSongQuery("");
                          }}
                          className="flex w-full items-center gap-3 border-b-[2px] border-dashed border-[#4b260f] p-3 text-left transition-colors hover:bg-[#ffeac2] last:border-b-0"
                        >
                          {track.image ? (
                            <div className="border-2 border-[#4b260f] shrink-0">
                              <Image src={track.image} width={36} height={36} alt={track.name} unoptimized />
                            </div>
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-[#4b260f] bg-[#2b160b]">
                              <Disc className="h-4 w-4 text-[#fff3dc]" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold text-[#2b160b] text-sm uppercase">{track.name}</p>
                            <p className="truncate text-xs font-bold text-[#8b2e16]">{track.artist}</p>
                          </div>
                          <Plus className="h-5 w-5 shrink-0 text-[#4b260f]" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected Song Card */}
                {selectedSong && (
                  <div className="flex items-center gap-3 border-[3px] border-[#4b260f] bg-[#fff3dc] p-2 shadow-[4px_4px_0_#4b260f]">
                    {selectedSong.image ? (
                      <div className="border-2 border-[#4b260f] shrink-0">
                        <Image src={selectedSong.image} width={44} height={44} alt={selectedSong.name} unoptimized />
                      </div>
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-[#4b260f] bg-[#2b160b]">
                        <Disc className="h-5 w-5 text-[#fff3dc]" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-[#2b160b] text-sm uppercase">{selectedSong.name}</p>
                      <p className="truncate text-xs font-bold text-[#8b2e16]">{selectedSong.artist}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedSong(null)}
                      className="mr-2 flex h-8 w-8 items-center justify-center border-2 border-[#4b260f] bg-[#8b2e16] text-[#fff3dc] transition-transform hover:-translate-y-1 hover:shadow-[2px_2px_0_#4b260f]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Photo Upload */}
              <div className="space-y-3 z-10 relative">
                <label className="flex w-full cursor-pointer items-center justify-center gap-2 border-[3px] border-dashed border-[#4b260f] bg-[#fff3dc] py-4 text-sm font-bold uppercase tracking-widest text-[#4b260f] transition-all hover:bg-[#ffeac2] hover:shadow-[4px_4px_0_#4b260f]">
                  <Camera className="h-5 w-5" />
                  {images.length > 0 ? `${images.length}/4 Photos Attached` : "Attach Photographs"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImages(e.target.files)}
                  />
                </label>

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-square border-[3px] border-[#4b260f] bg-[#2b160b] shadow-[4px_4px_0_rgba(75,38,15,0.3)] transform -rotate-1 even:rotate-1"
                      >
                        <Image src={img} alt="" fill className="object-cover opacity-90 sepia-[0.3]" unoptimized />
                        <button
                          type="button"
                          onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center border-2 border-[#4b260f] bg-[#8b2e16] text-[#fff3dc] hover:scale-110 transition-transform"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || isEmpty}
                className="flex w-full items-center justify-center gap-2 border-[4px] border-[#4b260f] bg-[#8b2e16] py-4 text-base font-black uppercase tracking-[0.15em] text-[#fff3dc] transition-all disabled:opacity-50 disabled:cursor-not-allowed enabled:shadow-[6px_6px_0_#4b260f] enabled:active:translate-x-[4px] enabled:active:translate-y-[4px] enabled:active:shadow-none enabled:hover:bg-[#a63a1d] mt-4"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" /> Seal this Memory
                  </>
                )}
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}