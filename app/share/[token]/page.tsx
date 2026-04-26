import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  ExternalLink,
  MapPin,
  Music,
  Quote,
  Sparkles,
  Trophy,
  Wand2,
  BookOpen,
  Globe,
  Star,
} from "lucide-react";

export default async function SharedMemoryPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const share = await prisma.shareLink.findUnique({
    where: { token },
  });

  if (!share) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0804] text-amber-100">
        <div className="text-center">
          <p className="font-serif text-3xl italic text-amber-200/60">
            This story has drifted away...
          </p>
          <p className="mt-2 text-sm text-amber-100/30">Share link not found.</p>
        </div>
      </main>
    );
  }

  const capsules = await prisma.storyCapsule.findMany({
    where: {
      userId: share.userId,
      ...(share.type === "city" && share.placeName
        ? { placeName: share.placeName }
        : {}),
      ...(share.type === "capsule" && share.capsuleId
        ? { id: share.capsuleId }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const uniqueCities = Array.from(
    new Set(capsules.map((c) => c.placeName))
  );

  const rawName = share.userName?.trim() || "";
  const firstName = rawName.split(/\s+/)[0] || "Traveler";

  const xp = capsules.length * 25;
  const level = Math.max(1, Math.floor(xp / 100) + 1);
  const progress = xp % 100;


  const isFeature = (i: number) => i === 0 || i === 5 || i === 8;

  return (
    <>
      {/* Google Fonts – Playfair Display + DM Sans */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes grain {
          0%,100%{ transform: translate(0,0) }
          10%    { transform: translate(-2%,-3%) }
          30%    { transform: translate(3%, 2%) }
          50%    { transform: translate(-1%, 4%) }
          70%    { transform: translate(4%,-1%) }
          90%    { transform: translate(-3%, 2%) }
        }
        .grain::after {
          content:'';
          position:fixed;inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");
          background-size:256px;
          pointer-events:none;
          z-index:9999;
          animation: grain 8s steps(2) infinite;
          opacity:.35;
        }

        .card-hover {
          transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease;
        }
        .card-hover:hover {
          transform: translateY(-5px) rotate(-.3deg);
          box-shadow: 0 32px 64px -12px rgba(0,0,0,.7), 0 0 0 1px rgba(217,119,6,.15);
        }

        .progress-bar {
          background: linear-gradient(90deg, #d97706, #f59e0b, #fcd34d);
          background-size: 200% 100%;
          animation: shimmer 2.5s linear infinite;
        }
        @keyframes shimmer {
          0%  { background-position: 200% center }
          100%{ background-position: -200% center }
        }

        .stamp {
          border: 2.5px dashed rgba(217,119,6,.4);
          border-radius: 4px;
          position: relative;
        }
        .stamp::before {
          content: '';
          position: absolute;
          inset: 3px;
          border: 1px solid rgba(217,119,6,.15);
          border-radius: 2px;
          pointer-events: none;
        }
      `}</style>

      <main className="grain font-body min-h-screen overflow-x-hidden bg-[#0a0804] text-amber-50">

        {/* ── HERO HEADER ──────────────────────────────────────────── */}
        <section className="relative px-6 pb-16 pt-14 md:px-14 lg:px-20">
          {/* faint world map watermark */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Ccircle cx='500' cy='250' r='230' stroke='%23f59e0b' stroke-width='1' fill='none'/%3E%3Cline x1='0' y1='250' x2='1000' y2='250' stroke='%23f59e0b' stroke-width='.5'/%3E%3Cline x1='500' y1='0' x2='500' y2='500' stroke='%23f59e0b' stroke-width='.5'/%3E%3C/svg%3E")`,
              backgroundSize: "cover",
            }}
          />

          <div className="relative mx-auto max-w-6xl">
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-amber-500/50" />
              <span className="font-body text-xs font-medium uppercase tracking-[.25em] text-amber-400/70">
                Shared Mapmoire World
              </span>
            </div>

            {/* Hero title — dynamic firstName */}
            <h1 className="font-display text-[clamp(3rem,9vw,8rem)] font-black leading-[.9] tracking-tight text-amber-50">
              {firstName}&apos;s
              <br />
              <em className="font-display italic text-amber-400">
                Travel Diary
              </em>
            </h1>

            <p className="font-body mt-6 max-w-lg text-base font-light leading-relaxed text-amber-100/50 md:text-lg">
              Collected memories scattered across maps, moments &amp; music.
            </p>

            {/* Stat row */}
            <div className="mt-10 flex flex-wrap items-end gap-10">
              {[
                { icon: <Globe className="h-4 w-4" />, value: uniqueCities.length, label: "Cities", color: "text-sky-400" },
                { icon: <BookOpen className="h-4 w-4" />, value: capsules.length, label: "Entries", color: "text-pink-400" },
                { icon: <Trophy className="h-4 w-4" />, value: xp, label: "XP", color: "text-amber-400" },
                { icon: <Star className="h-4 w-4" />, value: `Lv. ${level}`, label: "Level", color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <div className={`flex items-center gap-1.5 ${s.color} mb-1`}>
                    {s.icon}
                    <span className="text-xs font-medium uppercase tracking-widest opacity-70">{s.label}</span>
                  </div>
                  <span className="font-display text-4xl font-black text-amber-50">{s.value}</span>
                </div>
              ))}
            </div>

            {/* XP progress */}
            <div className="mt-8 max-w-sm">
              <div className="mb-1.5 flex justify-between text-[11px] text-amber-100/30">
                <span>Level {level}</span>
                <span>{progress} / 100 XP to next level</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="progress-bar h-full rounded-full"
                  style={{ width: `${Math.max(4, progress)}%` }}
                />
              </div>
            </div>

            {/* City stamps */}
            {uniqueCities.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {uniqueCities.map((city) => (
                  <span
                    key={city}
                    className="stamp px-3 py-1 text-xs font-medium text-amber-300/80"
                  >
                    📍 {city}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Divider rule */}
        <div className="mx-6 border-t border-amber-900/40 md:mx-14 lg:mx-20" />

        {/* ── CAPSULE GRID ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-14 md:px-14 lg:px-20">
          {capsules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Sparkles className="mb-4 h-10 w-10 text-amber-400/30" />
              <p className="font-display text-2xl italic text-amber-200/30">
                No memories yet...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {capsules.map((capsule, index) => (
                <article
                  key={capsule.id}
                  className={`card-hover group overflow-hidden rounded-3xl border border-amber-900/20 bg-[#110e08] ${
                    isFeature(index) ? "md:col-span-2 xl:col-span-1" : ""
                  }`}
                >
                  {/* Images */}
                  {capsule.images?.length > 0 ? (
                    <div
                      className={`grid gap-1 p-1.5 ${
                        capsule.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                      }`}
                    >
                      {capsule.images.slice(0, isFeature(index) ? 2 : 4).map((img, i) => (
                        <div
                          key={i}
                          className={`relative overflow-hidden rounded-2xl ${
                            isFeature(index) ? "h-52" : "h-36"
                          }`}
                        >
                          <Image
                            src={img}
                            alt="Memory"
                            fill
                            unoptimized
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                          {/* amber tint on hover */}
                          <div className="absolute inset-0 bg-amber-900/0 transition duration-500 group-hover:bg-amber-900/10" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mx-1.5 mt-1.5 flex h-36 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-900/20 to-stone-900/40">
                      <Globe className="h-7 w-7 text-amber-700/40" />
                    </div>
                  )}

                  {/* Body */}
                  <div className="space-y-3 p-5">
                    {/* Location + memory number */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-display flex items-center gap-2 text-lg font-bold text-amber-100">
                          <MapPin className="h-4 w-4 text-amber-500" />
                          {capsule.placeName}
                        </h2>
                        {capsule.state && (
                          <p className="mt-0.5 text-xs text-amber-100/30">{capsule.state}</p>
                        )}
                      </div>
                      <span className="rounded-full border border-amber-900/30 bg-amber-900/20 px-2.5 py-0.5 text-[10px] font-medium text-amber-400/60">
                        #{capsules.length - index}
                      </span>
                    </div>

                    {/* Caption */}
                    {capsule.caption && (
                      <p className="text-sm leading-relaxed text-amber-100/60">
                        {capsule.caption}
                      </p>
                    )}

                    {/* Quote */}
                    {capsule.quote && (
                      <div className="flex gap-2.5 rounded-2xl bg-amber-950/50 px-4 py-3">
                        <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <p className="font-display text-sm italic text-amber-200/70">
                          {capsule.quote}
                        </p>
                      </div>
                    )}

                    {/* Song */}
                    {capsule.songTitle && (
                      <div className="flex items-center gap-3 rounded-2xl border border-emerald-900/30 bg-emerald-950/30 px-3.5 py-2.5">
                        {capsule.albumArt && (
                          <Image
                            src={capsule.albumArt}
                            alt={capsule.songTitle}
                            width={36}
                            height={36}
                            className="rounded-xl"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-emerald-300">
                            <Music className="mr-1 inline h-3 w-3" />
                            {capsule.songTitle}
                          </p>
                          <p className="truncate text-[11px] text-emerald-100/40">
                            {capsule.artist}
                          </p>
                        </div>
                        {capsule.spotifyUrl && (
                          <a
                            href={capsule.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-emerald-500/80 p-1.5 text-white transition hover:bg-emerald-400"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-amber-900/20 pt-3">
                      <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                        ⚡ +25 XP
                      </span>
                      <time className="text-[11px] text-amber-100/20">
                        {new Date(capsule.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <footer className="border-t border-amber-900/20 px-6 py-8 text-center md:px-14">
          <p className="font-display text-sm italic text-amber-100/20">
            Made with Mapmoire — turn every journey into a story.
          </p>
        </footer>
      </main>
    </>
  );
}