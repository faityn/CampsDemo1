import { destinations, type Destination } from "@/data/destinations";
import { localizeDestination } from "@/data/destination-locales";
import { createSupabaseClient } from "@/lib/supabase";
import sanitizeHtml from "sanitize-html";

export function sanitizeRichText(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li"],
    allowedAttributes: { "*": ["style"] },
    allowedStyles: {
      "*": {
        "text-align": [/^(left|center|right)$/],
      },
    },
  });
}

function getClosingHeadline(
  row: Record<string, unknown>,
  locale: "en" | "mn",
): string {
  const heading = pickText(row, "space_to_breathe", "", locale);

  if (/<\/?[a-z][^>]*>/i.test(heading)) {
    return sanitizeRichText(heading);
  }

  const legacySecondLine = pickText(
    row,
    "time_to_stay",
    locale === "en" ? "Time to stay" : "Саатан тухлах цаг.",
    locale,
  );
  const lines = [heading, legacySecondLine].filter(Boolean);
  return sanitizeRichText(
    lines.map((line) => `<p>${line}</p>`).join(""),
  );
}

function richTextToPlainText(value: string): string {
  const withLineBreaks = value
    .replace(/<\/(p|li)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");
  return sanitizeHtml(withLineBreaks, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .trim();
}

export type IntroPageContent = {
  eyebrow: string;
  eyebrowMn?: string;
  tagline: string;
  taglineMn?: string;
  countryName: string;
  countryNameMn?: string;
  motto: string;
  mottoMn?: string;
  scroll: string;
  scrollMn?: string;
  destinationsLabel: string;
  destinationsLabelMn?: string;
  chooseLabel: string;
  chooseLabelMn?: string;
  destinationsDescription: string;
  destinationsDescriptionMn?: string;
  differentLuxury: string;
  differentLuxuryMn?: string;
  closingHeadline: string;
  closingHeadlineMn?: string;
  closing: string;
  closingMn?: string;
  heroImage: string;
};

export const defaultIntroContent: IntroPageContent = {
  eyebrow: "Mongolian Camps",
  tagline: "Curated stays in the wild",
  countryName: "MONGOLIA",
  motto: "Slow travel. Vast skies. Deep calm.",
  scroll: "Scroll",
  destinationsLabel: "Destinations",
  chooseLabel: "Choose your horizon",
  destinationsDescription:
    "From the endless steppe to pine valleys and desert plains, each camp offers a different rhythm of stay.",
  differentLuxury: "Different luxury",
  closingHeadline: "<p>Space to breathe</p><p>Time to stay</p>",
  closingHeadlineMn: "<p>Амьсгалах уудам орон зай.</p><p>Саатан тухлах цаг.</p>",
  closing:
    "A slower kind of luxury — wide horizons, warm hospitality, and time that actually feels like yours.",
  heroImage: "/images/2.jpg",
};

function pickText(
  row: Record<string, unknown> | null | undefined,
  field: string,
  fallback: string,
  locale: "en" | "mn" = "en",
): string {
  const localizedKey = `${field}_${locale}`;
  const localizedValue = row?.[localizedKey];
  if (typeof localizedValue === "string" && localizedValue.trim().length > 0) {
    return localizedValue;
  }

  const legacyValue = row?.[field];
  if (typeof legacyValue === "string" && legacyValue.trim().length > 0) {
    return legacyValue;
  }

  return fallback;
}

function getAccommodationImages(
  item: Record<string, unknown>,
  fallbackStay: Destination["stay"][number] | undefined,
): string[] {
  const image = String(item.image ?? "/images/2.jpg");
  const images = Array.isArray(item.images)
    ? item.images.filter((url): url is string => typeof url === "string" && url.length > 0)
    : [];

  if (images.length > 0) return images;
  if (fallbackStay && image === fallbackStay.image) {
    return fallbackStay.gallery?.length ? fallbackStay.gallery : [image];
  }
  return image === "/images/2.jpg" ? [] : [image];
}

async function readHomeContent() {
  const client = createSupabaseClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("home_content")
    .select("*")
    .eq("slug", "home")
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0];
}

async function readResortRows(slug: string) {
  const client = createSupabaseClient();

  if (!client) {
    return null;
  }

  const [resortRow, accommodationRows, galleryRows, restaurantGalleryRows, activityRows, factRows, aboutRows] =
    await Promise.all([
      client.from("resorts").select("*").eq("slug", slug).limit(1),
      client.from("resort_accommodations").select("*").eq("resort_slug", slug).order("sort_order", { ascending: true }),
      client.from("resort_galleries").select("*").eq("resort_slug", slug).order("sort_order", { ascending: true }),
      client.from("resort_restaurant_galleries").select("*").eq("resort_slug", slug).order("sort_order", { ascending: true }),
      client.from("resort_activities").select("*").eq("resort_slug", slug).order("sort_order", { ascending: true }),
      client.from("resort_facts").select("*").eq("resort_slug", slug).order("sort_order", { ascending: true }),
      client.from("resort_about_texts").select("*").eq("resort_slug", slug).order("sort_order", { ascending: true }),
    ]);

  return {
    resort: resortRow.data?.[0] ?? null,
    accommodations: accommodationRows.data ?? [],
    galleries: galleryRows.data ?? [],
    restaurantGalleries: restaurantGalleryRows.data ?? [],
    activities: activityRows.data ?? [],
    facts: factRows.data ?? [],
    aboutText: aboutRows.data ?? [],
  };
}

export async function getIntroContent(): Promise<IntroPageContent> {
  const stored = await readHomeContent();

  if (!stored) {
    return defaultIntroContent;
  }

  return {
    ...defaultIntroContent,
    eyebrow: pickText(stored, "eyebrow", defaultIntroContent.eyebrow, "en"),
    eyebrowMn: pickText(stored, "eyebrow", defaultIntroContent.eyebrow, "mn"),
    tagline: pickText(stored, "tagline", defaultIntroContent.tagline, "en"),
    taglineMn: pickText(stored, "tagline", defaultIntroContent.tagline, "mn"),
    countryName: pickText(stored, "country_name", defaultIntroContent.countryName, "en"),
    countryNameMn: pickText(stored, "country_name", defaultIntroContent.countryName, "mn"),
    motto: pickText(stored, "motto", defaultIntroContent.motto, "en"),
    mottoMn: pickText(stored, "motto", defaultIntroContent.motto, "mn"),
    scroll: pickText(stored, "scroll", defaultIntroContent.scroll, "en"),
    scrollMn: pickText(stored, "scroll", defaultIntroContent.scroll, "mn"),
    destinationsLabel: pickText(
      stored,
      "destinations_label",
      defaultIntroContent.destinationsLabel,
      "en",
    ),
    destinationsLabelMn: pickText(
      stored,
      "destinations_label",
      defaultIntroContent.destinationsLabel,
      "mn",
    ),
    chooseLabel: pickText(stored, "choose_label", defaultIntroContent.chooseLabel, "en"),
    chooseLabelMn: pickText(stored, "choose_label", defaultIntroContent.chooseLabel, "mn"),
    destinationsDescription: pickText(
      stored,
      "destinations_description",
      defaultIntroContent.destinationsDescription,
      "en",
    ),
    destinationsDescriptionMn: pickText(
      stored,
      "destinations_description",
      defaultIntroContent.destinationsDescription,
      "mn",
    ),
    differentLuxury: pickText(
      stored,
      "different_luxury",
      defaultIntroContent.differentLuxury,
      "en",
    ),
    differentLuxuryMn: pickText(
      stored,
      "different_luxury",
      defaultIntroContent.differentLuxury,
      "mn",
    ),
    closingHeadline: getClosingHeadline(stored, "en"),
    closingHeadlineMn: getClosingHeadline(stored, "mn"),
    closing: pickText(stored, "closing", defaultIntroContent.closing, "en"),
    closingMn: pickText(stored, "closing", defaultIntroContent.closing, "mn"),
    heroImage: stored.hero_image ?? defaultIntroContent.heroImage,
  };
}

export async function getResortContent(slug: string): Promise<Destination | undefined> {
  const fallback = destinations.find((item) => item.slug === slug);

  if (!fallback) {
    return undefined;
  }

  const stored = await readResortRows(slug);

  if (!stored || !stored.resort) {
    return fallback;
  }

  const resort = stored.resort;
  const fallbackMn = localizeDestination(fallback, "mn");
  const aboutText = (stored.aboutText ?? []).map((item: { paragraph_en?: string; paragraph_mn?: string; paragraph?: string }) =>
    pickText(item, "paragraph", "", "en") || item.paragraph || "",
  );
  const facts = (stored.facts ?? []).map((item: Record<string, unknown>) => ({
    label: pickText(item, "label", "", "en") || "",
    value: pickText(item, "value", "", "en") || "",
  }));
  const activities = (stored.activities ?? []).map((item: Record<string, unknown>) => ({
    title: pickText(item, "title", "", "en") || "",
    text: richTextToPlainText(pickText(item, "text", "", "en") || ""),
    image: String(item.image ?? "/images/2.jpg"),
  }));
  const gallery = (stored.galleries ?? []).map((item: { image_url: string }) => item.image_url);
  const restaurantGallery = (stored.restaurantGalleries ?? []).map(
    (item: { image_url: string }) => item.image_url,
  );
  const stay = (stored.accommodations ?? []).map((item: Record<string, unknown>, index: number) => {
    const images = getAccommodationImages(item, fallback.stay[index]);
    return {
      title: pickText(item, "title", "", "en") || "Accommodation",
      description: richTextToPlainText(pickText(item, "description", "", "en") || ""),
      image: String(item.image || images[0] || "/images/2.jpg"),
      gallery: images,
    };
  });

  return {
    ...fallback,
    slug: resort.slug ?? fallback.slug,
    name: pickText(resort, "name", fallback.name, "en"),
    nameMn: pickText(resort, "name", fallback.name, "mn"),
    region: pickText(resort, "region", fallback.region, "en"),
    regionMn: pickText(resort, "region", fallback.region, "mn"),
    eyebrow: pickText(resort, "eyebrow", fallback.eyebrow, "en"),
    eyebrowMn: pickText(resort, "eyebrow", fallback.eyebrow, "mn"),
    signature: pickText(resort, "signature", fallback.signature, "en"),
    signatureMn: pickText(resort, "signature", fallbackMn.signature, "mn"),
    description: sanitizeRichText(pickText(resort, "description", fallback.description, "en")),
    descriptionMn: sanitizeRichText(pickText(resort, "description", fallback.description, "mn")),
    aboutText: (aboutText.length > 0 ? aboutText : fallback.aboutText).map(sanitizeRichText),
    aboutTextMn: (stored.aboutText ?? []).map((item: { paragraph_mn?: string; paragraph?: string }) =>
      sanitizeRichText(pickText(item, "paragraph", "", "mn") || item.paragraph || ""),
    ),
    aboutImage: resort.about_image ?? fallback.aboutImage,
    image: resort.image ?? fallback.image,
    accent: resort.accent ?? fallback.accent,
    logo: resort.logo ?? fallback.logo,
    logoMark: resort.logo_mark ?? fallback.logoMark,
    mapUrl: resort.map_url ?? fallback.mapUrl,
    mapCenter: resort.map_center ?? fallback.mapCenter,
    phone: resort.phone ?? fallback.phone,
    facts: facts.length > 0 ? facts : fallback.facts,
    factsMn: (stored.facts ?? []).map((item: Record<string, unknown>) => ({
      label: pickText(item, "label", "", "mn") || "",
      value: pickText(item, "value", "", "mn") || "",
    })),
    activities,
    activitiesMn: (stored.activities ?? []).map((item: Record<string, unknown>) => ({
      title: pickText(item, "title", "", "mn") || "",
      text: richTextToPlainText(pickText(item, "text", "", "mn") || ""),
      image: String(item.image ?? "/images/2.jpg"),
    })),
    restaurantGallery:
      restaurantGallery.length > 0 || resort.restaurant_gallery_configured
        ? restaurantGallery
        : gallery.length > 0
          ? gallery
          : fallback.restaurantGallery,
    featuredRestaurant: {
      title: pickText(resort, "featured_restaurant_title", fallback.featuredRestaurant.title, "en"),
      text: richTextToPlainText(pickText(resort, "featured_restaurant_text", fallback.featuredRestaurant.text, "en")),
    },
    featuredRestaurantMn: {
      title: pickText(resort, "featured_restaurant_title", fallback.featuredRestaurant.title, "mn"),
      text: richTextToPlainText(pickText(resort, "featured_restaurant_text", fallback.featuredRestaurant.text, "mn")),
    },
    arrivalText: pickText(resort, "arrival_text", fallback.arrivalText, "en"),
    arrivalTextMn: pickText(resort, "arrival_text", fallback.arrivalText, "mn"),
    contactText: richTextToPlainText(pickText(resort, "contact_text", fallback.contactText, "en")),
    contactTextMn: richTextToPlainText(pickText(resort, "contact_text", fallback.contactText, "mn")),
    gallery: gallery.length > 0 ? gallery : fallback.gallery,
    stay,
    stayMn: (stored.accommodations ?? []).map((item: Record<string, unknown>, index: number) => {
      const images = getAccommodationImages(item, fallback.stay[index]);
      return {
        title: pickText(item, "title", "", "mn") || "Accommodation",
        description: richTextToPlainText(pickText(item, "description", "", "mn") || ""),
        image: String(item.image || images[0] || "/images/2.jpg"),
        gallery: images,
      };
    }),
  };
}

export async function getAllResortContent(): Promise<Destination[]> {
  const results = await Promise.all(
    destinations.map(async (destination) => {
      return (await getResortContent(destination.slug)) ?? destination;
    }),
  );

  return results;
}
