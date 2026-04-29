"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Camera,
  ChevronRight,
  Compass,
  Map,
  MapPin,
  Menu,
  Play,
  Pause,
  Ticket,
  X, // Added X for closing the mobile menu
} from "lucide-react";

// Local imports (ensure these exist in your project)
import { fetchNearbyTouristPlaces, type TouristPlace } from "./tourist-places";
import { createThreeMemoryLayer } from "./three-memory-layer";
import { StoryCapsule } from "./StoryCapsule";
import { SearchPlace } from "./SearchPlace";
import { PlaceStoryCard } from "./PlaceStoryCard";
import { defaultPlaces, type Place } from "./map-data";

import { Button } from "@/components/ui/button";

type MapLibre = typeof import("maplibre-gl");

// ----------------------------------------------------------------------
// 1. VINTAGE CSS (Restored & Enhanced)
// ----------------------------------------------------------------------
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;500;600;700;800;900&display=swap');

  .mapmoire-page {
    font-family: 'Inter', sans-serif;
    background-color: #ead8b8;
    color: #2b160b;
  }

  .mapmoire-serif {
    font-family: "Playfair Display", serif;
  }

  /* Retro Markers */
  .mapmoire-city-marker, .tourist-marker {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .marker-wrap {
    position: relative;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 999px;
    background: #fff3dc;
    border: 3px solid #4b260f;
    box-shadow: 4px 4px 0px #4b260f;
    transition: all 0.2s ease;
  }

  .marker-wrap:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #4b260f;
  }

  .marker-wrap:active {
    transform: translate(2px, 2px);
    box-shadow: 0px 0px 0px #4b260f;
  }

  .marker-pin {
    width: 18px;
    height: 18px;
    color: #4b260f;
  }

  .bucket-check {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: #8b2e16;
    color: #fff3dc;
    font-size: 11px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff3dc;
  }

  .tourist-marker {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: #e4c48a;
    border: 2px solid #4b260f;
    box-shadow: 3px 3px 0px #4b260f;
  }

  /* Vintage Popups */
  .mapmoire-popup .maplibregl-popup-content {
    background: #fff3dc;
    border: 3px solid #4b260f;
    border-radius: 0px;
    padding: 12px 16px;
    box-shadow: 6px 6px 0px #4b260f;
    color: #4b260f;
    font-family: 'Inter', sans-serif;
  }

  .mapmoire-popup .maplibregl-popup-content strong {
    display: block;
    margin-bottom: 4px;
    font-family: "Playfair Display", serif;
    font-size: 16px;
    color: #2b160b;
  }

  .mapmoire-popup .maplibregl-popup-content p {
    margin: 0;
    color: #68411f;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .mapmoire-popup .maplibregl-popup-tip {
    display: none;
  }

  /* Retro Marquee Animation */
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    display: inline-block;
    white-space: nowrap;
    animation: marquee 20s linear infinite;
  }
`;

function VintageMapFilter() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[3] bg-[#d9b272]/30 mix-blend-multiply" />
      <div className="pointer-events-none absolute inset-0 z-[4] bg-[#fff0c9]/20 mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(75,38,15,0.4)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 z-[6] opacity-[0.25] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}

function RetroButton({ children, onClick, className = "", variant = "primary" }: any) {
  const baseStyle = "flex items-center justify-center px-6 py-3 font-bold uppercase tracking-wider transition-all border-3 border-[#4b260f] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
  const variants: any = {
    primary: "bg-[#8b2e16] text-[#fff3dc] shadow-[4px_4px_0px_#4b260f] hover:bg-[#a63a1d]",
    secondary: "bg-[#fff3dc] text-[#4b260f] shadow-[4px_4px_0px_#4b260f] hover:bg-[#ffeac2]",
    ghost: "border-transparent hover:border-[#4b260f] shadow-none text-[#4b260f]"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

function Navbar() {
  const { isSignedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state added

  return (
    <header className="sticky top-0 z-50 border-b-4 border-[#4b260f] bg-[#ead8b8] shadow-[0_4px_0_rgba(75,38,15,0.1)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center bg-[#4b260f] text-[#fff3dc] shadow-[4px_4px_0_#8b2e16]">
            <Map className="h-6 w-6" />
          </div>
          <div>
            <h1 className="mapmoire-serif text-2xl font-black leading-none text-[#2b160b]">
              Mapmoire
            </h1>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#8b2e16]">
              Est. 2026
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm font-bold uppercase tracking-widest text-[#4b260f] md:flex">
            <a href="/capsules" className="hover:text-[#8b2e16] hover:underline decoration-2 underline-offset-4">Capsules</a>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-4 md:flex">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="font-bold uppercase tracking-widest text-[#4b260f] hover:text-[#8b2e16]">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <div className="inline-block">
                  <RetroButton variant="primary">Start Mapping</RetroButton>
                </div>
              </SignUpButton>
            </>
          ) : (
            <div className="h-10 w-10 overflow-hidden rounded-full border-3 border-[#4b260f] bg-[#fff3dc] shadow-[2px_2px_0_#4b260f]">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-full h-full"
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="grid h-12 w-12 place-items-center border-3 border-[#4b260f] bg-[#fff3dc] shadow-[4px_4px_0_#4b260f] md:hidden"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6 text-[#4b260f]" /> : <Menu className="h-6 w-6 text-[#4b260f]" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t-4 border-[#4b260f] bg-[#fff3dc] md:hidden"
          >
            <nav className="flex flex-col items-center gap-6 py-8 font-bold uppercase tracking-widest text-[#4b260f]">
              <a href="/capsules" className="hover:text-[#8b2e16] hover:underline decoration-2 underline-offset-4">Capsules</a>
              
              {!isSignedIn ? (
                <div className="flex w-full flex-col items-center gap-4 border-t-2 border-[#4b260f]/20 pt-6">
                  <SignInButton mode="modal">
                    <button className="hover:text-[#8b2e16]">Sign In</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <div className="inline-block">
                      <RetroButton variant="primary">Start Mapping</RetroButton>
                    </div>
                  </SignUpButton>
                </div>
              ) : (
                <div className="flex w-full justify-center border-t-2 border-[#4b260f]/20 pt-6">
                  <div className="h-12 w-12 overflow-hidden rounded-full border-3 border-[#4b260f] bg-[#fff3dc] shadow-[2px_2px_0_#4b260f]">
                    <UserButton 
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-full h-full"
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Marquee() {
  return (
    <div className="flex overflow-hidden border-b-4 border-t-4 border-[#4b260f] bg-[#8b2e16] py-3 text-[#fff3dc]">
      <div className="animate-marquee flex whitespace-nowrap text-sm font-black uppercase tracking-[0.2em]">
        <span className="mx-4">✦ THE STORY-FIRST TRAVEL MAP</span>
        <span className="mx-4">✦ NO ALGORITHMS, JUST MEMORIES</span>
        <span className="mx-4">✦ YOUR PERSONAL ATLAS</span>
        <span className="mx-4">✦ THE STORY-FIRST TRAVEL MAP</span>
        <span className="mx-4">✦ NO ALGORITHMS, JUST MEMORIES</span>
        <span className="mx-4">✦ YOUR PERSONAL ATLAS</span>
      </div>
    </div>
  );
}

function HeroSection({ isTouring, onTour, onSearch, mapRef }: any) {
  return (
    <section className="relative overflow-hidden border-b-4 border-[#4b260f] px-6 py-20 lg:py-32">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4b260f_2px,transparent_2px)] [background-size:24px_24px]"></div>
      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
        
        {/* Left Copy */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 border-3 border-[#4b260f] bg-[#fff3dc] px-4 py-2 font-bold uppercase tracking-widest text-[#4b260f] shadow-[4px_4px_0_#4b260f]">
            <Ticket className="h-4 w-4" />
            <span>Admit One: Your Memories</span>
          </div>

          <h1 className="mapmoire-serif text-6xl font-black leading-[0.9] text-[#2b160b] md:text-8xl">
            Document<br />The <span className="text-[#8b2e16] italic">Journey.</span>
          </h1>
          
          <p className="max-w-md text-lg font-medium leading-relaxed text-[#5a3218]">
            Mapmoire turns every coordinate into a living capsule. Photos, moods, and hidden gems wrapped in a warm, cinematic vintage atlas.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <RetroButton variant="primary" onClick={onTour}>
              {isTouring ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isTouring ? "Touring..." : "Start Mini Tour"}
            </RetroButton>
          </div>

          {/* Search Box Retro Style */}
          <div className="mt-8 border-3 border-[#4b260f] bg-[#fff3dc] p-4 shadow-[6px_6px_0_#4b260f]">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-[#8b2e16]">Search Destination</p>
            <SearchPlace onSearch={onSearch} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-[500px] w-full border-4 border-[#4b260f] bg-[#4b260f] shadow-[12px_12px_0_#8b2e16]"
        >
          <div className="absolute -left-3 -top-3 h-6 w-6 border-4 border-[#4b260f] bg-[#fff3dc] z-20"></div>
          <div className="absolute -right-3 -top-3 h-6 w-6 border-4 border-[#4b260f] bg-[#fff3dc] z-20"></div>
          <div className="absolute -left-3 -bottom-3 h-6 w-6 border-4 border-[#4b260f] bg-[#fff3dc] z-20"></div>
          <div className="absolute -right-3 -bottom-3 h-6 w-6 border-4 border-[#4b260f] bg-[#fff3dc] z-20"></div>

          {/* Map Container */}
          <div className="relative h-full w-full overflow-hidden bg-[#d9b272]">
            <div ref={mapRef} className="absolute inset-0 h-full w-full" />
            <VintageMapFilter />
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    { icon: <Camera />, title: "Visual Capsules", text: "Attach polaroid-style memories to exact coordinates. No infinite scrolling, just locations." },
    { icon: <Compass />, title: "Hidden Gems", text: "Log the unmapped diners, the quiet trails, and the specific park benches." },
    { icon: <BookOpen />, title: "Story Archive", text: "A tactile database of your life's routing. Review your footprint beautifully." },
  ];

  return (
    <section id="features" className="border-b-4 border-[#4b260f] bg-[#fff3dc] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 border-b-4 border-[#4b260f] pb-6">
          <h2 className="mapmoire-serif text-5xl font-black text-[#2b160b]">The Manifesto.</h2>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="group relative border-4 border-[#4b260f] bg-[#ead8b8] p-8 shadow-[8px_8px_0_#4b260f] transition-transform hover:-translate-y-2 hover:shadow-[12px_12px_0_#8b2e16]">
              <div className="mb-6 inline-grid h-16 w-16 place-items-center border-3 border-[#4b260f] bg-[#fff3dc] text-[#8b2e16] shadow-[4px_4px_0_#4b260f]">
                {f.icon}
              </div>
              <h3 className="mapmoire-serif mb-4 text-2xl font-black text-[#2b160b]">{f.title}</h3>
              <p className="font-medium leading-relaxed text-[#5a3218]">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="border-b-4 border-[#4b260f] bg-[#ead8b8] px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mapmoire-serif mb-12 text-5xl font-black text-[#2b160b]">How To Archive.</h2>
        
        <div className="space-y-8 text-left">
          {[
            { num: "01", title: "Pin a Coordinate", desc: "Search any location globally and drop a heavy vintage pin." },
            { num: "02", title: "Seal the Capsule", desc: "Upload the photos, set the mood tag, and write the story." },
            { num: "03", title: "Review the Canvas", desc: "Watch your blank map slowly fill with ticked boxes and personal routes." }
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-6 border-4 border-[#4b260f] bg-[#fff3dc] p-6 shadow-[6px_6px_0_#4b260f]">
              <div className="mapmoire-serif text-4xl font-black text-[#8b2e16]">{step.num}</div>
              <div>
                <h4 className="text-xl font-bold uppercase tracking-wider text-[#2b160b]">{step.title}</h4>
                <p className="mt-1 font-medium text-[#5a3218]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#2b160b] px-6 py-12 text-[#ead8b8]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row border-4 border-[#ead8b8] p-8">
        <div>
          <h2 className="mapmoire-serif text-3xl font-black">Mapmoire</h2>
          <p className="mt-2 text-sm uppercase tracking-widest text-[#c2a878]">The Analog Travel Log</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-2 border-[#ead8b8] text-[#ead8b8] hover:bg-[#ead8b8] hover:text-[#2b160b] rounded-none uppercase tracking-widest font-bold">
              Newsletter
          </Button>
        </div>
      </div>
    </footer>
  );
}

export function StoryMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<import("maplibre-gl").Map | null>(null);
  const markersRef = useRef<import("maplibre-gl").Marker[]>([]);
  const touristMarkersRef = useRef<import("maplibre-gl").Marker[]>([]);
  
  const [selectedPlace, setSelectedPlace] = useState<Place>(defaultPlaces[0]);
  const [isTouring, setIsTouring] = useState(false);
  const [completedCities, setCompletedCities] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (document.getElementById("mapmoire-css")) return;
    const style = document.createElement("style");
    style.id = "mapmoire-css";
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);

  const updateCompletedCityTicks = (map: import("maplibre-gl").Map, cities: string[]) => {
    const completedSet = cities.map((city) => city.toLowerCase().trim());
    const features = defaultPlaces
      .filter((place) => completedSet.includes(place.name.toLowerCase().trim()))
      .map((place) => ({
        type: "Feature" as const,
        properties: { name: place.name },
        geometry: { type: "Point" as const, coordinates: [place.coords[1], place.coords[0]] },
      }));

    const data = { type: "FeatureCollection" as const, features };

    if (map.getSource("completed-city-ticks")) {
      (map.getSource("completed-city-ticks") as any).setData(data);
      return;
    }

    map.addSource("completed-city-ticks", { type: "geojson", data });
    map.addLayer({
      id: "completed-city-ticks-layer",
      type: "symbol",
      source: "completed-city-ticks",
      layout: {
        "text-field": "✓",
        "text-size": 38,
        "text-offset": [0, -1.7],
        "text-anchor": "bottom",
      },
      paint: {
        "text-color": "#8b2e16",
        "text-halo-color": "#fff3dc",
        "text-halo-width": 3,
      },
    });
  };

  useEffect(() => {
    async function loadCompletedCities() {
      const res = await fetch("/api/capsules");
      if (!res.ok) return;
      const data = await res.json();
      const cities = [...new Set(data.map((item: any) => item.placeName))] as string[];
      setCompletedCities(cities);
    }
    loadCompletedCities();
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    updateCompletedCityTicks(mapInstanceRef.current, completedCities);
    markersRef.current.forEach((marker) => {
      const el = marker.getElement() as any;
      el.updateMarker?.();
    });
  }, [completedCities]);

  // Vintage Style Application
  const styleMapLayers = (map: import("maplibre-gl").Map) => {
    const layers = map.getStyle().layers || [];
    layers.forEach((layer) => {
      const id = layer.id.toLowerCase();
      try {
        if (id.includes("water") || id.includes("river")) {
          if (layer.type === "fill") map.setPaintProperty(layer.id, "fill-color", "#968369");
          if (layer.type === "line") map.setPaintProperty(layer.id, "line-color", "#8c795d");
        }
        if (id.includes("boundary") || id.includes("admin")) {
          if (layer.type === "line") map.setPaintProperty(layer.id, "line-color", "#4b260f");
        }
        if (id.includes("land") || id.includes("background")) {
          if (layer.type === "background") map.setPaintProperty(layer.id, "background-color", "#ddc89b");
          if (layer.type === "fill") map.setPaintProperty(layer.id, "fill-color", "#dcc79b");
        }
      } catch {}
    });
  };

  const addEmojiMarkers = (maplibregl: MapLibre, map: import("maplibre-gl").Map) => {
    defaultPlaces.slice(0, 18).forEach((place) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "mapmoire-city-marker";

      const updateMarker = () => {
        const completed = completedCities.map((c) => c.toLowerCase().trim()).includes(place.name.toLowerCase().trim());
        el.innerHTML = `
          <div class="marker-wrap">
            <svg class="marker-pin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${completed ? `<span class="bucket-check">✓</span>` : ""}
          </div>
        `;
      };

      updateMarker();
      (el as any).updateMarker = updateMarker;

      el.onclick = () => {
        setSelectedPlace(place);
        setPanelOpen(true);
        map.flyTo({ center: [place.coords[1], place.coords[0]], zoom: 11, pitch: 60, duration: 1600 });
      };

      const popup = new maplibregl.Popup({ offset: 28, closeButton: false, className: "mapmoire-popup" })
        .setHTML(`<div><strong>${place.name}</strong><p>${place.state}</p></div>`);

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([place.coords[1], place.coords[0]])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    async function loadMap() {
      const maplibregl: MapLibre = await import("maplibre-gl");
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = new maplibregl.Map({
        container: mapRef.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: [78.6569, 22.9734],
        zoom: 4.5,
        pitch: 45,
        attributionControl: false,
        interactive: true,
      });

      mapInstanceRef.current = map;

      map.on("load", () => {
        updateCompletedCityTicks(map, completedCities);
        styleMapLayers(map);
        addEmojiMarkers(maplibregl, map);
      });
    }

    loadMap();

    return () => {
      markersRef.current.forEach((m) => m.remove());
      touristMarkersRef.current.forEach((m) => m.remove());
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleSearch = async (placeName: string) => {
    if (!placeName.trim() || !mapInstanceRef.current) return;
    
    // 1. First, try to find it in the curated local default places
    const localMatch = defaultPlaces.find((p) => p.name.toLowerCase().includes(placeName.toLowerCase()));
    
    if (localMatch) {
      setSelectedPlace(localMatch);
      setPanelOpen(true);
      mapInstanceRef.current.flyTo({ center: [localMatch.coords[1], localMatch.coords[0]], zoom: 11, duration: 1500 });
      return;
    }

    // 2. If not found locally, use a global Geocoding API to find ANY city worldwide
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`);
      const data = await res.json();

      if (data && data.length > 0) {
        const hit = data[0];
        const lat = parseFloat(hit.lat);
        const lon = parseFloat(hit.lon);

        // Create a temporary place object dynamically
       // Create a temporary place object dynamically
        const newPlace: Place = {
          id: hit.place_id.toString(),
          name: hit.name || placeName.split(',')[0],
          state: hit.display_name.split(',').slice(1, 3).join(',').trim() || "Global Coordinate",
          coords: [lat, lon], 
          image: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&q=80&w=1000", 
          mood: "Uncharted",
          story: "A new coordinate waiting to be archived. Drop your memories here.",
          // Add these missing properties to satisfy TypeScript:
          emoji: "📍", 
          spots: [] 
        };

        setSelectedPlace(newPlace);
        setPanelOpen(true);
        // Maplibre expects [longitude, latitude] for center
        mapInstanceRef.current.flyTo({ center: [lon, lat], zoom: 11, duration: 1500 });
      } else {
        alert("Coordinate not found in the global atlas. Try another name.");
      }
    } catch (error) {
      console.error("Geocoding failed", error);
      alert("Navigation systems down. Please try again later.");
    }
  };

  const startMiniTour = async () => {
    if (!mapInstanceRef.current) return;
    setIsTouring(true);
    for (const place of defaultPlaces.slice(0, 4)) {
      setSelectedPlace(place);
      mapInstanceRef.current.flyTo({ center: [place.coords[1], place.coords[0]], zoom: 10.6, pitch: 60, duration: 1600 });
      await new Promise((res) => setTimeout(res, 2500));
    }
    setIsTouring(false);
  };

  return (
    <main className="mapmoire-page min-h-screen">
      <Navbar />
      <Marquee />
      
      <HeroSection 
        isTouring={isTouring} 
        onTour={startMiniTour} 
        onSearch={handleSearch} 
        mapRef={mapRef} 
      />

      <FeatureGrid />
      <HowItWorks />
      <Footer />

      {/* Retro Side Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed bottom-0 right-0 top-0 z-[60] w-full max-w-md border-l-4 border-[#4b260f] bg-[#fff3dc] shadow-[-8px_0_0_rgba(75,38,15,0.2)] sm:w-[450px]"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b-4 border-[#4b260f] bg-[#ead8b8] p-6">
              <h2 className="mapmoire-serif text-2xl font-black text-[#2b160b]">{selectedPlace.name}</h2>
              <button onClick={() => setPanelOpen(false)} className="grid h-10 w-10 place-items-center border-3 border-[#4b260f] bg-[#fff3dc] shadow-[2px_2px_0_#4b260f] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                <ChevronRight className="h-6 w-6 text-[#4b260f]" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="h-full overflow-y-auto p-6 pb-24">
              {/* Polaroid Image Frame */}
              <div className="mb-6 border-4 border-[#4b260f] bg-white p-4 pb-12 shadow-[6px_6px_0_#4b260f]">
                <div 
                  className="h-48 w-full border-2 border-[#4b260f] bg-cover bg-center"
                  style={{ backgroundImage: `url(${selectedPlace.image})` }}
                />
                <p className="mt-4 text-center font-bold uppercase tracking-widest text-[#4b260f]">
                  {selectedPlace.state}
                </p>
              </div>
              
              <div className="mb-4 inline-block border-2 border-[#4b260f] bg-[#e4c48a] px-3 py-1 font-bold uppercase tracking-wider text-[#4b260f]">
                {selectedPlace.mood}
              </div>

              <div className="mb-8 border-4 border-[#4b260f] bg-[#ead8b8] p-4 text-sm font-medium leading-relaxed text-[#5a3218]">
                {selectedPlace.story}
              </div>
              
              <div className="border-t-4 border-[#4b260f] pt-8">
                 <StoryCapsule place={selectedPlace} onCapsuleAdded={(city) => {
                    setCompletedCities((prev) => prev.includes(city) ? prev : [...prev, city]);
                 }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}