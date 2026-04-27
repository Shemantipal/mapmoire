import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  Anchor,
  BookOpen,
  ExternalLink,
  Feather,
  Globe,
  Heart,
  MapPin,
  Music,
  Quote,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { SharedEngagement } from "./SharedEngagement";

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
      <main className="flex min-h-screen items-center justify-center bg-[#e8d7b7] text-[#2b160b]">
        <div className="rounded-3xl border-2 border-[#4f2a12] bg-[#f3dfb9] p-10 text-center shadow-[6px_6px_0_#8b2e16]">
          <p className="font-serif text-3xl font-black text-[#8b2e16]">
            This story has drifted away...
          </p>
          <p className="mt-2 font-serif text-sm text-[#7b4b24]">
            Share link not found.
          </p>
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
  new Set(
    capsules
      .map((c: { placeName: string | null }) => c.placeName)
      .filter((placeName: string | null): placeName is string =>
        Boolean(placeName)
      )
  )
);

  const rawName = share.userName?.trim() || "";
  const firstName = rawName.split(/\s+/)[0] || "Traveler";

  const xp = capsules.length * 25;
  const level = Math.max(1, Math.floor(xp / 100) + 1);
  const progress = xp % 100;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#e8d7b7] text-[#2b160b]">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(rgba(92,61,30,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(92,61,30,0.055) 1px, transparent 1px), radial-gradient(circle at 20% 10%, rgba(139,46,22,0.12), transparent 35%), radial-gradient(circle at 90% 80%, rgba(123,75,36,0.14), transparent 35%)",
          backgroundSize: "42px 42px, 42px 42px, 100% 100%, 100% 100%",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-7">
        {/* HERO */}
        <section className="mb-6 overflow-hidden rounded-[1.25rem] border-2 border-[#4f2a12] bg-[#f3dfb9] shadow-[5px_5px_0_#8b2e16]">
          <div className="border-b border-[#7b4b24]/30 bg-[#d9bd8d] px-8 py-2 text-center">
            <p className="font-serif text-[9px] uppercase tracking-[.35em] text-[#5a3218]">
              ✦ Shared Mapmoire Travel Archive ✦
            </p>
          </div>

          <div className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 flex max-w-md items-center gap-3">
                <div className="h-px flex-1 bg-[#7b4b24]/35" />
                <Anchor className="h-5 w-5 text-[#7b4b24]/50" />
                <div className="h-px flex-1 bg-[#7b4b24]/35" />
              </div>

              <h1 className="font-serif text-4xl font-black leading-none text-[#2b160b] md:text-5xl">
                {firstName}&apos;s{" "}
                <span className="text-[#8b2e16]">Travel Diary</span>
              </h1>

              <p className="mt-3 max-w-xl font-serif text-sm italic leading-relaxed text-[#5a3218]">
                A shared collection of places, songs, quotes, hidden gems and
                tiny travel memories.
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

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-2">
              {[
                {
                  icon: <Globe className="h-3.5 w-3.5" />,
                  value: uniqueCities.length,
                  label: "Ports",
                },
                {
                  icon: <BookOpen className="h-3.5 w-3.5" />,
                  value: capsules.length,
                  label: "Entries",
                },
                {
                  icon: <Trophy className="h-3.5 w-3.5" />,
                  value: xp,
                  label: "Memory XP",
                },
                {
                  icon: <Star className="h-3.5 w-3.5" />,
                  value: `Lv ${level}`,
                  label: "Level",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#7b4b24]/30 bg-[#ead7b5] p-3 shadow-sm"
                >
                  <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full border border-[#7b4b24]/50 bg-[#f7ead0] text-[#5a3218]">
                    {item.icon}
                  </div>
                  <p className="font-serif text-lg font-black leading-none text-[#2b160b]">
                    {item.value}
                  </p>
                  <p className="mt-1 font-serif text-[8px] uppercase tracking-widest text-[#7b4b24]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {uniqueCities.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-[#7b4b24]/25 px-5 py-4">
              {uniqueCities.map((city) => (
                <span
                  key={city}
                  className="rounded-full border border-[#7b4b24]/45 bg-[#fff3dc] px-3 py-1 font-serif text-xs text-[#4b260f]"
                >
                  ⚓ {city}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* GRID */}
        {capsules.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[#7b4b24]/35 bg-[#f3dfb9] py-24 text-center">
            <Sparkles className="mb-4 h-10 w-10 text-[#7b4b24]/40" />
            <p className="font-serif text-2xl italic text-[#7b4b24]">
              No memories yet...
            </p>
          </div>
        ) : (
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#7b4b24]/35" />
              <p className="font-serif text-[10px] uppercase tracking-[.3em] text-[#7b4b24]">
                {capsules.length} entries shared
              </p>
              <div className="h-px flex-1 bg-[#7b4b24]/35" />
            </div>

            <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {capsules.map((capsule, index) => (
                <article
                  key={capsule.id}
                  className="group relative overflow-hidden rounded-[1.35rem] border-[2.5px] border-[#4f2a12] bg-[#f3dfb9] text-[#2b160b] shadow-[5px_5px_0_#6f3f1d] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_#8b2e16]"
                >
                  <div className="absolute left-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#74210e] bg-[#c23a16] shadow-md">
                    <span className="font-serif text-[10px] font-black text-[#fff3dc]">
                      #{capsules.length - index}
                    </span>
                  </div>

                  {capsule.images?.length > 0 ? (
                    <div
                      className={`grid gap-[2px] border-b-2 border-[#6f3f1d]/40 ${
                        capsule.images.length === 1
                          ? "grid-cols-1"
                          : "grid-cols-2"
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
                            unoptimized
                            className="object-cover sepia-[0.18] transition duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/35 via-transparent to-transparent" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-24 items-center justify-center border-b-2 border-[#6f3f1d]/40 bg-[#ead7b5]">
                      <Globe className="h-7 w-7 text-[#7b4b24]/45" />
                    </div>
                  )}

                  <div className="space-y-2 p-3">
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

                    {(capsule.mood ||
                      capsule.overhyped ||
                      capsule.hiddenGem) && (
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
                          <a
                            href={capsule.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#7b4b24]/40 bg-[#f8ead0] text-[#4b260f]"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    )}

                    <SharedEngagement capsuleId={capsule.id} />

                    <div className="flex items-center justify-between border-t border-[#7b4b24]/25 pt-3">
                      <span className="rounded-lg border border-[#c23a16]/40 bg-[#c23a16]/10 px-2 py-1 font-serif text-[9px] uppercase tracking-widest text-[#8b2e16]">
                        <Heart className="mr-1 inline h-3 w-3" />
                        +25 XP
                      </span>

                      <time className="font-serif text-[10px] uppercase tracking-wider text-[#7b4b24]/70">
                        {new Date(capsule.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-10 border-t border-[#7b4b24]/25 py-7 text-center">
          <p className="font-serif text-sm italic text-[#7b4b24]">
            Made with Mapmoire — turn every journey into a story.
          </p>
        </footer>
      </div>
    </main>
  );
}