export type Memory = {
  id: string;
  title: string;
  type: "note" | "voice" | "photo";
  text: string;
  time: string;
  image?: string;
};

export type Spot = {
  name: string;
  coords: [number, number];
  image: string;
  caption: string;
};

export type Place = {
  name: string;
  state: string;
  coords: [number, number];
  mood: string;
  emoji: string;
  image: string;
  story: string;
  spots: Spot[];
  memories?: Memory[];
};

export const defaultPlaces: Place[] = [
  {
    name: "Rishikesh",
    state: "Uttarakhand",
    coords: [30.0869, 78.2676],
    mood: "Peaceful",
    emoji: "🌊",
    image:
      "https://source.unsplash.com/900x600/?rishikesh,ganga,india",
    story:
      "Rishikesh feels like mountain silence, Ganga winds, yoga mornings, and bridge-side memories.",
    spots: [
      {
        name: "Lakshman Jhula",
        coords: [30.1263, 78.3242],
        image:
          "https://source.unsplash.com/900x600/?lakshman-jhula,rishikesh",
        caption: "A dreamy bridge over the Ganga with mountain air.",
      },
      {
        name: "Triveni Ghat",
        coords: [30.1034, 78.2948],
        image:
          "https://source.unsplash.com/900x600/?triveni-ghat,rishikesh",
        caption: "Evening aarti, lamps, river breeze, and peace.",
      },
      {
        name: "Beatles Ashram",
        coords: [30.1119, 78.3102],
        image:
          "https://source.unsplash.com/900x600/?beatles-ashram,rishikesh",
        caption: "Art, silence, ruins, and stories inside forest walls.",
      },
    ],
    memories: [
      {
        id: "rishikesh-1",
        title: "First Ganga View",
        type: "photo",
        text: "A soft little memory from the riverside.",
        time: "Today, 6:20 PM",
        image:
          "https://source.unsplash.com/900x600/?rishikesh,ganga",
      },
    ],
  },

  {
    name: "Delhi",
    state: "Delhi",
    coords: [28.6139, 77.209],
    mood: "Historic",
    emoji: "🏛️",
    image:
      "https://source.unsplash.com/900x600/?delhi,india-gate",
    story:
      "Delhi is a living timeline of forts, markets, food lanes, monuments, and endless city stories.",
    spots: [
      {
        name: "India Gate",
        coords: [28.6129, 77.2295],
        image:
          "https://source.unsplash.com/900x600/?india-gate,delhi",
        caption: "Wide roads, evening lights, and patriotic calm.",
      },
      {
        name: "Qutub Minar",
        coords: [28.5245, 77.1855],
        image:
          "https://source.unsplash.com/900x600/?qutub-minar,delhi",
        caption: "Stone carvings, history, and a sky-touching tower.",
      },
      {
        name: "Chandni Chowk",
        coords: [28.6506, 77.2303],
        image:
          "https://source.unsplash.com/900x600/?chandni-chowk,delhi",
        caption: "Food, chaos, old Delhi lanes, and endless flavour.",
      },
    ],
    memories: [
      {
        id: "delhi-1",
        title: "Old Delhi Walk",
        type: "note",
        text: "Crowded lanes, lights, food, and a city that never feels still.",
        time: "Yesterday, 8:15 PM",
        image:
          "https://source.unsplash.com/900x600/?old-delhi",
      },
    ],
  },

  {
    name: "Jaipur",
    state: "Rajasthan",
    coords: [26.9124, 75.7873],
    mood: "Royal",
    emoji: "🏰",
    image:
      "https://source.unsplash.com/900x600/?jaipur,palace",
    story:
      "Jaipur shines with pink walls, palaces, bazaars, and sunsets full of royal color.",
    spots: [
      {
        name: "Hawa Mahal",
        coords: [26.9239, 75.8267],
        image:
          "https://source.unsplash.com/900x600/?hawa-mahal,jaipur",
        caption: "Pink windows, royal stories, and dreamy architecture.",
      },
      {
        name: "Amber Fort",
        coords: [26.9855, 75.8513],
        image:
          "https://source.unsplash.com/900x600/?amber-fort,jaipur",
        caption: "Huge fort walls, royal halls, and golden sunset views.",
      },
      {
        name: "Jal Mahal",
        coords: [26.9534, 75.8463],
        image:
          "https://source.unsplash.com/900x600/?jal-mahal,jaipur",
        caption: "A palace floating quietly in the middle of water.",
      },
    ],
    memories: [
      {
        id: "jaipur-1",
        title: "Pink City Evening",
        type: "photo",
        text: "Everything looked softer under the Jaipur sunset.",
        time: "2 days ago",
        image:
          "https://source.unsplash.com/900x600/?jaipur,sunset",
      },
    ],
  },

  {
    name: "Goa",
    state: "Goa",
    coords: [15.2993, 74.124],
    mood: "Sunny",
    emoji: "🏖️",
    image:
      "https://source.unsplash.com/900x600/?goa,beach",
    story:
      "Goa is beaches, old churches, seafood, sunsets, music, and slow happy days.",
    spots: [
      {
        name: "Baga Beach",
        coords: [15.5553, 73.7517],
        image:
          "https://source.unsplash.com/900x600/?baga-beach,goa",
        caption: "Music, waves, cafes, and beach-night energy.",
      },
      {
        name: "Fort Aguada",
        coords: [15.492, 73.7732],
        image:
          "https://source.unsplash.com/900x600/?fort-aguada,goa",
        caption: "Sea views, old walls, and breezy coastal history.",
      },
      {
        name: "Basilica of Bom Jesus",
        coords: [15.5009, 73.9116],
        image:
          "https://source.unsplash.com/900x600/?bom-jesus,goa",
        caption: "Old Goa charm, quiet faith, and heritage beauty.",
      },
    ],
    memories: [
      {
        id: "goa-1",
        title: "Beach Sunset",
        type: "photo",
        text: "The kind of sunset that makes everything feel lighter.",
        time: "Last week",
        image:
          "https://source.unsplash.com/900x600/?goa,sunset",
      },
    ],
  },

  {
    name: "Kolkata",
    state: "West Bengal",
    coords: [22.5726, 88.3639],
    mood: "Poetic",
    emoji: "📚",
    image:
      "https://source.unsplash.com/900x600/?kolkata,howrah-bridge",
    story:
      "Kolkata feels like poetry, old trams, yellow taxis, river sunsets, and warm mishti memories.",
    spots: [
      {
        name: "Howrah Bridge",
        coords: [22.5851, 88.3468],
        image:
          "https://source.unsplash.com/900x600/?howrah-bridge,kolkata",
        caption: "A steel icon watching over the Hooghly forever.",
      },
      {
        name: "Victoria Memorial",
        coords: [22.5448, 88.3426],
        image:
          "https://source.unsplash.com/900x600/?victoria-memorial,kolkata",
        caption: "White marble, gardens, history, and old-world charm.",
      },
      {
        name: "Prinsep Ghat",
        coords: [22.5564, 88.3317],
        image:
          "https://source.unsplash.com/900x600/?prinsep-ghat,kolkata",
        caption: "River breeze, sunset walks, and dreamy evenings.",
      },
    ],
    memories: [
      {
        id: "kolkata-1",
        title: "Yellow Taxi Ride",
        type: "note",
        text: "A small ride through a city that feels like home.",
        time: "Memory saved",
        image:
          "https://source.unsplash.com/900x600/?yellow-taxi,kolkata",
      },
    ],
  },

  {
    name: "Mumbai",
    state: "Maharashtra",
    coords: [19.076, 72.8777],
    mood: "Dreamy",
    emoji: "🌆",
    image:
      "https://source.unsplash.com/900x600/?mumbai,marine-drive",
    story:
      "Mumbai moves with sea breeze, local trains, cinema dreams, and streets that never sleep.",
    spots: [
      {
        name: "Marine Drive",
        coords: [18.9432, 72.8234],
        image:
          "https://source.unsplash.com/900x600/?marine-drive,mumbai",
        caption: "Sea breeze, skyline lights, and late-night peace.",
      },
      {
        name: "Gateway of India",
        coords: [18.922, 72.8347],
        image:
          "https://source.unsplash.com/900x600/?gateway-of-india,mumbai",
        caption: "A grand sea-facing monument full of city stories.",
      },
      {
        name: "Bandra-Worli Sea Link",
        coords: [19.043, 72.817],
        image:
          "https://source.unsplash.com/900x600/?bandra-worli-sea-link",
        caption: "A cinematic bridge across the Arabian Sea.",
      },
    ],
    memories: [
      {
        id: "mumbai-1",
        title: "Marine Drive Night",
        type: "photo",
        text: "The city lights looked like scattered stars beside the sea.",
        time: "11:40 PM",
        image:
          "https://source.unsplash.com/900x600/?mumbai-night",
      },
    ],
  },

  {
    name: "Bengaluru",
    state: "Karnataka",
    coords: [12.9716, 77.5946],
    mood: "Modern",
    emoji: "💻",
    image:
      "https://source.unsplash.com/900x600/?bangalore,city",
    story:
      "Bengaluru blends tech parks, gardens, cafes, rain-washed roads, and youthful energy.",
    spots: [
      {
        name: "Cubbon Park",
        coords: [12.9763, 77.5929],
        image:
          "https://source.unsplash.com/900x600/?cubbon-park,bangalore",
        caption: "Green paths, calm mornings, and city silence.",
      },
      {
        name: "Bangalore Palace",
        coords: [12.9987, 77.592],
        image:
          "https://source.unsplash.com/900x600/?bangalore-palace",
        caption: "Royal architecture hidden inside a modern city.",
      },
      {
        name: "Church Street",
        coords: [12.9753, 77.6051],
        image:
          "https://source.unsplash.com/900x600/?church-street,bangalore",
        caption: "Books, cafes, music, and youthful street life.",
      },
    ],
    memories: [
      {
        id: "bengaluru-1",
        title: "Rainy Cafe Evening",
        type: "note",
        text: "A soft rain, coffee, and city lights outside the window.",
        time: "Sunday evening",
        image:
          "https://source.unsplash.com/900x600/?bangalore-cafe",
      },
    ],
  },

  {
    name: "Chennai",
    state: "Tamil Nadu",
    coords: [13.0827, 80.2707],
    mood: "Coastal",
    emoji: "🌊",
    image:
      "https://source.unsplash.com/900x600/?chennai,marina-beach",
    story:
      "Chennai carries temple bells, filter coffee, Marina waves, and warm southern charm.",
    spots: [
      {
        name: "Marina Beach",
        coords: [13.05, 80.2824],
        image:
          "https://source.unsplash.com/900x600/?marina-beach,chennai",
        caption: "Long shores, salty breeze, and sunrise walks.",
      },
      {
        name: "Kapaleeshwarar Temple",
        coords: [13.0337, 80.2699],
        image:
          "https://source.unsplash.com/900x600/?kapaleeshwarar-temple",
        caption: "Colorful towers, devotion, and ancient Tamil charm.",
      },
      {
        name: "Santhome Basilica",
        coords: [13.0339, 80.2774],
        image:
          "https://source.unsplash.com/900x600/?santhome-basilica,chennai",
        caption: "White architecture and peaceful coastal faith.",
      },
    ],
    memories: [
      {
        id: "chennai-1",
        title: "Marina Sunrise",
        type: "photo",
        text: "The sea looked golden before the city fully woke up.",
        time: "5:45 AM",
        image:
          "https://source.unsplash.com/900x600/?chennai-sunrise",
      },
    ],
  },

  {
    name: "Hyderabad",
    state: "Telangana",
    coords: [17.385, 78.4867],
    mood: "Royal",
    emoji: "🍛",
    image:
      "https://source.unsplash.com/900x600/?hyderabad,charminar",
    story:
      "Hyderabad glows with Charminar lanes, biryani aromas, tech towers, and Nizami grace.",
    spots: [
      {
        name: "Charminar",
        coords: [17.3616, 78.4747],
        image:
          "https://source.unsplash.com/900x600/?charminar,hyderabad",
        caption: "Iconic arches, old lanes, pearls, and history.",
      },
      {
        name: "Golconda Fort",
        coords: [17.3833, 78.4011],
        image:
          "https://source.unsplash.com/900x600/?golconda-fort",
        caption: "Huge stone walls and royal echoes of the past.",
      },
      {
        name: "Hussain Sagar",
        coords: [17.4239, 78.4738],
        image:
          "https://source.unsplash.com/900x600/?hussain-sagar,hyderabad",
        caption: "Lake breeze, city lights, and calm evenings.",
      },
    ],
    memories: [
      {
        id: "hyderabad-1",
        title: "Biryani Stop",
        type: "note",
        text: "A city that tastes royal in every bite.",
        time: "Lunch memory",
        image:
          "https://source.unsplash.com/900x600/?hyderabad-biryani",
      },
    ],
  },

  {
    name: "Udaipur",
    state: "Rajasthan",
    coords: [24.5854, 73.7125],
    mood: "Romantic",
    emoji: "🏞️",
    image:
      "https://source.unsplash.com/900x600/?udaipur,lake-palace",
    story:
      "Udaipur floats in lakes, palaces, white walls, and sunsets that feel like a dream.",
    spots: [
      {
        name: "Lake Pichola",
        coords: [24.576, 73.6796],
        image:
          "https://source.unsplash.com/900x600/?lake-pichola,udaipur",
        caption: "Still water, palace reflections, and golden evenings.",
      },
      {
        name: "City Palace",
        coords: [24.5765, 73.6835],
        image:
          "https://source.unsplash.com/900x600/?city-palace,udaipur",
        caption: "Royal balconies, lake views, and marble corridors.",
      },
      {
        name: "Sajjangarh Palace",
        coords: [24.5939, 73.6396],
        image:
          "https://source.unsplash.com/900x600/?monsoon-palace,udaipur",
        caption: "A palace above the clouds with sunset views.",
      },
    ],
    memories: [
      {
        id: "udaipur-1",
        title: "Lake Evening",
        type: "photo",
        text: "The whole city looked like it was floating in gold.",
        time: "Sunset",
        image:
          "https://source.unsplash.com/900x600/?udaipur-sunset",
      },
    ],
  },
];