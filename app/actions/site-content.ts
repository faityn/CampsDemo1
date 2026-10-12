"use server";

import { revalidatePath } from "next/cache";
import { localizeDestination } from "@/data/destination-locales";
import { destinations } from "@/data/destinations";
import {
  defaultIntroContent,
  getResortContent,
  sanitizeRichText,
} from "@/lib/site-content";
import { requireAdminSession } from "@/lib/require-admin";
import { createSupabaseServerClient, isSupabaseAuthConfigured } from "@/lib/supabase-server";

function parseTextList(value: FormDataEntryValue | null): string[] {
  if (!value) {
    return [];
  }

  return value
    .toString()
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseArrayString(value: FormDataEntryValue | null): string[] {
  if (!value) {
    return [];
  }

  const text = value.toString();

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [];
  } catch {
    return text
      .split(/\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function getString(formData: FormData, key: string, fallback: string): string {
  const value = formData.get(key);
  return value === null || value === undefined ? fallback : String(value);
}

function getColor(formData: FormData, key: string, fallback: string): string {
  const value = getString(formData, key, fallback);
  if (!/^#[\da-f]{6}$/i.test(value)) {
    throw new Error(`${key} must be a valid six-digit hex color.`);
  }
  return value;
}

function parseObjectList(formData: FormData, key: string): Record<string, unknown>[] | null {
  const value = formData.get(key);
  if (value === null) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(String(value));
  } catch {
    throw new Error(`${key} must be a valid JSON array.`);
  }

  if (
    !Array.isArray(parsed) ||
    !parsed.every((item) => item !== null && typeof item === "object" && !Array.isArray(item))
  ) {
    throw new Error(`${key} must be a valid JSON array.`);
  }

  return parsed as Record<string, unknown>[];
}

export async function loadResortContent(slug: string) {
  await requireAdminSession();
  return getResortContent(slug);
}

export async function seedDefaultContent() {
  await requireAdminSession();
  if (!isSupabaseAuthConfigured()) {
    return { ok: false, message: "Supabase environment variables are not configured." };
  }
  const client = await createSupabaseServerClient();

  const homeRows = [{
    slug: "home",
    eyebrow_en: defaultIntroContent.eyebrow,
    eyebrow_mn: "Монголын баазууд",
    tagline_en: defaultIntroContent.tagline,
    tagline_mn: "Зэрлэгт тохирсон амралт",
    country_name_en: defaultIntroContent.countryName,
    country_name_mn: "МОНГОЛ",
    motto_en: defaultIntroContent.motto,
    motto_mn: "Удаан аялал. Уудам тэнгэр. Тайван амгалан.",
    scroll_en: defaultIntroContent.scroll,
    scroll_mn: "Урагш",
    destinations_label_en: defaultIntroContent.destinationsLabel,
    destinations_label_mn: "Байрлал",
    choose_label_en: defaultIntroContent.chooseLabel,
    choose_label_mn: "Сонголтоо хийж үзээрэй",
    destinations_description_en: defaultIntroContent.destinationsDescription,
    destinations_description_mn: "Эзэнгүй хээрээс эхлээд гацуур ой, элсэн манхан хүртэл, тус бүр нэгэн өвөрмөц амралтын хэмнэлтэй.",
    different_luxury_en: defaultIntroContent.differentLuxury,
    different_luxury_mn: "Өөр төрлийн тансаглал",
    space_to_breathe_en: defaultIntroContent.closingHeadline,
    space_to_breathe_mn:
      defaultIntroContent.closingHeadlineMn ??
      defaultIntroContent.closingHeadline,
    time_to_stay_en: "",
    time_to_stay_mn: "",
    closing_en: defaultIntroContent.closing,
    closing_mn: "Удаан, тайван тансаглал — уудам хаяа, дулаан найрсаг байдал, яг таны цаг хугацаа.",
    hero_image: defaultIntroContent.heroImage,
  }];

  const resortRows = destinations.map((destination) => {
    const localized = localizeDestination(destination, "mn");
    return {
      slug: destination.slug,
      name_en: destination.name,
      name_mn: localized.name,
      region_en: destination.region,
      region_mn: localized.region,
      eyebrow_en: destination.eyebrow,
      eyebrow_mn: localized.eyebrow,
      signature_en: destination.signature,
      signature_mn: localized.signature,
      description_en: destination.description,
      description_mn: localized.description,
      about_image: destination.aboutImage,
      image: destination.image,
      accent: destination.accent,
      hero_gradient_color: destination.heroGradientColor,
      theme_background: destination.themeBackground,
      theme_text: destination.themeText,
      content_background: destination.contentBackground,
      content_text: destination.contentText,
      muted_color: destination.mutedColor,
      line_color: destination.lineColor,
      logo: destination.logo,
      logo_mark: destination.logoMark,
      map_url: destination.mapUrl,
      map_center: destination.mapCenter,
      phone: destination.phone,
      arrival_text_en: destination.arrivalText,
      arrival_text_mn: localized.arrivalText,
      contact_text_en: destination.contactText,
      contact_text_mn: localized.contactText,
      featured_restaurant_title_en: destination.featuredRestaurant.title,
      featured_restaurant_title_mn: localized.featuredRestaurant.title,
      featured_restaurant_text_en: destination.featuredRestaurant.text,
      featured_restaurant_text_mn: localized.featuredRestaurant.text,
      restaurant_gallery_configured: true,
    };
  });

  const accommodationRows = destinations.flatMap((destination) =>
    destination.stay.map((stay, index) => {
      const localizedStay = localizeDestination(destination, "mn").stay[index] ?? stay;
      return {
        resort_slug: destination.slug,
        title_en: stay.title,
        title_mn: localizedStay.title,
        description_en: stay.description,
        description_mn: localizedStay.description,
        image: stay.image,
        sort_order: index,
      };
    }),
  );

  const galleryRows = destinations.flatMap((destination) =>
    destination.gallery.map((image, index) => ({
      resort_slug: destination.slug,
      image_url: image,
      sort_order: index,
    })),
  );

  const restaurantGalleryRows = destinations.flatMap((destination) =>
    destination.restaurantGallery.map((image, index) => ({
      resort_slug: destination.slug,
      image_url: image,
      sort_order: index,
    })),
  );

  const activityRows = destinations.flatMap((destination) =>
    destination.activities.map((activity, index) => {
      const localizedActivity = localizeDestination(destination, "mn").activities[index] ?? activity;
      return {
        resort_slug: destination.slug,
        title_en: activity.title,
        title_mn: localizedActivity.title,
        text_en: activity.text,
        text_mn: localizedActivity.text,
        image: activity.image,
        sort_order: index,
      };
    }),
  );

  const factRows = destinations.flatMap((destination) =>
    destination.facts.map((fact, index) => {
      const localizedFact = localizeDestination(destination, "mn").facts[index] ?? fact;
      return {
        resort_slug: destination.slug,
        label_en: fact.label,
        label_mn: localizedFact.label,
        value_en: fact.value,
        value_mn: localizedFact.value,
        sort_order: index,
      };
    }),
  );

  const aboutRows = destinations.flatMap((destination) =>
    destination.aboutText.map((paragraph, index) => {
      const localizedParagraph = localizeDestination(destination, "mn").aboutText[index] ?? paragraph;
      return {
        resort_slug: destination.slug,
        paragraph_en: paragraph,
        paragraph_mn: localizedParagraph,
        sort_order: index,
      };
    }),
  );

  const [homeResult, resortResult, accommodationResult, galleryResult, restaurantGalleryResult, activityResult, factResult, aboutResult] =
    await Promise.all([
      client.from("home_content").upsert(homeRows, { onConflict: "slug" }),
      client.from("resorts").upsert(resortRows, { onConflict: "slug" }),
      client.from("resort_accommodations").upsert(accommodationRows, { onConflict: "resort_slug, title_en" }),
      client.from("resort_galleries").upsert(galleryRows, { onConflict: "resort_slug, image_url" }),
      client.from("resort_restaurant_galleries").upsert(restaurantGalleryRows, { onConflict: "resort_slug, image_url" }),
      client.from("resort_activities").upsert(activityRows, { onConflict: "resort_slug, title_en" }),
      client.from("resort_facts").upsert(factRows, { onConflict: "resort_slug, label_en" }),
      client.from("resort_about_texts").upsert(aboutRows, { onConflict: "resort_slug, paragraph_en" }),
    ]);

  if (
    homeResult.error ||
    resortResult.error ||
    accommodationResult.error ||
    galleryResult.error ||
    restaurantGalleryResult.error ||
    activityResult.error ||
    factResult.error ||
    aboutResult.error
  ) {
    return {
      ok: false,
      message:
        homeResult.error?.message ??
        resortResult.error?.message ??
        accommodationResult.error?.message ??
        galleryResult.error?.message ??
        restaurantGalleryResult.error?.message ??
        activityResult.error?.message ??
        factResult.error?.message ??
        aboutResult.error?.message ??
        "Failed to seed default content.",
    };
  }

  return { ok: true, message: "Default content has been saved to Supabase." };
}

export async function saveIntroContent(formData: FormData) {
  await requireAdminSession();
  if (!isSupabaseAuthConfigured()) {
    return { ok: false, message: "Supabase environment variables are not configured." };
  }
  const client = await createSupabaseServerClient();

  const payload = {
    slug: "home",
    updated_at: new Date().toISOString(),
    eyebrow_en: getString(formData, "eyebrow", defaultIntroContent.eyebrow),
    eyebrow_mn: getString(formData, "eyebrowMn", defaultIntroContent.eyebrow),
    tagline_en: getString(formData, "tagline", defaultIntroContent.tagline),
    tagline_mn: getString(formData, "taglineMn", defaultIntroContent.tagline),
    country_name_en: getString(formData, "countryName", defaultIntroContent.countryName),
    country_name_mn: getString(formData, "countryNameMn", defaultIntroContent.countryName),
    motto_en: getString(formData, "motto", defaultIntroContent.motto),
    motto_mn: getString(formData, "mottoMn", defaultIntroContent.motto),
    scroll_en: getString(formData, "scroll", defaultIntroContent.scroll),
    scroll_mn: getString(formData, "scrollMn", defaultIntroContent.scroll),
    destinations_label_en: getString(formData, "destinationsLabel", defaultIntroContent.destinationsLabel),
    destinations_label_mn: getString(formData, "destinationsLabelMn", defaultIntroContent.destinationsLabel),
    choose_label_en: getString(formData, "chooseLabel", defaultIntroContent.chooseLabel),
    choose_label_mn: getString(formData, "chooseLabelMn", defaultIntroContent.chooseLabel),
    destinations_description_en: getString(
      formData,
      "destinationsDescription",
      defaultIntroContent.destinationsDescription,
    ),
    destinations_description_mn: getString(
      formData,
      "destinationsDescriptionMn",
      defaultIntroContent.destinationsDescription,
    ),
    different_luxury_en: getString(formData, "differentLuxury", defaultIntroContent.differentLuxury),
    different_luxury_mn: getString(formData, "differentLuxuryMn", defaultIntroContent.differentLuxury),
    space_to_breathe_en: sanitizeRichText(
      getString(formData, "closingHeadline", defaultIntroContent.closingHeadline),
    ),
    space_to_breathe_mn: sanitizeRichText(
      getString(
        formData,
        "closingHeadlineMn",
        defaultIntroContent.closingHeadlineMn ?? defaultIntroContent.closingHeadline,
      ),
    ),
    time_to_stay_en: "",
    time_to_stay_mn: "",
    closing_en: getString(formData, "closing", defaultIntroContent.closing),
    closing_mn: getString(formData, "closingMn", defaultIntroContent.closing),
    hero_image: getString(formData, "heroImage", defaultIntroContent.heroImage),
  };

  const { error } = await client.from("home_content").upsert(payload, { onConflict: "slug" });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");

  return { ok: true, message: "Intro section has been updated." };
}

export async function saveResortContent(formData: FormData) {
  await requireAdminSession();
  if (!isSupabaseAuthConfigured()) {
    return { ok: false, message: "Supabase environment variables are not configured." };
  }
  const client = await createSupabaseServerClient();

  const slug = String(formData.get("slug") ?? "");

  if (!slug) {
    return { ok: false, message: "Resort slug is required." };
  }

  const fallback = destinations.find((destination) => destination.slug === slug) ?? destinations[0];
  let stayData: Record<string, unknown>[] | null;
  let activityData: Record<string, unknown>[] | null;
  let colors: {
    accent: string;
    heroGradientColor: string;
    themeBackground: string;
    themeText: string;
    contentBackground: string;
    contentText: string;
    mutedColor: string;
    lineColor: string;
  };

  try {
    stayData = parseObjectList(formData, "stay");
    activityData = parseObjectList(formData, "activities");
    colors = {
      accent: getColor(formData, "accent", fallback.accent),
      heroGradientColor: getColor(
        formData,
        "heroGradientColor",
        fallback.heroGradientColor,
      ),
      themeBackground: getColor(
        formData,
        "themeBackground",
        fallback.themeBackground,
      ),
      themeText: getColor(formData, "themeText", fallback.themeText),
      contentBackground: getColor(
        formData,
        "contentBackground",
        fallback.contentBackground,
      ),
      contentText: getColor(formData, "contentText", fallback.contentText),
      mutedColor: getColor(formData, "mutedColor", fallback.mutedColor),
      lineColor: getColor(formData, "lineColor", fallback.lineColor),
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Invalid resort content.",
    };
  }

  const resortPayload = {
    slug,
    updated_at: new Date().toISOString(),
    name_en: getString(formData, "name", fallback.name),
    name_mn: getString(formData, "nameMn", fallback.name),
    region_en: getString(formData, "region", fallback.region),
    region_mn: getString(formData, "regionMn", fallback.region),
    eyebrow_en: getString(formData, "eyebrow", fallback.eyebrow),
    eyebrow_mn: getString(formData, "eyebrowMn", fallback.eyebrow),
    signature_en: getString(formData, "signature", fallback.signature),
    signature_mn: getString(formData, "signatureMn", fallback.signature),
    description_en: sanitizeRichText(getString(formData, "description", fallback.description)),
    description_mn: sanitizeRichText(getString(formData, "descriptionMn", fallback.description)),
    about_image: getString(formData, "aboutImage", fallback.aboutImage),
    image: getString(formData, "image", fallback.image),
    accent: colors.accent,
    hero_gradient_color: colors.heroGradientColor,
    theme_background: colors.themeBackground,
    theme_text: colors.themeText,
    content_background: colors.contentBackground,
    content_text: colors.contentText,
    muted_color: colors.mutedColor,
    line_color: colors.lineColor,
    logo: getString(formData, "logo", fallback.logo),
    logo_mark: getString(formData, "logoMark", fallback.logoMark),
    map_url: getString(formData, "mapUrl", fallback.mapUrl),
    map_center: getString(formData, "mapCenter", fallback.mapCenter),
    phone: getString(formData, "phone", fallback.phone),
    arrival_text_en: getString(formData, "arrivalText", fallback.arrivalText),
    arrival_text_mn: getString(formData, "arrivalTextMn", fallback.arrivalText),
    contact_text_en: getString(formData, "contactText", fallback.contactText),
    contact_text_mn: getString(formData, "contactTextMn", fallback.contactText),
    featured_restaurant_title_en: getString(
      formData,
      "featuredRestaurantTitle",
      fallback.featuredRestaurant.title,
    ),
    featured_restaurant_title_mn: getString(
      formData,
      "featuredRestaurantTitleMn",
      fallback.featuredRestaurant.title,
    ),
    featured_restaurant_text_en: getString(
      formData,
      "featuredRestaurantText",
      fallback.featuredRestaurant.text,
    ),
    featured_restaurant_text_mn: getString(
      formData,
      "featuredRestaurantTextMn",
      fallback.featuredRestaurant.text,
    ),
    restaurant_gallery_configured: formData.has("restaurantGallery"),
  };

  const aboutParagraphs = parseTextList(formData.get("aboutText")).map(sanitizeRichText);
  const aboutParagraphsMn = parseTextList(formData.get("aboutTextMn")).map(sanitizeRichText);
  const galleryImages = parseArrayString(formData.get("gallery"));
  const restaurantImages = parseArrayString(formData.get("restaurantGallery"));

  const resortResult = await client.from("resorts").upsert(resortPayload, { onConflict: "slug" });

  if (resortResult.error) {
    if (resortResult.error.code === "42501") {
      return {
        ok: false,
        message:
          'Supabase denied this write with row-level security. Run supabase/schema.sql in the Supabase SQL Editor, set this user\'s app_metadata.role to "admin", and sign in again.',
      };
    }
    return { ok: false, message: resortResult.error.message };
  }

  if (formData.has("aboutText")) {
    const { error: deleteError } = await client.from("resort_about_texts").delete().eq("resort_slug", slug);
    if (deleteError) return { ok: false, message: deleteError.message };
    if (aboutParagraphs.length > 0) {
      const { error } = await client.from("resort_about_texts").insert(
        aboutParagraphs.map((paragraph, index) => ({
        resort_slug: slug,
        paragraph_en: paragraph,
        paragraph_mn: aboutParagraphsMn[index] ?? paragraph,
        sort_order: index,
        })),
      );
      if (error) return { ok: false, message: error.message };
    }
  }

  if (formData.has("gallery")) {
    const { error: deleteError } = await client.from("resort_galleries").delete().eq("resort_slug", slug);
    if (deleteError) return { ok: false, message: deleteError.message };
    if (galleryImages.length > 0) {
      const { error } = await client.from("resort_galleries").insert(
        galleryImages.map((imageUrl, index) => ({
        resort_slug: slug,
        image_url: imageUrl,
        sort_order: index,
        })),
      );
      if (error) return { ok: false, message: error.message };
    }
  }

  if (formData.has("restaurantGallery")) {
    const { error: deleteError } = await client
      .from("resort_restaurant_galleries")
      .delete()
      .eq("resort_slug", slug);
    if (deleteError) return { ok: false, message: deleteError.message };
    if (restaurantImages.length > 0) {
      const { error } = await client.from("resort_restaurant_galleries").insert(
        restaurantImages.map((imageUrl, index) => ({
          resort_slug: slug,
          image_url: imageUrl,
          sort_order: index,
        })),
      );
      if (error) return { ok: false, message: error.message };
    }
  }

  if (stayData !== null) {
    const { error: deleteError } = await client.from("resort_accommodations").delete().eq("resort_slug", slug);
    if (deleteError) return { ok: false, message: deleteError.message };
    if (stayData.length > 0) {
      const { error } = await client.from("resort_accommodations").insert(
        stayData.map((item, index) => {
          const images = Array.isArray(item.gallery)
            ? item.gallery.filter((image): image is string => typeof image === "string" && image.length > 0)
            : [];
          return {
            resort_slug: slug,
            title_en: String(item.title ?? "Accommodation"),
            title_mn: String(item.titleMn ?? item.title ?? "Accommodation"),
            description_en: String(item.description ?? ""),
            description_mn: String(item.descriptionMn ?? item.description ?? ""),
            image: String(images[0] || item.image || "/images/2.jpg"),
            images,
            sort_order: index,
          };
        }),
      );
      if (error) return { ok: false, message: error.message };
    }
  }

  if (activityData !== null) {
    const { error: deleteError } = await client.from("resort_activities").delete().eq("resort_slug", slug);
    if (deleteError) return { ok: false, message: deleteError.message };
    if (activityData.length > 0) {
      const { error } = await client.from("resort_activities").insert(
        activityData.map((item, index) => ({
          resort_slug: slug,
          title_en: String(item.title ?? ""),
          title_mn: String(item.titleMn ?? item.title ?? ""),
          text_en: String(item.text ?? ""),
          text_mn: String(item.textMn ?? item.text ?? ""),
          image: String(item.image ?? "/images/2.jpg"),
          sort_order: index,
        })),
      );
      if (error) return { ok: false, message: error.message };
    }
  }

  revalidatePath(`/resorts/${slug}`);
  revalidatePath("/");

  return { ok: true, message: `${resortPayload.name_en} has been updated.` };
}
