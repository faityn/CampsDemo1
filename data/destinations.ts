export type DestinationHighlight = {
  title: string;
  text: string;
};

export type DestinationStay = {
  title: string;
  description: string;
  image: string;
  gallery?: string[];
};

export type Destination = {
  slug: string;
  theme: "alungoo" | "guru" | "hoyor-zagal";
  name: string;
  region: string;
  eyebrow: string;
  signature: string;
  description: string;
  image: string;
  accent: string;
  logo: string;
  logoMark: string;
  mapUrl: string;
  mapCenter: string;
  phone: string;
  facts: { label: string; value: string }[];
  restaurantText: string;
  restaurantGallery: string[];
  arrivalText: string;
  contactText: string;
  highlights: DestinationHighlight[];
  gallery: string[];
  stay: DestinationStay[];
};

export const destinations: Destination[] = [
  {
    slug: "elssen-tasarkhai",
    theme: "hoyor-zagal",
    name: "HOYOR ZAGAL",
    region: "Mongolian steppe & dunes",
    eyebrow: "Golden horizon / Elsen Tasarkhai",
    signature: "A bold desert camp for wide skies and elemental days.",
    description:
      "Where rolling dunes meet the endless steppe for an unforgettable desert retreat.",
    image: "/images/hoyorzagal/g1.jpg",
    accent: "#e0b878",
    logo: "/images/hoyorzagal/logo.png",
    logoMark: "03",
    mapUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=103.55%2C47.15%2C104.10%2C47.55&layer=mapnik&marker=47.35%2C103.82",
    mapCenter: "47.35,103.82",
    facts: [
      { label: "Best for", value: "Desert adventures" },
      { label: "Season", value: "May — September" },
      { label: "From Ulaanbaatar", value: "4.5 hours" },
    ],
    restaurantText:
      "Generous campfire meals, local dairy and strong Mongolian tea shared beneath an enormous evening sky.",
    restaurantGallery: [
      "/images/hoyorzagal/5.jpg",
      "/images/hoyorzagal/r1.jpg",
      "/images/hoyorzagal/r2.jpg",
      "/images/hoyorzagal/r3.jpg",
      "/images/hoyorzagal/r4.jpg",
      "/images/hoyorzagal/r5.jpg",
    ],
    arrivalText:
      "Head west across open steppe toward Elsen Tasarkhai. We recommend arriving before sunset for the first dune walk.",
    contactText:
      "Bring your curiosity and a little extra time. We will help arrange a desert itinerary with room to wander.",
    phone: "99984593",
    highlights: [
      {
        title: "Dune panoramas",
        text: "Endless golden views that shift color with sunrise, noon, and sunset.",
      },
      {
        title: "Steppe horizons",
        text: "A vast landscape made for quiet walks, long views, and deep stillness.",
      },
      {
        title: "Desert evenings",
        text: "Campfire dinners, star-filled skies, and the slow magic of the open steppe.",
      },
    ],
    gallery: [
      "/images/hoyorzagal/5.jpg",
      "/images/hoyorzagal/g2.jpg",
      "/images/hoyorzagal/g3.jpg",
      "/images/hoyorzagal/2.jpg",
      "/images/hoyorzagal/g4.jpg",
      "/images/hoyorzagal/g5.jpg",
      "/images/hoyorzagal/g1.jpg",
      "/images/hoyorzagal/g6.jpg",
    ],
    stay: [
      {
        title: "Desert ger camp",
        description:
          "A traditional ger with layered textiles, soft lighting, and a dedicated outdoor seating area.",
        image: "/images/hoyorzagal/a1.jpg",
        gallery: [
          "/images/hoyorzagal/a1.jpg",
          "/images/hoyorzagal/a3.jpg",
          "/images/hoyorzagal/a4.jpg",
        ],
      },
      {
        title: "Evening fire circle",
        description:
          "An open-air gathering place for tea, music, and a pause beneath the desert sky.",
        image: "/images/hoyorzagal/17.jpg",
        gallery: [
          "/images/hoyorzagal/17.jpg",
          "/images/hoyorzagal/a7.jpg",
          "/images/hoyorzagal/a2.jpg",
        ],
      },
    ],
  },
  {
    slug: "terelj-one",
    theme: "alungoo",
    name: "ALUNGOO  GER HOTEL",
    region: "Gorkhi-Terelj National Park",
    eyebrow: "Scenic Comfort / Terelj",
    signature: "A private valley hideaway for unhurried days.",
    description:
      "A quiet escape among granite cliffs, pine forests and wide-open Mongolian skies.",
    image: "/images/alungoo/13.jpg",
    accent: "#b96535",
    logo: "/images/alungoo/logo.png",
    logoMark: "01",
    mapUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=107.20%2C47.80%2C107.60%2C48.10&layer=mapnik&marker=47.877372%2C107.430132",
    mapCenter: "47.877372,107.430132",
    facts: [
      { label: "Best for", value: "Quiet weekends" },
      { label: "Season", value: "May — October" },
      { label: "From Ulaanbaatar", value: "1.5 hours" },
    ],
    restaurantText:
      "Alungoo Ger Hotel offers 22 comfortable gers with modern amenities, including bathroom access, Wi-Fi, a restaurant, and a pub. Enjoy authentic hospitality, delicious cuisine, and a relaxing stay surrounded by nature.",
    restaurantGallery: [
      "/images/alungoo/14.jpg",
      "/images/alungoo/r2.jpg",
      "/images/alungoo/r3.jpg",
    ],
    arrivalText:
      "Travel north-east from Ulaanbaatar through the park gate, then follow the valley road to our private camp.",
    contactText:
      "Share your dates and preferred pace. We will prepare a quiet Terelj stay around your group.",
    phone: "99098720",
    highlights: [
      {
        title: "Granite cliffs",
        text: "Sunrise walks through dramatic rock formations and cool pine-lined valleys.",
      },
      {
        title: "Cultural evenings",
        text: "Traditional music, warm tea and fireside stories under the stars.",
      },
      {
        title: "Wild open air",
        text: "Wide views, fresh alpine air and a slower rhythm built for unwinding.",
      },
    ],
    gallery: [
      "/images/alungoo/14.jpg",
      "/images/alungoo/13.jpg",
      "/images/alungoo/16.jpg",
      "/images/alungoo/5.jpg",
    ],
    stay: [
      {
        title: "DELUXE GERS",
        description:
          "Stay close to nature without sacrificing comfort. Our Deluxe Gers offer king-size beds, elegant bathrooms, and breathtaking views of Terelj National Park.",
        image: "/images/alungoo/1.jpg",
        gallery: [
          "/images/alungoo/a1.jpg",
          "/images/alungoo/7.jpg",
          "/images/alungoo/a3.jpg",
          "/images/alungoo/1.jpg",
        ],
      },
      {
        title: "STANDARD GERS",
        description:
          "Authentic Mongolian gers with modern bathroom facilities, offering the perfect blend of tradition, comfort, and convenience.",
        image: "/images/alungoo/5.jpg",
        gallery: [
          "/images/alungoo/a2.jpg",
          "/images/alungoo/3.jpg",
          "/images/alungoo/5.jpg",
        ],
      },
    ],
  },
  {
    slug: "terelj-two",
    theme: "guru",
    name: "GURU ECO COMPLEX",
    region: "Beyond the city",
    eyebrow: "Living lightly / Terelj",
    signature: "A considered retreat where comfort follows the landscape.",
    description:
      "Slow mornings, fresh air and a refined stay shaped by the landscape of Terelj.",
    image: "/images/guru/11.jpg",
    accent: "#b9d98b",
    logo: "/images/guru/logo.png",
    logoMark: "02",
    mapUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=107.20%2C47.80%2C107.60%2C48.10&layer=mapnik&marker=47.8811077%2C107.4284165",
    mapCenter: "47.8811077,107.4284165",
    facts: [
      { label: "Best for", value: "Slow, restorative stays" },
      { label: "Season", value: "April — November" },
      { label: "From Ulaanbaatar", value: "2 hours" },
    ],
    restaurantText:
      "Seasonal produce, nourishing plates and long coffee hours in an airy dining room facing the pines.",
    restaurantGallery: [
      "/images/guru/r1.jpg",
      "/images/guru/r2.jpg",
      "/images/guru/r3.jpg",
      "/images/guru/r5.jpg",
    ],
    arrivalText:
      "A private transfer from Ulaanbaatar brings you beyond the city and into the forest edge without a rushed schedule.",
    contactText:
      "Tell us what helps you reset. Our team will shape a calm, low-impact stay at Guru.",
    phone: "99096714",
    highlights: [
      {
        title: "River trails",
        text: "Gentle hikes and scenic viewpoints shaped by the rich valley landscape.",
      },
      {
        title: "Quiet afternoons",
        text: "Rest, reading, and long coffees on the terrace while the mountains glow.",
      },
      {
        title: "Refined simplicity",
        text: "Warm hospitality, thoughtful details, and a balanced escape from the city.",
      },
    ],
    gallery: [
      "/images/guru/g2.jpg",
      "/images/guru/g3.jpg",
      "/images/guru/12.jpg",
      "/images/guru/11.jpg",
      "/images/guru/a3.jpg",
    ],
    stay: [
      {
        title: "Forest-side ger",
        description:
          "A cozy Mongolian ger tucked among pines with a private lounge and warm evening lighting.",
        image: "/images/guru/a2.jpg",
        gallery: [
          "/images/guru/a2.jpg",
          "/images/guru/a5.jpg",
          "/images/guru/a3.jpg",
        ],
      },
      {
        title: "Rest & recharge",
        description:
          "Plush bedding, soft wool textures, and quiet corners designed for slow mornings.",
        image: "/images/guru/12.jpg",
        gallery: [
          "/images/guru/12.jpg",
          "/images/guru/a3.jpg",
          "/images/guru/a4.jpg",
        ],
      },
    ],
  },
];
