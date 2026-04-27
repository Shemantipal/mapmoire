"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

import { motion, AnimatePresence } from "framer-motion";
import { Compass, Map, Zap, ChevronRight, X, Search, Play, Pause } from "lucide-react";
import {
  fetchNearbyTouristPlaces,
  type TouristPlace,
} from "./tourist-places";

import { createThreeMemoryLayer } from "./three-memory-layer";
import { StoryCapsule } from "./StoryCapsule";
import { JourneyReplayButton } from "./JourneyReplayButton";
import { SearchPlace } from "./SearchPlace";
import { PlaceStoryCard } from "./PlaceStoryCard";
import { defaultPlaces, type Place } from "./map-data";

type MapLibre = typeof import("maplibre-gl");

export function StoryMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<import("maplibre-gl").Map | null>(null);
  const markersRef = useRef<import("maplibre-gl").Marker[]>([]);
  const touristMarkersRef = useRef<import("maplibre-gl").Marker[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<Place>(defaultPlaces[0]);
  const [isTouring, setIsTouring] = useState(false);
  const [completedCities, setCompletedCities] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  /* ─────────────────────────── marker helpers ─────────────────────────── */

  const renderCityMarkerHTML = (place: Place, completed: string[]) => {
    const isCompleted = completed.includes(place.name);
    return `
      <span class="mapmoire-city-glow"></span>
      <span class="mapmoire-city-emoji">${place.emoji}</span>
      ${isCompleted ? `<span class="bucket-check">✓</span>` : ""}
    `;
  };

  useEffect(() => {
    markersRef.current.forEach((marker) => {
      const el = marker.getElement() as any;
      if (el.updateMarker) el.updateMarker();
    });
  }, [completedCities]);

  const updateCompletedCityTicks = (
    map: import("maplibre-gl").Map,
    cities: string[]
  ) => {
    const completedSet = cities.map((c) => c.toLowerCase().trim());
    const features = defaultPlaces
      .filter((place) => completedSet.includes(place.name.toLowerCase().trim()))
      .map((place) => ({
        type: "Feature" as const,
        properties: { name: place.name },
        geometry: {
          type: "Point" as const,
          coordinates: [place.coords[1], place.coords[0]],
        },
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
        "text-size": 44,
        "text-offset": [0, -1.7],
        "text-anchor": "bottom",
        "text-allow-overlap": true,
        "text-ignore-placement": true,
      },
      paint: {
        "text-color": "#ff2d9c",
        "text-halo-color": "#ffffff",
        "text-halo-width": 3,
        "text-halo-blur": 0.5,
      },
    });
  };

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    updateCompletedCityTicks(mapInstanceRef.current, completedCities);
  }, [completedCities]);

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

  /* ─────────────────────────── animated water ─────────────────────────── */

  const startOceanAnimation = (map: import("maplibre-gl").Map) => {
    let tick = 0;

    const animate = () => {
      tick += 0.012;

      // Animate ocean color between deep teal and bioluminescent cyan
      const r1 = Math.round(10 + Math.sin(tick * 0.7) * 6);
      const g1 = Math.round(100 + Math.sin(tick * 0.5) * 22);
      const b1 = Math.round(180 + Math.sin(tick * 0.9) * 30);

      const r2 = Math.round(0 + Math.sin(tick * 0.4) * 8);
      const g2 = Math.round(180 + Math.cos(tick * 0.6) * 28);
      const b2 = Math.round(220 + Math.sin(tick * 1.1) * 20);

      const oceanColor = `rgb(${r1},${g1},${b1})`;
      const riverColor = `rgb(${r2},${g2},${b2})`;

      // Pulse opacity for shimmer effect
      const shimmerOpacity = 0.88 + Math.sin(tick * 1.8) * 0.1;
      const riverOpacity = 0.92 + Math.sin(tick * 2.2) * 0.07;

      // Animate river line width for flow feeling
      const riverWidth = 3.5 + Math.sin(tick * 1.5) * 0.8;

      const style = map.getStyle();
      if (!style?.layers) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      style.layers.forEach((layer) => {
        const id = layer.id.toLowerCase();
        try {
          if (id.includes("water") || id.includes("ocean") || id.includes("sea") || id.includes("lake")) {
            if (layer.type === "fill") {
              map.setPaintProperty(layer.id, "fill-color", oceanColor);
              map.setPaintProperty(layer.id, "fill-opacity", shimmerOpacity);
            }
            if (layer.type === "line") {
              map.setPaintProperty(layer.id, "line-color", riverColor);
              map.setPaintProperty(layer.id, "line-width", riverWidth);
              map.setPaintProperty(layer.id, "line-opacity", riverOpacity);
            }
          }
          if (id.includes("river") || id.includes("stream") || id.includes("canal")) {
            if (layer.type === "line") {
              map.setPaintProperty(layer.id, "line-color", riverColor);
              map.setPaintProperty(layer.id, "line-width", riverWidth * 0.85);
              map.setPaintProperty(layer.id, "line-opacity", riverOpacity);
            }
          }
        } catch {
          // ignore layers that don't support these properties
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  /* ─────────────────────────── map init ─────────────────────────── */

  useEffect(() => {
    async function loadMap() {
      const maplibregl: MapLibre = await import("maplibre-gl");
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = new maplibregl.Map({
        container: mapRef.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: [78.6569, 22.9734],
        zoom: 5,
        pitch: 45,
        maxPitch: 70,
        bearing: -12,
        attributionControl: false,
        canvasContextAttributes: { antialias: true },
      });

      mapInstanceRef.current = map;

      map.addControl(
        new maplibregl.NavigationControl({ visualizePitch: true }),
        "bottom-right"
      );

      map.on("load", () => {
        updateCompletedCityTicks(map, completedCities);
        add3DTerrain(map, maplibregl);
        styleMapLayers(map);
        addRouteLayer(map);
        addEmojiMarkers(maplibregl, map);
        startOceanAnimation(map);

        if (!map.getLayer("rishikesh-memory-crystal")) {
          map.addLayer(
            createThreeMemoryLayer({
              id: "rishikesh-memory-crystal",
              lng: 78.2676,
              lat: 30.0869,
              altitude: 65000,
              color: "#ec4899",
            })
          );
        }

        loadTouristPlaces(defaultPlaces[0]);
      });
    }

    loadMap();

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      touristMarkersRef.current.forEach((m) => m.remove());
      touristMarkersRef.current = [];
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  /* ─────────────────────────── tourist places ─────────────────────────── */

  const loadTouristPlaces = async (place: Place) => {
    if (!mapInstanceRef.current) return;
    const maplibregl = await import("maplibre-gl");
    const map = mapInstanceRef.current;

    touristMarkersRef.current.forEach((m) => m.remove());
    touristMarkersRef.current = [];

    const places = await fetchNearbyTouristPlaces({
      cityName: place.name,
      lat: place.coords[0],
      lng: place.coords[1],
    });

    places.forEach((spot: TouristPlace) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "tourist-marker";
      el.innerHTML = `<span>${spot.emoji}</span>`;

      const popup = new maplibregl.Popup({
        offset: 20,
        closeButton: false,
        className: "mapmoire-popup",
      }).setHTML(`
        <div>
          <strong>${spot.emoji} ${spot.name}</strong>
          <p>${spot.type}</p>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([spot.coords[1], spot.coords[0]])
        .setPopup(popup)
        .addTo(map);

      touristMarkersRef.current.push(marker);
    });
  };

  /* ─────────────────────────── map helpers ─────────────────────────── */

  const add3DTerrain = (map: import("maplibre-gl").Map, maplibregl: MapLibre) => {
    if (!map.getSource("terrainSource")) {
      map.addSource("terrainSource", {
        type: "raster-dem",
        tiles: ["https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png"],
        encoding: "terrarium",
        tileSize: 256,
      });
    }
    if (!map.getSource("hillshadeSource")) {
      map.addSource("hillshadeSource", {
        type: "raster-dem",
        tiles: ["https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png"],
        encoding: "terrarium",
        tileSize: 256,
      });
    }
    if (!map.getLayer("hillshade")) {
      map.addLayer({
        id: "hillshade",
        type: "hillshade",
        source: "hillshadeSource",
        paint: {
          "hillshade-method": "standard",
          "hillshade-illumination-direction": 315,
          "hillshade-shadow-color": "#020617",
          "hillshade-highlight-color": "#ffffff",
          "hillshade-accent-color": "#22c55e",
          "hillshade-exaggeration": 0.55,
        },
      });
    }
    map.setTerrain({ source: "terrainSource", exaggeration: 0.8 });
    map.addControl(
      new maplibregl.TerrainControl({ source: "terrainSource", exaggeration: 0.8 }),
      "bottom-right"
    );
  };

  const styleMapLayers = (map: import("maplibre-gl").Map) => {
    const layers = map.getStyle().layers || [];
    layers.forEach((layer) => {
      const id = layer.id.toLowerCase();
      try {
        if (id.includes("water") || id.includes("river")) {
          if (layer.type === "fill") {
            map.setPaintProperty(layer.id, "fill-color", "#0a64b4");
            map.setPaintProperty(layer.id, "fill-opacity", 0.96);
          }
          if (layer.type === "line") {
            map.setPaintProperty(layer.id, "line-color", "#00e5ff");
            map.setPaintProperty(layer.id, "line-width", 4);
            map.setPaintProperty(layer.id, "line-opacity", 1);
          }
        }
        if (id.includes("boundary") || id.includes("border") || id.includes("admin")) {
          if (layer.type === "line") {
            map.setPaintProperty(layer.id, "line-color", "#020617");
            map.setPaintProperty(layer.id, "line-width", 1.8);
            map.setPaintProperty(layer.id, "line-opacity", 0.95);
          }
        }
        if (id.includes("land") || id.includes("background")) {
          if (layer.type === "background") map.setPaintProperty(layer.id, "background-color", "#e9f5d8");
          if (layer.type === "fill") map.setPaintProperty(layer.id, "fill-color", "#dcfce7");
        }
        if (id.includes("road") && layer.type === "line") {
          map.setPaintProperty(layer.id, "line-color", "#f8fafc");
          map.setPaintProperty(layer.id, "line-opacity", 0.5);
        }
      } catch {}
    });
  };

  const addRouteLayer = (map: import("maplibre-gl").Map) => {
    if (map.getSource("memory-route")) return;
    const coordinates = defaultPlaces.slice(0, 10).map((p) => [p.coords[1], p.coords[0]]);
    map.addSource("memory-route", {
      type: "geojson",
      data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates } },
    });
    map.addLayer({ id: "memory-route-glow", type: "line", source: "memory-route", paint: { "line-color": "#38bdf8", "line-width": 9, "line-opacity": 0.35, "line-blur": 4 } });
    map.addLayer({ id: "memory-route-main", type: "line", source: "memory-route", paint: { "line-color": "#ec4899", "line-width": 4, "line-opacity": 0.95, "line-dasharray": [2, 2] } });
  };

  const addEmojiMarkers = (maplibregl: MapLibre, map: import("maplibre-gl").Map) => {
    defaultPlaces.slice(0, 18).forEach((place) => {
      const el = document.createElement("button");
      el.type = "button";
      el.dataset.cityName = place.name;
      el.className = "mapmoire-city-marker";

      const updateMarker = () => {
        const completed = completedCities
          .map((c) => c.toLowerCase().trim())
          .includes(place.name.toLowerCase().trim());
        el.innerHTML = `
          <div class="marker-wrap">
            <span class="mapmoire-city-glow"></span>
            <span class="mapmoire-city-emoji">${place.emoji}</span>
            ${completed ? `<span class="bucket-check">✓</span>` : ""}
          </div>
        `;
      };

      updateMarker();
      (el as any).updateMarker = updateMarker;

      el.onclick = () => {
        setSelectedPlace(place);
        loadTouristPlaces(place);
        setPanelOpen(true);
        map.flyTo({
          center: [place.coords[1], place.coords[0]],
          zoom: 11.5,
          pitch: 68,
          bearing: -20,
          duration: 2200,
          essential: true,
        });
      };

      const popup = new maplibregl.Popup({
        offset: 28,
        closeButton: false,
        className: "mapmoire-popup",
      }).setHTML(`
        <div>
          <strong>${place.emoji} ${place.name}</strong>
          <p>${place.state}</p>
          <p>${place.mood}</p>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([place.coords[1], place.coords[0]])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  /* ─────────────────────────── search ─────────────────────────── */

  const handleSearch = async (placeName: string) => {
    if (!placeName.trim() || !mapInstanceRef.current) return;

    const localMatch = defaultPlaces.find((p) =>
      p.name.toLowerCase().includes(placeName.toLowerCase())
    );

    if (localMatch) {
      setSelectedPlace(localMatch);
      loadTouristPlaces(localMatch);
      setPanelOpen(true);
      mapInstanceRef.current.flyTo({
        center: [localMatch.coords[1], localMatch.coords[0]],
        zoom: 12,
        pitch: 70,
        bearing: -24,
        duration: 2400,
        essential: true,
      });
      return;
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`
    );
    const data = await response.json();
    if (!data?.length) { alert("Place not found"); return; }

    const result = data[0];
    const lat = Number(result.lat);
    const lon = Number(result.lon);

    const searchedPlace: Place = {
      name: result.display_name.split(",")[0],
      state: result.display_name.split(",")[1]?.trim() || "Unknown",
      coords: [lat, lon],
      mood: "Discovered",
      emoji: "📍",
      image: `https://source.unsplash.com/900x600/?${encodeURIComponent(result.display_name.split(",")[0])},travel`,
      story: `${result.display_name} is now pinned on your story map.`,
      spots: [],
    };

    setSelectedPlace(searchedPlace);
    loadTouristPlaces(searchedPlace);
    setPanelOpen(true);

    mapInstanceRef.current.flyTo({
      center: [lon, lat],
      zoom: 13.5,
      pitch: 72,
      bearing: -30,
      duration: 2600,
      essential: true,
    });
  };

  /* ─────────────────────────── tour ─────────────────────────── */

  const startMiniTour = async () => {
    if (!mapInstanceRef.current) return;
    setIsTouring(true);
    for (const place of defaultPlaces.slice(0, 5)) {
      setSelectedPlace(place);
      loadTouristPlaces(place);
      mapInstanceRef.current.flyTo({
        center: [place.coords[1], place.coords[0]],
        zoom: 11.7,
        pitch: 70,
        bearing: -25,
        duration: 2200,
        essential: true,
      });
      await new Promise((resolve) => setTimeout(resolve, 2800));
    }
    setIsTouring(false);
  };

  /* ─────────────────────────── render ─────────────────────────── */

  return (
  <section
    className="relative overflow-hidden bg-[#e8d7b7]"
    style={{ height: "calc(100vh - 64px)" }}
  >
    <div ref={mapRef} className="absolute inset-0 h-full w-full" />

    <div className="pointer-events-none absolute inset-0 z-[4] bg-[#e8d7b7]/10" />

    <div
      className="pointer-events-none absolute inset-0 z-[5]"
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 45%, rgba(43,22,11,0.38) 100%)",
      }}
    />

    {/* TOP LANDING BAR */}
   <div className="absolute right-6 top-6 z-20 w-[min(46vw,620px)]">
      <div className="overflow-hidden rounded-[1.35rem] border-2 border-[#4f2a12] bg-[#f3dfb9]/95 shadow-[5px_5px_0_#8b2e16] backdrop-blur-xl">
        <div className="border-b border-[#7b4b24]/25 bg-[#d9bd8d] px-5 py-1.5 text-center">
          <p className="font-serif text-[9px] uppercase tracking-[.35em] text-[#5a3218]">
            ✦ Mapmoire Story Map ✦ Build your travel archive ✦
          </p>
        </div>

       <div className="space-y-3 p-4">
          <div>
           <h1 className="font-serif text-2xl font-black leading-none text-[#2b160b] md:text-3xl">
              Pin places. Save{" "}
              <span className="text-[#8b2e16]">story capsules.</span>
            </h1>

            <p className="mt-2 max-w-xl font-serif text-sm italic text-[#5a3218]">
              Search any place, open its travel card, and seal your memory with
              photos, songs, moods and hidden gems.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#7b4b24]/35 bg-[#fff3dc] px-3 py-1 font-serif text-[11px] text-[#4b260f]">
                ⚓ {completedCities.length}/{defaultPlaces.length} visited
              </span>
              <span className="rounded-full border border-[#7b4b24]/35 bg-[#fff3dc] px-3 py-1 font-serif text-[11px] text-[#4b260f]">
                ⚡ +25 XP per capsule
              </span>
              <button
                onClick={startMiniTour}
                disabled={isTouring}
                className="rounded-full border border-[#8b2e16]/35 bg-[#8b2e16] px-3 py-1 font-serif text-[11px] font-black uppercase tracking-widest text-[#fff3dc] hover:bg-[#c23a16] disabled:opacity-50"
              >
                {isTouring ? "Touring..." : "Play mini tour"}
              </button>
            </div>
          </div>

         <div className="rounded-2xl border border-[#7b4b24]/30 bg-[#fff3dc]/90 p-2">
            <SearchPlace
              onSearch={(q) => {
                handleSearch(q);
                setSearchOpen(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* FLOATING SELECTED PLACE CHIP */}
    <AnimatePresence>
      {!panelOpen && (
        <motion.button
          key="chip"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          onClick={() => setPanelOpen(true)}
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border-2 border-[#4f2a12] bg-[#f3dfb9]/95 px-5 py-3 shadow-[4px_4px_0_#8b2e16] backdrop-blur-xl"
        >
          <span className="text-xl">{selectedPlace.emoji}</span>
          <span className="font-serif text-sm font-black text-[#2b160b]">
            {selectedPlace.name}
          </span>
          <span className="rounded-full bg-[#8b2e16]/10 px-2 py-0.5 font-serif text-xs text-[#8b2e16]">
            {selectedPlace.mood}
          </span>
          <ChevronRight className="h-4 w-4 rotate-90 text-[#7b4b24]" />
        </motion.button>
      )}
    </AnimatePresence>

    {/* BEAUTIFUL WIDE PANEL */}
    <AnimatePresence>
      {panelOpen && (
        <motion.div
          key="panel"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: "spring", damping: 28, stiffness: 240 }}
   className="absolute bottom-6 left-6 top-24 z-30 flex w-[min(92vw,500px)] flex-col overflow-hidden rounded-[1.5rem] border-2 border-[#4f2a12] bg-[#f3dfb9]/96 shadow-[6px_6px_0_#8b2e16] backdrop-blur-2xl"
        >
          <div className="border-b border-[#7b4b24]/25 bg-[#d9bd8d] px-5 py-2 text-center">
            <p className="font-serif text-[9px] uppercase tracking-[.35em] text-[#5a3218]">
              ✦ Create Travel Memory ✦
            </p>
          </div>

          <div className="relative flex-shrink-0">
            <div
            className="h-36 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${selectedPlace.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b160b]/80 via-[#2b160b]/25 to-transparent" />

            <button
              onClick={() => setPanelOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#7b4b24]/40 bg-[#fff3dc]/90 text-[#4b260f] shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{selectedPlace.emoji}</span>
                  <div>
                    <h2 className="font-serif text-3xl font-black leading-none text-[#fff3dc]">
                      {selectedPlace.name}
                    </h2>
                    <p className="mt-1 font-serif text-xs uppercase tracking-widest text-[#f8ead0]/80">
                      {selectedPlace.state}
                    </p>
                  </div>
                </div>
              </div>

              <span className="rounded-full border border-[#fff3dc]/40 bg-[#fff3dc]/90 px-3 py-1 font-serif text-xs font-black text-[#8b2e16]">
                {selectedPlace.mood}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-[#7b4b24]/30 bg-[#fff3dc]/70 p-4">
                <p className="font-serif text-sm leading-relaxed text-[#5a3218]">
                  {selectedPlace.story}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "Spots",
                    value: selectedPlace.spots?.length ?? 0,
                    icon: "📍",
                  },
                  {
                    label: "Status",
                    value: completedCities.includes(selectedPlace.name)
                      ? "Done"
                      : "Pending",
                    icon: "🎯",
                  },
                  { label: "XP", value: "+25", icon: "⚡" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-[#7b4b24]/30 bg-[#ead7b5] p-3 text-center shadow-sm"
                  >
                    <span className="text-lg">{stat.icon}</span>
                    <p className="mt-1 font-serif text-sm font-black text-[#2b160b]">
                      {stat.value}
                    </p>
                    <p className="font-serif text-[9px] uppercase tracking-widest text-[#7b4b24]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#7b4b24]/30 bg-[#fff3dc]/70 p-3">
                <PlaceStoryCard place={selectedPlace} />
              </div>

             <div className="rounded-2xl border border-[#7b4b24]/30 bg-[#fff3dc]/70 p-3">
                <StoryCapsule
                  place={selectedPlace}
                  onCapsuleAdded={(cityName) => {
                    setCompletedCities((prev) =>
                      prev.includes(cityName) ? prev : [...prev, cityName]
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* LEGEND */}
<div
  className={`${
    panelOpen ? "hidden" : "hidden lg:block"
  } absolute bottom-6 right-5 z-20 rounded-2xl border-2 border-[#4f2a12]/60 bg-[#f3dfb9]/95 p-3 shadow-[4px_4px_0_#8b2e16] backdrop-blur-xl`}
>
      <p className="mb-2 font-serif text-[10px] font-black uppercase tracking-widest text-[#7b4b24]">
        Legend
      </p>
      <div className="flex flex-col gap-1.5 font-serif text-[11px] text-[#4b260f]">
        <span>🌸 Memory route</span>
        <span>🌊 Rivers</span>
        <span>✓ Visited city</span>
      </div>
    </div>
  </section>
);
}