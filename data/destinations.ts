export type DestinationActivity = {
  title: string;
  text: string;
  image: string;
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
  nameMn?: string;
  region: string;
  regionMn?: string;
  eyebrow: string;
  eyebrowMn?: string;
  signature: string;
  signatureMn?: string;
  description: string;
  descriptionMn?: string;
  aboutText: string[];
  aboutTextMn?: string[];
  aboutImage: string;
  image: string;
  accent: string;
  logo: string;
  logoMark: string;
  mapUrl: string;
  mapCenter: string;
  phone: string;
  facts: { label: string; value: string }[];
  factsMn?: { label: string; value: string }[];
  activities: DestinationActivity[];
  activitiesMn?: DestinationActivity[];
  restaurantGallery: string[];
  featuredRestaurant: { title: string; text: string };
  featuredRestaurantMn?: { title: string; text: string };
  arrivalText: string;
  arrivalTextMn?: string;
  contactText: string;
  contactTextMn?: string;
  gallery: string[];
  stay: DestinationStay[];
  stayMn?: DestinationStay[];
};

export const destinations: Destination[] = [
  {
    slug: "hoyorzagal",
    theme: "hoyor-zagal",
    name: "HOYOR ZAGAL",
    region: "Mongolian steppe & dunes",
    eyebrow: "Golden horizon / Elsen Tasarkhai",
    signature: "A bold desert camp for wide skies and elemental days.",
    description:
      "Where rolling dunes meet the endless steppe for an unforgettable desert retreat.",
    aboutText: [
      "At Hoyor Zagal, the open steppe meets the shifting sands of Elsen Tasarkhai. The camp offers a place to take in this changing landscape at an unhurried pace, with traditional ger stays that bring you close to the wide horizons and quiet rhythm of the desert.",
      "Spend the day exploring the dunes on foot or horseback, then return to warm Mongolian hospitality and generous campfire meals. As the light fades across the grassland, the landscape itself becomes the evening's gathering place.",
    ],
    aboutImage: "/images/hoyorzagal/31.JPG",
    image: "/images/hoyorzagal/31.JPG",
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
    activities: [
      {
        title: "Horse riding",
        text: "Ride across the open steppe and take in the rolling dunes from a new perspective.",
        image: "/images/hoyorzagal/g4.jpg",
      },
      {
        title: "Hiking",
        text: "Follow the sandy ridgelines and discover the meeting point of desert and grassland on foot.",
        image: "/images/hoyorzagal/g3.jpg",
      },
      {
        title: "Nature photography",
        text: "Capture the changing light, broad horizons, and shifting colors of the dunes.",
        image: "/images/hoyorzagal/g1.JPG",
      },
      {
        title: "Archery",
        text: "Try traditional Mongolian archery in the calm, open air of the steppe.",
        image: "/images/hoyorzagal/18.jpg",
      },
      {
        title: "Camel riding",
        text: "Take a gentle ride across the dunes and experience this desert landscape at an easy pace.",
        image: "/images/hoyorzagal/g3.jpg",
      },
      {
        title: "Nomadic culture",
        text: "Learn about traditional life on the steppe and the people who call this landscape home.",
        image: "/images/hoyorzagal/g4.jpg",
      },
    ],
    restaurantGallery: [
      "/images/hoyorzagal/r1.jpg",
      "/images/hoyorzagal/r2.jpg",
      "/images/hoyorzagal/r3.jpg",
      "/images/hoyorzagal/r4.jpg",
      "/images/hoyorzagal/r5.jpg",
      "/images/hoyorzagal/r6.JPG",
      "/images/hoyorzagal/r7.JPG",
      "/images/hoyorzagal/r8.JPG",
    ],
    featuredRestaurant: {
      title: "Local Flavors, Fresh from Nature",
      text: "Enjoy Mongolian and international cuisine made from fresh, local ingredients in a warm dining room overlooking the valley.",
    },
    arrivalText:
      "Head west across open steppe toward Elsen Tasarkhai. We recommend arriving before sunset for the first dune walk.",
    contactText:
      "Bring your curiosity and a little extra time. We will help arrange a desert itinerary with room to wander.",
    phone: "99984593",
    gallery: [
      "/images/hoyorzagal/g1.JPG",
      "/images/hoyorzagal/g2.jpg",
      "/images/hoyorzagal/g3.jpg",
      "/images/hoyorzagal/g4.jpg",
      "/images/hoyorzagal/g5.jpg",
      "/images/hoyorzagal/g6.jpg",
      "/images/hoyorzagal/g7.JPG",
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
          "/images/hoyorzagal/a6.jpg",
          "/images/hoyorzagal/a11.JPG",
        ],
      },
      {
        title: "Evening fire circle",
        description:
          "An open-air gathering place for tea, music, and a pause beneath the desert sky.",
        image: "/images/hoyorzagal/1.JPG",
        gallery: [
          "/images/hoyorzagal/1.JPG",
          "/images/hoyorzagal/2.jpg",
          "/images/hoyorzagal/a2.jpg",
        ],
      },
    ],
  },
  {
    slug: "alungoo",
    theme: "alungoo",
    name: "ALUNGOO  GER HOTEL",
    region: "Gorkhi-Terelj National Park",
    eyebrow: "Scenic Comfort / Terelj",
    signature: "A private valley hideaway for unhurried days.",
    description:
      "A quiet escape among granite cliffs, pine forests and wide-open Mongolian skies.",
    aboutText: [
      "Set among the granite cliffs and pine-covered valleys of Gorkhi-Terelj National Park, Alungoo is a peaceful base for discovering the surrounding landscape. The camp offers 22 comfortable gers with modern amenities, giving guests a welcoming place to return to after a day outdoors.",
      "An on-site restaurant and pub bring people together over local flavors and relaxed evenings. Whether you come for a quiet weekend or time on the park's trails, Alungoo makes it easy to settle into the slower pace of Terelj.",
    ],
    aboutImage: "/images/alungoo/30.JPG",
    image: "/images/alungoo/30.JPG",
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
    activities: [
      {
        title: "Horse riding",
        text: "Explore Terelj's open valleys and granite scenery on horseback.",
        image: "/images/alungoo/11.JPG",
      },
      {
        title: "Hiking",
        text: "Take a refreshing walk through pine-lined valleys and along the park's scenic trails.",
        image: "/images/alungoo/16.jpg",
      },
      {
        title: "Nature photography",
        text: "Frame the forest, granite formations, and changing light of the Terelj landscape.",
        image: "/images/alungoo/18.JPG",
      },
      {
        title: "Archery",
        text: "Try traditional Mongolian archery and enjoy a hands-on cultural experience outdoors.",
        image: "/images/alungoo/13.JPG",
      },
      {
        title: "Visit Turtle Rock",
        text: "Take a scenic trip to Terelj's iconic rock formation and enjoy the mountain views along the way.",
        image: "/images/alungoo/15.jpg",
      },
      {
        title: "Forest picnic",
        text: "Slow down outdoors with a relaxed picnic surrounded by the fresh air of the valley.",
        image: "/images/alungoo/10.JPG",
      },
    ],
    restaurantGallery: [
      "/images/alungoo/r1.JPG",
      "/images/alungoo/r2.JPG",
      "/images/alungoo/r3.JPG",
      "/images/alungoo/r4.JPG",
    ],
    featuredRestaurant: {
      title: "A Taste of Mongolia",
      text: "Traditional dishes, seasonal ingredients and a calm fireside atmosphere create an intimate dining experience.",
    },
    arrivalText:
      "Travel north-east from Ulaanbaatar through the park gate, then follow the valley road to our private camp.",
    contactText:
      "Share your dates and preferred pace. We will prepare a quiet Terelj stay around your group.",
    phone: "99098720",
    gallery: [
      "/images/alungoo/1.JPG",
      "/images/alungoo/3.JPG",
      "/images/alungoo/16.jpg",
      "/images/alungoo/30.JPG",
      "/images/alungoo/32.JPG",
      "/images/alungoo/33.JPG",
      "/images/alungoo/34.JPG",
    ],
    stay: [
      {
        title: "DELUXE GERS",
        description:
          "Stay close to nature without sacrificing comfort. Our Deluxe Gers offer king-size beds, elegant bathrooms, and breathtaking views of Terelj National Park.",
        image: "/images/alungoo/a1.JPG",
        gallery: [
          "/images/alungoo/a1.JPG",
          "/images/alungoo/a3.JPG",
          "/images/alungoo/a5.JPG",
          "/images/alungoo/a6.JPG",
          "/images/alungoo/a7.JPG",
          "/images/alungoo/a8.JPG",
        ],
      },
      {
        title: "STANDARD GERS",
        description:
          "Authentic Mongolian gers with modern bathroom facilities, offering the perfect blend of tradition, comfort, and convenience.",
        image: "/images/alungoo/a2.JPG",
        gallery: [
          "/images/alungoo/a2.JPG",
          "/images/alungoo/a3.JPG",
          "/images/alungoo/a4.JPG",
        ],
      },
    ],
  },
  {
    slug: "guru",
    theme: "guru",
    name: "GURU ECO COMPLEX",
    region: "Beyond the city",
    eyebrow: "Living lightly / Terelj",
    signature: "A considered retreat where comfort follows the landscape.",
    description:
      "Slow mornings, fresh air and a refined stay shaped by the landscape of Terelj.",
    aboutText: [
      "Guru Eco Complex is a calm retreat shaped by the forest edge and open valleys of Terelj. Its thoughtful, comfortable stays offer a quiet place to slow down, wake to fresh air and spend more time close to nature.",
      "Take a gentle walk, watch the landscape change through the day, or simply settle into an easy afternoon among the pines. At Guru, the experience is less about rushing from place to place and more about finding room to pause and enjoy the setting.",
    ],
    aboutImage: "/images/guru/hero.png",
    image: "/images/guru/hero.png",
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
    activities: [
      {
        title: "Horse riding",
        text: "See Terelj's wide valleys and striking granite landscape from horseback.",
        image: "/images/guru/g2.JPG",
      },
      {
        title: "Hiking",
        text: "Follow peaceful trails through the valley and enjoy the fresh air along the forest edge.",
        image: "/images/guru/g1.JPG",
      },
      {
        title: "Nature photography",
        text: "Find a quiet viewpoint and capture the pines, river valley, and dramatic rock formations.",
        image: "/images/guru/g5.JPG",
      },
      {
        title: "Archery",
        text: "Try traditional Mongolian archery in a peaceful outdoor setting.",
        image: "/images/guru/g3.JPG",
      },
      {
        title: "Birdwatching",
        text: "Look and listen for birds along the river and forest edge during a quiet walk.",
        image: "/images/guru/g4.JPG",
      },
      {
        title: "Forest-side relaxation",
        text: "Unwind among the pines and take in the open views at the pace that suits you.",
        image: "/images/guru/g6.JPG",
      },
    ],
    restaurantGallery: [
      "/images/guru/r1.JPG",
      "/images/guru/r2.JPG",
      "/images/guru/r3.JPG",
      "/images/guru/r4.JPG",
      "/images/guru/r5.JPG",
      "/images/guru/r6.JPG",
      "/images/guru/r7.JPG",
      "/images/guru/r8.JPG",
    ],
    featuredRestaurant: {
      title: "Garden to Table",
      text: "Fresh, simple dishes inspired by the surrounding forest and seasonal produce, served beside the water.",
    },
    arrivalText:
      "A private transfer from Ulaanbaatar brings you beyond the city and into the forest edge without a rushed schedule.",
    contactText:
      "Tell us what helps you reset. Our team will shape a calm, low-impact stay at Guru.",
    phone: "99096714",
    gallery: [
      "/images/guru/g1.JPG",
      "/images/guru/g2.JPG",
      "/images/guru/g3.JPG",
      "/images/guru/g4.JPG",
      "/images/guru/g5.JPG",
      "/images/guru/g6.JPG",
      "/images/guru/g7.JPG",
      "/images/guru/g8.JPG",
      "/images/guru/g9.JPG",
      "/images/guru/g10.JPG",
      "/images/guru/g11.JPG",
      "/images/guru/g12.JPG",
    ],
    stay: [
      {
        title: "Forest-side ger",
        description:
          "A cozy Mongolian ger tucked among pines with a private lounge and warm evening lighting.",
        image: "/images/guru/a7.JPG",
        gallery: [
          "/images/guru/a7.JPG",
          "/images/guru/a9.JPG",
          "/images/guru/a1.JPG",
          "/images/guru/a2.JPG",
        ],
      },
      {
        title: "Rest & recharge",
        description:
          "Plush bedding, soft wool textures, and quiet corners designed for slow mornings.",
        image: "/images/guru/a11.JPG",
        gallery: [
          "/images/guru/a11.JPG",
          "/images/guru/a10.JPG",
          "/images/guru/a5.JPG",
          "/images/guru/a6.JPG",
          "/images/guru/a3.JPG",
          "/images/guru/a8.JPG",
        ],
      },
    ],
  },
];
