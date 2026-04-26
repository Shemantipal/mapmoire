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
            map.setPaintProperty(layer.id, "fill-color", "#38bdf8");
            map.setPaintProperty(layer.id, "fill-opacity", 0.95);
          }
          if (layer.type === "line") {
            map.setPaintProperty(layer.id, "line-color", "#00bfff");
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
    <section className="relative overflow-hidden bg-zinc-950" style={{ height: "calc(100vh - 64px)" }}>
      {/* ── MAP ── */}
      <div ref={mapRef} className="absolute inset-0 h-full w-full" />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-[5]"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(2,6,23,0.55) 100%)" }} />

      {/* ── TOP HUD BAR ── */}
      <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2 flex items-center gap-3">
        {/* Brand pill */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/90 px-4 py-2 shadow-xl backdrop-blur-xl">
          <Map className="h-4 w-4 text-pink-400" />
          <span className="text-sm font-bold tracking-widest text-white uppercase">Mapmoire</span>
        </div>

        {/* XP badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-yellow-400/20 bg-zinc-900/90 px-3 py-2 shadow-xl backdrop-blur-xl">
          <Zap className="h-3.5 w-3.5 text-yellow-400" />
          <span className="text-xs font-bold text-yellow-300">+25 XP / Capsule</span>
        </div>

        {/* Completed counter */}
        <div className="flex items-center gap-1.5 rounded-full border border-pink-400/20 bg-zinc-900/90 px-3 py-2 shadow-xl backdrop-blur-xl">
          <span className="text-xs font-bold text-pink-300">
            {completedCities.length} / {defaultPlaces.length} visited
          </span>
        </div>
      </div>

      {/* ── TOP-LEFT CONTROLS ── */}
      <div className="absolute left-4 top-20 z-20 flex flex-col gap-2">
        {/* Search toggle */}
        <button
          onClick={() => setSearchOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/90 text-white shadow-xl backdrop-blur-xl transition hover:bg-zinc-800"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Tour button */}
        <button
          onClick={startMiniTour}
          disabled={isTouring}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-pink-500/30 bg-pink-600/80 text-white shadow-xl backdrop-blur-xl transition hover:bg-pink-500 disabled:opacity-50"
        >
          {isTouring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        {/* Compass */}
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/90 text-white shadow-xl backdrop-blur-xl">
          <Compass className="h-4 w-4 text-sky-400" />
        </div>
      </div>

      {/* ── SEARCH DROPDOWN ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-16 top-20 z-30 w-72 rounded-2xl border border-white/10 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-2xl"
          >
            <SearchPlace onSearch={(q) => { handleSearch(q); setSearchOpen(false); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BOTTOM HUD: place info tab ── */}
      {/* Collapsed trigger chip */}
      <AnimatePresence>
        {!panelOpen && (
          <motion.button
            key="chip"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setPanelOpen(true)}
            className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex items-center gap-3 rounded-full border border-white/10 bg-zinc-900/95 px-5 py-3 shadow-2xl backdrop-blur-xl transition hover:bg-zinc-800"
          >
            <span className="text-lg">{selectedPlace.emoji}</span>
            <span className="text-sm font-semibold text-white">{selectedPlace.name}</span>
            <span className="rounded-full bg-pink-600/20 px-2 py-0.5 text-xs text-pink-300">{selectedPlace.mood}</span>
            <ChevronRight className="h-4 w-4 rotate-90 text-zinc-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── EXPANDED SIDE PANEL ── */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="absolute bottom-0 left-0 top-0 z-30 flex w-[340px] flex-col overflow-hidden border-r border-white/8 bg-zinc-950/95 shadow-2xl backdrop-blur-2xl"
          >
            {/* Panel header */}
            <div className="relative flex-shrink-0">
              {/* Cover image */}
              <div
                className="h-40 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedPlace.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

              {/* Close */}
              <button
                onClick={() => setPanelOpen(false)}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Place name overlay */}
              <div className="absolute bottom-3 left-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedPlace.emoji}</span>
                  <div>
                    <h2 className="text-xl font-black text-white leading-tight">{selectedPlace.name}</h2>
                    <p className="text-xs text-zinc-400">{selectedPlace.state}</p>
                  </div>
                </div>
              </div>

              {/* Mood badge */}
              <div className="absolute right-3 bottom-3">
                <span className="rounded-full border border-pink-500/30 bg-pink-900/50 px-2.5 py-1 text-xs font-semibold text-pink-300">
                  {selectedPlace.mood}
                </span>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
              {/* Story snippet */}
              <p className="text-sm leading-relaxed text-zinc-400">{selectedPlace.story}</p>

              {/* Quick stats row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Spots", value: selectedPlace.spots?.length ?? 0, icon: "📍" },
                  { label: "Status", value: completedCities.includes(selectedPlace.name) ? "Done ✓" : "Pending", icon: "🎯" },
                  { label: "XP", value: "+25", icon: "⚡" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center rounded-xl border border-white/5 bg-white/4 py-3">
                    <span className="text-lg">{stat.icon}</span>
                    <span className="mt-1 text-xs font-bold text-white">{stat.value}</span>
                    <span className="text-[10px] text-zinc-500">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Place story card */}
              <PlaceStoryCard place={selectedPlace} />

              {/* Capsule */}
              <StoryCapsule
                place={selectedPlace}
                onCapsuleAdded={(cityName) => {
                  setCompletedCities((prev) =>
                    prev.includes(cityName) ? prev : [...prev, cityName]
                  );
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LEGEND chip (bottom-right, won't overlap nav controls) ── */}
      <div className="absolute bottom-20 right-4 z-20 hidden rounded-2xl border border-white/8 bg-zinc-900/90 p-3 shadow-xl backdrop-blur-xl lg:block">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Legend</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-5 rounded-full bg-pink-500" />
            <span className="text-[11px] text-zinc-300">Memory route</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-5 rounded-full bg-sky-400" />
            <span className="text-[11px] text-zinc-300">Rivers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">✓</span>
            <span className="text-[11px] text-zinc-300">Visited city</span>
          </div>
        </div>
      </div>
    </section>
  );
}