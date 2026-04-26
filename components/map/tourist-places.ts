export type TouristPlaceType =
  | "attraction"
  | "museum"
  | "viewpoint"
  | "monument"
  | "fort"
  | "temple"
  | "park"
  | "beach"
  | "waterfall"
  | "zoo"
  | "unknown";

export type TouristPlace = {
  id: string;
  name: string;
  type: TouristPlaceType;
  emoji: string;
  coords: [number, number]; // [lat, lng]
  source: "local" | "overpass";
};

export const cityTouristPlaces: Record<string, TouristPlace[]> = {
  Delhi: [
    {
      id: "delhi-india-gate",
      name: "India Gate",
      type: "monument",
      emoji: "🏛️",
      coords: [28.6129, 77.2295],
      source: "local",
    },
    {
      id: "delhi-qutub-minar",
      name: "Qutub Minar",
      type: "monument",
      emoji: "🕌",
      coords: [28.5245, 77.1855],
      source: "local",
    },
    {
      id: "delhi-red-fort",
      name: "Red Fort",
      type: "fort",
      emoji: "🏰",
      coords: [28.6562, 77.241],
      source: "local",
    },
    {
      id: "delhi-lotus-temple",
      name: "Lotus Temple",
      type: "temple",
      emoji: "🛕",
      coords: [28.5535, 77.2588],
      source: "local",
    },
    {
      id: "delhi-humayun-tomb",
      name: "Humayun's Tomb",
      type: "monument",
      emoji: "🏛️",
      coords: [28.5933, 77.2507],
      source: "local",
    },
  ],

  Rishikesh: [
    {
      id: "rishikesh-lakshman-jhula",
      name: "Lakshman Jhula",
      type: "attraction",
      emoji: "🌉",
      coords: [30.1263, 78.3242],
      source: "local",
    },
    {
      id: "rishikesh-triveni-ghat",
      name: "Triveni Ghat",
      type: "attraction",
      emoji: "🪔",
      coords: [30.1034, 78.2948],
      source: "local",
    },
    {
      id: "rishikesh-beatles-ashram",
      name: "Beatles Ashram",
      type: "attraction",
      emoji: "🎨",
      coords: [30.1119, 78.3102],
      source: "local",
    },
    {
      id: "rishikesh-neer-waterfall",
      name: "Neer Garh Waterfall",
      type: "waterfall",
      emoji: "💦",
      coords: [30.147, 78.3229],
      source: "local",
    },
  ],

  Jaipur: [
    {
      id: "jaipur-hawa-mahal",
      name: "Hawa Mahal",
      type: "monument",
      emoji: "🏰",
      coords: [26.9239, 75.8267],
      source: "local",
    },
    {
      id: "jaipur-amber-fort",
      name: "Amber Fort",
      type: "fort",
      emoji: "🏯",
      coords: [26.9855, 75.8513],
      source: "local",
    },
    {
      id: "jaipur-jal-mahal",
      name: "Jal Mahal",
      type: "attraction",
      emoji: "🏞️",
      coords: [26.9534, 75.8463],
      source: "local",
    },
    {
      id: "jaipur-city-palace",
      name: "City Palace",
      type: "monument",
      emoji: "👑",
      coords: [26.9258, 75.8237],
      source: "local",
    },
  ],

  Mumbai: [
    {
      id: "mumbai-gateway",
      name: "Gateway of India",
      type: "monument",
      emoji: "🏛️",
      coords: [18.922, 72.8347],
      source: "local",
    },
    {
      id: "mumbai-marine-drive",
      name: "Marine Drive",
      type: "attraction",
      emoji: "🌊",
      coords: [18.9432, 72.8234],
      source: "local",
    },
    {
      id: "mumbai-elephanta",
      name: "Elephanta Caves",
      type: "monument",
      emoji: "⛰️",
      coords: [18.9633, 72.9315],
      source: "local",
    },
    {
      id: "mumbai-juhu",
      name: "Juhu Beach",
      type: "beach",
      emoji: "🏖️",
      coords: [19.0988, 72.8267],
      source: "local",
    },
  ],

  Kolkata: [
    {
      id: "kolkata-victoria",
      name: "Victoria Memorial",
      type: "monument",
      emoji: "🏛️",
      coords: [22.5448, 88.3426],
      source: "local",
    },
    {
      id: "kolkata-howrah",
      name: "Howrah Bridge",
      type: "attraction",
      emoji: "🌉",
      coords: [22.5851, 88.3468],
      source: "local",
    },
    {
      id: "kolkata-prinsep",
      name: "Prinsep Ghat",
      type: "attraction",
      emoji: "🌅",
      coords: [22.5564, 88.3317],
      source: "local",
    },
    {
      id: "kolkata-indian-museum",
      name: "Indian Museum",
      type: "museum",
      emoji: "🖼️",
      coords: [22.5579, 88.3511],
      source: "local",
    },
  ],

  Goa: [
    {
      id: "goa-baga",
      name: "Baga Beach",
      type: "beach",
      emoji: "🏖️",
      coords: [15.5553, 73.7517],
      source: "local",
    },
    {
      id: "goa-fort-aguada",
      name: "Fort Aguada",
      type: "fort",
      emoji: "🏰",
      coords: [15.492, 73.7732],
      source: "local",
    },
    {
      id: "goa-bom-jesus",
      name: "Basilica of Bom Jesus",
      type: "monument",
      emoji: "⛪",
      coords: [15.5009, 73.9116],
      source: "local",
    },
    {
      id: "goa-dudhsagar",
      name: "Dudhsagar Falls",
      type: "waterfall",
      emoji: "💦",
      coords: [15.3144, 74.3143],
      source: "local",
    },
  ],

  Bengaluru: [
    {
      id: "bengaluru-cubbon",
      name: "Cubbon Park",
      type: "park",
      emoji: "🌳",
      coords: [12.9763, 77.5929],
      source: "local",
    },
    {
      id: "bengaluru-palace",
      name: "Bangalore Palace",
      type: "monument",
      emoji: "🏰",
      coords: [12.9987, 77.592],
      source: "local",
    },
    {
      id: "bengaluru-lalbagh",
      name: "Lalbagh Botanical Garden",
      type: "park",
      emoji: "🌺",
      coords: [12.9507, 77.5848],
      source: "local",
    },
  ],

  Chennai: [
    {
      id: "chennai-marina",
      name: "Marina Beach",
      type: "beach",
      emoji: "🏖️",
      coords: [13.05, 80.2824],
      source: "local",
    },
    {
      id: "chennai-kapaleeshwarar",
      name: "Kapaleeshwarar Temple",
      type: "temple",
      emoji: "🛕",
      coords: [13.0337, 80.2699],
      source: "local",
    },
    {
      id: "chennai-santhome",
      name: "Santhome Basilica",
      type: "monument",
      emoji: "⛪",
      coords: [13.0339, 80.2774],
      source: "local",
    },
  ],

  Hyderabad: [
    {
      id: "hyderabad-charminar",
      name: "Charminar",
      type: "monument",
      emoji: "🕌",
      coords: [17.3616, 78.4747],
      source: "local",
    },
    {
      id: "hyderabad-golconda",
      name: "Golconda Fort",
      type: "fort",
      emoji: "🏰",
      coords: [17.3833, 78.4011],
      source: "local",
    },
    {
      id: "hyderabad-hussain-sagar",
      name: "Hussain Sagar",
      type: "attraction",
      emoji: "🌊",
      coords: [17.4239, 78.4738],
      source: "local",
    },
  ],

  Udaipur: [
    {
      id: "udaipur-pichola",
      name: "Lake Pichola",
      type: "attraction",
      emoji: "🚣",
      coords: [24.576, 73.6796],
      source: "local",
    },
    {
      id: "udaipur-city-palace",
      name: "City Palace",
      type: "monument",
      emoji: "👑",
      coords: [24.5765, 73.6835],
      source: "local",
    },
    {
      id: "udaipur-monsoon-palace",
      name: "Sajjangarh Palace",
      type: "viewpoint",
      emoji: "🌄",
      coords: [24.5939, 73.6396],
      source: "local",
    },
  ],
};

export function getLocalTouristPlaces(cityName: string) {
  return cityTouristPlaces[cityName] || [];
}

function getEmojiFromTags(tags: Record<string, string>): {
  emoji: string;
  type: TouristPlaceType;
} {
  if (tags.tourism === "museum") return { emoji: "🖼️", type: "museum" };
  if (tags.tourism === "viewpoint") return { emoji: "🌄", type: "viewpoint" };
  if (tags.tourism === "attraction") return { emoji: "📍", type: "attraction" };
  if (tags.historic === "monument" || tags.memorial)
    return { emoji: "🏛️", type: "monument" };
  if (tags.historic === "castle" || tags.historic === "fort")
    return { emoji: "🏰", type: "fort" };
  if (tags.amenity === "place_of_worship")
    return { emoji: "🛕", type: "temple" };
  if (tags.leisure === "park") return { emoji: "🌳", type: "park" };
  if (tags.natural === "beach") return { emoji: "🏖️", type: "beach" };
  if (tags.waterway === "waterfall" || tags.natural === "waterfall")
    return { emoji: "💦", type: "waterfall" };
  if (tags.tourism === "zoo") return { emoji: "🦁", type: "zoo" };

  return { emoji: "📍", type: "unknown" };
}

export async function fetchNearbyTouristPlaces({
  cityName,
  lat,
  lng,
  radius = 8000,
}: {
  cityName: string;
  lat: number;
  lng: number;
  radius?: number;
}): Promise<TouristPlace[]> {
  const localPlaces = getLocalTouristPlaces(cityName);

  const query = `
    [out:json][timeout:25];
    (
      node["tourism"~"attraction|museum|viewpoint|zoo"](${lat - 0.15},${lng - 0.15},${lat + 0.15},${lng + 0.15});
      node["historic"~"monument|castle|fort|memorial"](${lat - 0.15},${lng - 0.15},${lat + 0.15},${lng + 0.15});
      node["amenity"="place_of_worship"](${lat - 0.15},${lng - 0.15},${lat + 0.15},${lng + 0.15});
      node["leisure"="park"](${lat - 0.15},${lng - 0.15},${lat + 0.15},${lng + 0.15});
      node["natural"~"beach|waterfall"](${lat - 0.15},${lng - 0.15},${lat + 0.15},${lng + 0.15});
    );
    out center 30;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    if (!res.ok) return localPlaces;

    const data = await res.json();

    const overpassPlaces: TouristPlace[] = data.elements
      .filter((item: any) => item.tags?.name && item.lat && item.lon)
      .slice(0, 25)
      .map((item: any) => {
        const { emoji, type } = getEmojiFromTags(item.tags);

        return {
          id: `overpass-${item.id}`,
          name: item.tags.name,
          type,
          emoji,
          coords: [item.lat, item.lon],
          source: "overpass",
        };
      });

    const merged = [...localPlaces, ...overpassPlaces];

    const uniqueByName = new Map<string, TouristPlace>();

    merged.forEach((place) => {
      uniqueByName.set(place.name.toLowerCase(), place);
    });

    return Array.from(uniqueByName.values()).slice(0, 30);
  } catch (error) {
    console.error("Failed to fetch tourist places:", error);
    return localPlaces;
  }
}