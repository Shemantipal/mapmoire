export type Track = {
  id: string;
  name: string;
  artist: string;
  image: string;
  spotifyUrl: string;
  previewUrl: string | null;
};

export type DbCapsule = {
  id: string;
  placeName: string;
  state: string | null;
  lat: number | null;
  lng: number | null;
  caption: string | null;
  quote: string | null;
  songTitle: string | null;
  artist: string | null;
  spotifyUrl: string | null;
  previewUrl: string | null;
   mood: string | null;    
  albumArt: string | null;
  images: string[];
  createdAt: string;
};

export const MOOD_TAGS = [
  { emoji: "🌅", label: "Peaceful" },
  { emoji: "⚡", label: "Electric" },
  { emoji: "🌧️", label: "Melancholy" },
  { emoji: "🔥", label: "Alive" },
  { emoji: "🌊", label: "Free" },
  { emoji: "🌙", label: "Dreamy" },
  { emoji: "🎉", label: "Joyful" },
  { emoji: "🤍", label: "Tender" },
] as const;

export type MoodTag = (typeof MOOD_TAGS)[number];