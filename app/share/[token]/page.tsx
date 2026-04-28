import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  Anchor,
  Compass,
  Disc,
  ExternalLink,
  Eye,
  Film,
  MapPin,
  Quote,
  Star,
} from "lucide-react";
import { SharedEngagement } from "./SharedEngagement";

// ----------------------------------------------------------------------
// 1. VINTAGE UI COMPONENTS & EFFECTS
// ----------------------------------------------------------------------

const VintageStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,900&display=swap');

    .mapmoire-page {
      font-family: 'Courier Prime', monospace;
      background-color: #ead8b8;
      color: #2b160b;
    }

    .mapmoire-serif {
      font-family: 'Playfair Display', serif;
    }

    .film-grain {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
      z-index: 50;
      opacity: 0.15;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      mix-blend-multiply;
    }

    .ticket-chip {
      position: relative;
      background: #fff3dc;
      border: 3px solid #4b260f;
      color: #4b260f;
      font-weight: bold;
      text-transform: uppercase;
      padding: 8px 16px;
      box-shadow: 4px 4px 0 #4b260f;
      white-space: nowrap;
    }

    .dymo-tape {
      background: #111;
      color: #fff;
      font-family: monospace;
      text-transform: uppercase;
      padding: 2px 6px;
      box-shadow: 1px 1px 0 rgba(0,0,0,0.5);
      transform: rotate(-1deg);
      display: inline-block;
    }

    .vintage-photo {
      filter: sepia(0.6) contrast(1.1) brightness(0.9) grayscale(0.2);
    }

    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}} />
);

function WaxSeal({ num }: { num: number }) {
  return (
    <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#8b2e16] shadow-[2px_2px_0_#4b260f] border-2 border-[#4b260f]">
      <div className="absolute inset-1 rounded-full border border-dashed border-[#fff3dc]/50" />
      <span className="mapmoire-serif text-xs sm:text-sm font-black text-[#fff3dc]">No.{num}</span>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. MODULAR HUT CAPSULE COMPONENT (Server-Side)
// ----------------------------------------------------------------------

function HutCapsule({ capsule, index, total }: { capsule: any; index: number; total: number }) {
  const memNum = total - index;

  return (
    <div className="group relative mt-12 sm:mt-16 transition-transform sm:hover:-translate-y-1">
      {/* --- Hard Shadow Underlay --- */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3">
        <div 
          className="absolute bottom-[calc(100%-2px)] w-full h-[50px] sm:h-[70px] bg-[#4b260f]" 
          style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} 
        />
        <div className="w-full h-full bg-[#4b260f]" />
      </div>

      {/* --- Hut Roof --- */}
      <div 
        className="relative z-10 w-full h-[50px] sm:h-[70px] bg-[#4b260f] flex justify-center items-end pb-1"
        style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}
      >
        <div 
          className="absolute bottom-0 w-[calc(100%-6px)] sm:w-[calc(100%-8px)] h-[calc(100%-3px)] sm:h-[calc(100%-4px)] bg-[#8b2e16]"
          style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}
        />
        <div className="absolute -bottom-2 sm:-bottom-3 z-20">
          <WaxSeal num={memNum} />
        </div>
      </div>

      {/* --- Hut Body --- */}
      <div className="relative z-10 w-full bg-[#ead8b8] border-[3px] sm:border-4 border-t-0 border-[#4b260f] p-4 sm:p-5 pb-5 sm:pb-6">
        
        {/* Header Strip */}
        <div className="mb-4 pt-2">
          <h2 className="mapmoire-serif text-2xl sm:text-3xl font-black text-[#2b160b] leading-none uppercase tracking-tighter truncate">
            {capsule.placeName}
          </h2>
          {capsule.state && (
            <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#8b2e16] truncate">
              {capsule.state}
            </p>
          )}
        </div>

        {/* Windows (Images) inside Polaroid Frames */}
        {capsule.images?.length > 0 && (
          <div className="mb-5 sm:mb-6 grid gap-4">
            {capsule.images.slice(0, 1).map((img: string, i: number) => (
              <div key={i} className="bg-[#fff3dc] p-2.5 sm:p-3 pb-6 sm:pb-8 border-3 border-[#4b260f] shadow-[4px_4px_0_rgba(75,38,15,0.2)] transform -rotate-1">
                <div className="relative h-40 sm:h-48 w-full overflow-hidden border-2 border-[#4b260f]">
                  <Image
                    src={img}
                    alt="Memory"
                    fill
                    className="object-cover vintage-photo"
                    unoptimized
                  />
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-[#fff3dc] opacity-80 font-mono text-[8px] sm:text-[10px] drop-shadow-md">
                    {new Date(capsule.createdAt).toLocaleDateString("en-US", { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Story Section */}
        <div className="space-y-4">
          {capsule.caption && (
            <div className="border-l-[3px] sm:border-l-4 border-[#8b2e16] pl-3 sm:pl-4">
              <p className="font-bold leading-relaxed text-[#4b260f] text-xs sm:text-sm">
                {capsule.caption}
              </p>
            </div>
          )}

          {capsule.quote && (
            <div className="bg-[#fff3dc] border-3 border-[#4b260f] p-3 sm:p-4 relative mt-6">
              <Quote className="absolute -top-3 -left-2 h-5 w-5 sm:h-6 sm:w-6 text-[#8b2e16] fill-[#8b2e16] bg-[#ead8b8]" />
              <p className="mapmoire-serif text-base sm:text-lg italic text-[#2b160b] text-center">
                "{capsule.quote}"
              </p>
            </div>
          )}

          {/* Dymo Tags */}
          {(capsule.mood || capsule.overhyped || capsule.hiddenGem) && (
            <div className="space-y-2.5 sm:space-y-3 py-2 border-y-[3px] sm:border-y-4 border-double border-[#4b260f]">
              {capsule.mood && (
                <div><span className="dymo-tape text-[10px] sm:text-xs bg-[#8b2e16]">MOOD: {capsule.mood}</span></div>
              )}
              {capsule.hiddenGem && (
                <div>
                  <span className="dymo-tape text-[10px] sm:text-xs bg-[#2b160b]">GEM</span>
                  <p className="mt-1 text-[10px] sm:text-xs font-bold text-[#4b260f] leading-snug">- {capsule.hiddenGem}</p>
                </div>
              )}
              {capsule.overhyped && (
                <div>
                  <span className="dymo-tape text-[10px] sm:text-xs bg-[#5a3218]">SKIP</span>
                  <p className="mt-1 text-[10px] sm:text-xs font-bold text-[#4b260f] leading-snug">- {capsule.overhyped}</p>
                </div>
              )}
            </div>
          )}

          {/* Analog Music Player */}
          {capsule.songTitle && (
            <div className="flex items-center gap-3 sm:gap-4 bg-[#fff3dc] border-3 border-[#4b260f] p-2 sm:p-3 shadow-[4px_4px_0_#4b260f]">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center bg-[#2b160b] rounded-full border-2 border-[#fff3dc] animate-[spin-slow_4s_linear_infinite]">
                 <Disc className="h-5 w-5 sm:h-6 sm:w-6 text-[#ead8b8]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-[#2b160b] uppercase text-xs sm:text-sm">{capsule.songTitle}</p>
                <p className="truncate text-[10px] sm:text-xs font-bold text-[#8b2e16]">{capsule.artist}</p>
              </div>
              {capsule.spotifyUrl && (
                <a
                  href={capsule.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center border-3 border-[#4b260f] bg-[#8b2e16] text-[#fff3dc] transition-transform sm:hover:-translate-y-1 shadow-[2px_2px_0_#4b260f]"
                >
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
              )}
            </div>
          )}

          {/* Engagement (Loves / Comments) */}
          <div className="pt-2">
            <SharedEngagement capsuleId={capsule.id} />
          </div>

          {/* Footer Ledger */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 mt-2 border-t-2 border-dashed border-[#4b260f]">
            <div className="flex items-center gap-1.5 sm:gap-2 border-[2px] sm:border-3 border-[#4b260f] bg-[#fff3dc] px-2 py-1 shadow-[2px_2px_0_#4b260f]">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#2b160b] text-[#2b160b]" />
              <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest">+25 XP</span>
            </div>
            <p className="font-mono text-[10px] sm:text-xs font-bold uppercase text-[#8b2e16]">
              {new Date(capsule.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. MAIN SHARED PAGE
// ----------------------------------------------------------------------

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
      <main className="mapmoire-page flex min-h-screen items-center justify-center p-6">
        <VintageStyles />
        <div className="film-grain" />
        <div className="relative z-10 max-w-md w-full bg-[#fff3dc] border-4 border-[#4b260f] p-8 text-center shadow-[8px_8px_0_#4b260f]">
          <Eye className="mx-auto h-12 w-12 text-[#8b2e16] mb-4 opacity-50" />
          <p className="mapmoire-serif text-3xl sm:text-4xl font-black text-[#2b160b] uppercase tracking-tighter leading-none mb-4">
            Signal Lost.
          </p>
          <p className="font-bold text-[#8b2e16] uppercase tracking-widest text-sm">
            This archive has drifted away.
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

  const uniqueCities: string[] = Array.from(
    new Set<string>(
      capsules
        .map((c: { placeName: string | null }) => c.placeName)
        .filter((placeName: string | null): placeName is string => Boolean(placeName))
    )
  );

  const rawName = share.userName?.trim() || "";
  const firstName = rawName.split(/\s+/)[0] || "Traveler";

  const xp = capsules.length * 25;
  const level = Math.max(1, Math.floor(xp / 100) + 1);

  return (
    <main className="mapmoire-page relative min-h-screen">
      <VintageStyles />
      <div className="film-grain" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        
        {/* === VINTAGE EXPLORER ID / HEADER === */}
        <div className="bg-[#fff3dc] border-[3px] sm:border-4 border-[#4b260f] p-5 sm:p-8 shadow-[6px_6px_0_#4b260f] sm:shadow-[8px_8px_0_#4b260f] mb-8 sm:mb-12">
          
          <div className="border-b-[3px] sm:border-b-4 border-double border-[#4b260f] pb-4 sm:pb-6 mb-6 sm:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 sm:gap-4">
            <div>
              <h1 className="mapmoire-serif text-4xl sm:text-5xl md:text-7xl font-black text-[#2b160b] uppercase tracking-tighter leading-none">
                {firstName}'s<br />Archive.
              </h1>
              <p className="font-bold text-[#8b2e16] mt-1 sm:mt-2 text-[10px] sm:text-base uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                Shared Field Ledger
              </p>
            </div>
            <div className="bg-[#2b160b] text-[#fff3dc] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base font-bold uppercase tracking-widest border-2 border-[#2b160b]">
              Read Only // Active
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch">
            
            {/* Polaroid Area - FIXED DIMENSIONS to prevent massive blank space */}
            <div className="shrink-0 bg-[#fff3dc] p-3 pb-6 border-3 border-[#4b260f] shadow-[4px_4px_0_rgba(75,38,15,0.2)] transform -rotate-2 w-40 flex flex-col justify-between">
              <div className="relative h-32 w-full overflow-hidden border-2 border-[#4b260f] bg-[#ead8b8] flex flex-col items-center justify-center text-[#4b260f]">
                <Compass className="h-10 w-10 mb-2 opacity-80" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Explorer</p>
              </div>
              <div className="mt-4 flex flex-col items-center text-center">
                <p className="font-mono text-[10px] font-bold text-[#4b260f] uppercase">
                  ID: {token.substr(0, 8).toUpperCase()}
                </p>
                <div className="mt-2 bg-[#8b2e16] px-2 py-1 border-2 border-[#4b260f]">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-[#fff3dc] leading-none">Shared Itinerary</p>
                </div>
              </div>
            </div>

            {/* Stats Table - ADDED min-w-0 to prevent grid squishing */}
            <div className="flex-1 min-w-0 w-full flex flex-col justify-center">
              <div className="grid grid-cols-2 lg:grid-cols-4 border-[3px] sm:border-4 border-[#4b260f] bg-[#ead8b8]">
                <div className="border-r-[2px] border-b-[2px] lg:border-b-0 border-dashed border-[#4b260f] p-4 sm:p-5">
                  <p className="text-[10px] font-bold text-[#8b2e16] uppercase tracking-widest">Rank</p>
                  <p className="text-xl sm:text-2xl font-black text-[#2b160b] uppercase truncate mt-1">Lv.{level}</p>
                </div>
                <div className="border-b-[2px] lg:border-b-0 lg:border-r-[2px] border-dashed border-[#4b260f] p-4 sm:p-5">
                  <p className="text-[10px] font-bold text-[#8b2e16] uppercase tracking-widest">XP</p>
                  <p className="text-xl sm:text-2xl font-black text-[#2b160b] truncate mt-1">{xp}</p>
                </div>
                <div className="border-r-[2px] border-dashed border-[#4b260f] p-4 sm:p-5">
                  <p className="text-[10px] font-bold text-[#8b2e16] uppercase tracking-widest">Ports</p>
                  <p className="text-xl sm:text-2xl font-black text-[#2b160b] truncate mt-1">{uniqueCities.length}</p>
                </div>
                <div className="p-4 sm:p-5">
                  <p className="text-[10px] font-bold text-[#8b2e16] uppercase tracking-widest">Entries</p>
                  <p className="text-xl sm:text-2xl font-black text-[#2b160b] truncate mt-1">{capsules.length}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* === TICKET CHIPS (Itinerary / Ports of Call) === */}
        {uniqueCities.length > 0 && (
          <div className="mb-8 sm:mb-12 flex items-center gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-2 sm:pb-4">
            <div className="bg-[#2b160b] text-[#fff3dc] p-2.5 sm:p-3 border-2 border-[#2b160b] shrink-0">
              <Anchor className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="ticket-chip text-xs sm:text-sm bg-[#4b260f] text-[#fff3dc]">
              Itinerary
            </div>
            {uniqueCities.map((city) => (
              <div key={city} className="ticket-chip text-xs sm:text-sm cursor-default hover:translate-x-0 hover:translate-y-0 hover:shadow-[4px_4px_0_#4b260f]">
                ★ {city}
              </div>
            ))}
          </div>
        )}

        {/* === EMPTY STATE === */}
        {capsules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 border-4 border-dashed border-[#4b260f] bg-[#fff3dc]/50 text-center mx-2 sm:mx-0 px-4">
            <Film className="h-12 w-12 sm:h-16 sm:w-16 text-[#8b2e16] mb-4 sm:mb-6 opacity-50" />
            <h3 className="mapmoire-serif text-3xl sm:text-4xl font-black text-[#2b160b] mb-2">Blank Canvas.</h3>
            <p className="font-bold text-sm sm:text-base text-[#5a3218] uppercase tracking-widest">No memories documented yet.</p>
          </div>
        ) : (
          /* === GRID OF HUT CAPSULES === */
          <div className="grid items-start gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-12 md:grid-cols-2 xl:grid-cols-3 pt-4 sm:pt-6">
            {capsules.map((capsule: any, i: number) => (
              <HutCapsule
                key={capsule.id}
                capsule={capsule}
                index={i}
                total={capsules.length}
              />
            ))}
          </div>
        )}

        <footer className="mt-16 sm:mt-24 border-t-4 border-double border-[#4b260f] py-8 text-center">
          <p className="font-bold text-xs sm:text-sm uppercase tracking-widest text-[#8b2e16]">
            Made with Mapmoire — Document The Journey.
          </p>
        </footer>
      </div>
    </main>
  );
}