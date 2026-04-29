"use client";

import Image from "next/image";
import { Disc3, ExternalLink, Pause, Play } from "lucide-react";
import { DbCapsule } from "./types";

type Props = {
  capsule: DbCapsule;
  index: number;
  total: number;
  playingId: string | null;
  onTogglePlay: (capsule: DbCapsule) => void;
};

export function CapsuleCard({ capsule, index, total, playingId, onTogglePlay }: Props) {
  const isPlaying = playingId === capsule.id;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-amber-900/20 bg-[#13100a] transition hover:border-amber-800/30">
      <div className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-amber-900/30 text-[10px] font-bold text-amber-600">
        {total - index}
      </div>


      {capsule.images?.length > 0 && (
        <div className={`grid gap-0.5 ${capsule.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {capsule.images.slice(0, 4).map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden ${
                capsule.images.length === 1 ? "h-36" : "h-24"
              }`}
            >
              <Image
                src={img}
                alt="Memory"
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#13100a]/60 to-transparent" />
            </div>
          ))}
        </div>
      )}

  
      <div className="space-y-2.5 p-3.5">
 
        <p className="text-[10px] tracking-widest text-amber-800/60">
          {new Date(capsule.createdAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </p>
        {capsule.mood && (
  <span className="text-xs text-amber-600">{capsule.mood}</span>
)}

        
        {capsule.caption && (
          <p className="text-sm leading-relaxed text-amber-100/85">{capsule.caption}</p>
        )}


        {capsule.quote && (
          <div className="rounded-xl border-l-2 border-amber-600/40 bg-amber-950/30 py-2 pl-3 pr-2">
            <p className="text-xs italic leading-relaxed text-amber-300/70">
              &ldquo;{capsule.quote}&rdquo;
            </p>
          </div>
        )}

   
        {capsule.songTitle && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-900/20 bg-emerald-950/20 px-3 py-2.5">
            {capsule.albumArt && (
              <div className="relative shrink-0">
                <Image
                  src={capsule.albumArt}
                  width={40}
                  height={40}
                  alt={capsule.songTitle}
                  className={`rounded-xl ${isPlaying ? "animate-spin" : ""}`}
                  style={{ animationDuration: "6s" }}
                />
                <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-0.5">
                  <Disc3 className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-emerald-200">{capsule.songTitle}</p>
              <p className="truncate text-[11px] text-emerald-700/80">{capsule.artist}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {capsule.previewUrl && (
                <button
                  type="button"
                  onClick={() => onTogglePlay(capsule)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/80 text-white transition hover:bg-emerald-500"
                >
                  {isPlaying
                    ? <Pause className="h-3 w-3" />
                    : <Play className="h-3 w-3" />
                  }
                </button>
              )}
              {capsule.spotifyUrl && (
                <a
                  href={capsule.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-amber-700 transition hover:bg-white/10 hover:text-amber-400"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}