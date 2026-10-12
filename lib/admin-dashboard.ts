import { destinations } from "@/data/destinations";
import { createSupabaseClient } from "@/lib/supabase";

export async function getAdminDashboardStats() {
  const client = createSupabaseClient();

  if (!client) {
    return {
      totalCamps: destinations.length,
      incompleteCamps: null,
      lastUpdatedAt: null,
    };
  }

  const [resorts, homeUpdates, accommodations, activities] = await Promise.all([
    client
      .from("resorts")
      .select(
        "slug, updated_at, phone, map_center, description_en, contact_text_en",
      )
      .order("updated_at", { ascending: false }),
    client
      .from("home_content")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1),
    client.from("resort_accommodations").select("resort_slug"),
    client.from("resort_activities").select("resort_slug"),
  ]);

  const queryError =
    resorts.error ??
    homeUpdates.error ??
    accommodations.error ??
    activities.error;
  if (queryError) {
    throw new Error(`Unable to load admin dashboard stats: ${queryError.message}`);
  }

  const updateTimes = [
    resorts.data?.[0]?.updated_at,
    homeUpdates.data?.[0]?.updated_at,
  ]
    .filter((value): value is string => typeof value === "string")
    .map((value) => new Date(value))
    .filter((value) => !Number.isNaN(value.getTime()));

  const accommodationSlugs = new Set(
    accommodations.data?.map((row) => row.resort_slug) ?? [],
  );
  const activitySlugs = new Set(
    activities.data?.map((row) => row.resort_slug) ?? [],
  );
  const resortBySlug = new Map(
    (resorts.data ?? []).map((resort) => [resort.slug, resort]),
  );
  const incompleteCamps = destinations.filter((destination) => {
    const resort = resortBySlug.get(destination.slug);
    return (
      !resort ||
      !resort.phone?.trim() ||
      !resort.map_center?.trim() ||
      !resort.description_en?.trim() ||
      !resort.contact_text_en?.trim() ||
      !accommodationSlugs.has(destination.slug) ||
      !activitySlugs.has(destination.slug)
    );
  }).length;

  return {
    totalCamps: destinations.length,
    incompleteCamps,
    lastUpdatedAt:
      updateTimes.length > 0
        ? new Date(Math.max(...updateTimes.map((value) => value.getTime())))
        : null,
  };
}

export function formatLastUpdated(date: Date | null, now = new Date()) {
  if (!date) {
    return { value: "No updates", meta: "No saved content" };
  }

  const elapsedSeconds = Math.max(
    0,
    Math.floor((now.getTime() - date.getTime()) / 1000),
  );
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const unit = units.find(([, seconds]) => elapsedSeconds >= seconds);
  const value = unit
    ? relative.format(
        -Math.floor(elapsedSeconds / unit[1]),
        unit[0],
      )
    : "Just now";

  return {
    value,
    meta: new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Ulaanbaatar",
    }).format(date),
  };
}
