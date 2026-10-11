"use client";

import {
  loadResortContent,
  saveResortContent,
} from "@/app/actions/site-content";
import { destinations, type Destination } from "@/data/destinations";
import { localizeDestination } from "@/data/destination-locales";
import ResortHero from "@/components/ResortHero";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import LocationPicker from "@/components/admin/LocationPicker";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const tabs = [
  { id: "general", label: "General" },
  { id: "accommodation", label: "Accommodation" },
  { id: "restaurant", label: "Restaurant" },
  { id: "activities", label: "Activities" },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About us" },
  { id: "location", label: "Location" },
  { id: "contact", label: "Contact us" },
];

type CloudinaryImage = {
  publicId: string;
  url: string;
  thumbnail: string;
};

function RemoveImageButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-700"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="m19 6-1 14H6L5 6" />
        <path d="M10 11v5M14 11v5" />
      </svg>
    </button>
  );
}

export default function ResortDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug ?? "alungoo";
  const initial = useMemo(
    () => destinations.find((item) => item.slug === slug) ?? destinations[0],
    [slug],
  );
  const [form, setForm] = useState<Destination>({
    ...initial,
    nameMn: initial.nameMn ?? initial.name,
    regionMn: initial.regionMn ?? initial.region,
    eyebrowMn: initial.eyebrowMn ?? initial.eyebrow,
    signatureMn: initial.signatureMn ?? initial.signature,
    descriptionMn: initial.descriptionMn ?? initial.description,
    aboutTextMn: initial.aboutTextMn ?? initial.aboutText,
    featuredRestaurantMn:
      initial.featuredRestaurantMn ?? initial.featuredRestaurant,
    arrivalTextMn: initial.arrivalTextMn ?? initial.arrivalText,
    contactTextMn: initial.contactTextMn ?? initial.contactText,
    factsMn: initial.factsMn ?? initial.facts,
    activitiesMn:
      initial.activitiesMn ?? localizeDestination(initial, "mn").activities,
    stayMn: initial.stayMn ?? localizeDestination(initial, "mn").stay,
  });
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loadingContent, setLoadingContent] = useState(true);
  const [availableImages, setAvailableImages] = useState<CloudinaryImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [imageLibraryError, setImageLibraryError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    setAvailableImages([]);
    setLoadingImages(true);
    setImageLibraryError("");

    fetch(`/api/cloudinary/images?resort=${encodeURIComponent(slug)}`)
      .then(async (response) => {
        const result: unknown = await response.json();
        if (!response.ok) {
          const message =
            typeof result === "object" &&
            result !== null &&
            "error" in result &&
            typeof result.error === "string"
              ? result.error
              : "Unable to load project images.";
          throw new Error(message);
        }
        if (
          typeof result !== "object" ||
          result === null ||
          !("files" in result) ||
          !Array.isArray(result.files) ||
          !result.files.every(
            (file) =>
              typeof file === "object" &&
              file !== null &&
              "publicId" in file &&
              typeof file.publicId === "string" &&
              "url" in file &&
              typeof file.url === "string" &&
              "thumbnail" in file &&
              typeof file.thumbnail === "string",
          )
        ) {
          throw new Error(
            "The project image list returned an invalid response.",
          );
        }
        if (isCurrent) setAvailableImages(result.files);
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setImageLibraryError(
            error instanceof Error
              ? error.message
              : "Unable to load project images.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setLoadingImages(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [slug]);

  useEffect(() => {
    const nextTab = searchParams.get("tab") ?? "general";
    const paramsObj = new URLSearchParams(searchParams.toString());
    if (!searchParams.get("tab")) {
      paramsObj.set("tab", nextTab);
      router.replace(`/admin/resorts/${slug}?${paramsObj.toString()}`, {
        scroll: false,
      });
    }
  }, [router, searchParams, slug]);

  useEffect(() => {
    setForm({
      ...initial,
      nameMn: initial.nameMn ?? initial.name,
      regionMn: initial.regionMn ?? initial.region,
      eyebrowMn: initial.eyebrowMn ?? initial.eyebrow,
      signatureMn: initial.signatureMn ?? initial.signature,
      descriptionMn: initial.descriptionMn ?? initial.description,
      aboutTextMn: initial.aboutTextMn ?? initial.aboutText,
      featuredRestaurantMn:
        initial.featuredRestaurantMn ?? initial.featuredRestaurant,
      arrivalTextMn: initial.arrivalTextMn ?? initial.arrivalText,
      contactTextMn: initial.contactTextMn ?? initial.contactText,
      factsMn: initial.factsMn ?? initial.facts,
      activitiesMn:
        initial.activitiesMn ?? localizeDestination(initial, "mn").activities,
      stayMn: initial.stayMn ?? localizeDestination(initial, "mn").stay,
    });
    setStatus("");
  }, [initial]);

  useEffect(() => {
    let isCurrent = true;
    setLoadingContent(true);

    loadResortContent(slug)
      .then((content) => {
        if (!isCurrent || !content) return;

        setForm({
          ...content,
          activitiesMn:
            content.activitiesMn ??
            localizeDestination(content, "mn").activities,
          stayMn: content.stayMn ?? localizeDestination(content, "mn").stay,
        });
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setStatus(
            error instanceof Error
              ? error.message
              : "Unable to load resort content.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setLoadingContent(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [slug]);

  const activeTab = searchParams.get("tab") ?? "general";

  const updateForm = <K extends keyof Destination>(
    key: K,
    value: Destination[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateAccommodation = (
    index: number,
    field: "title" | "description" | "image",
    value: string,
  ) => {
    setForm((current) => {
      const stay = [...current.stay];
      stay[index] = { ...stay[index], [field]: value };
      return { ...current, stay };
    });
  };

  const updateAccommodationTranslation = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    setForm((current) => {
      const stayMn = [
        ...(current.stayMn ?? localizeDestination(current, "mn").stay),
      ];
      stayMn[index] = { ...stayMn[index], [field]: value };
      return { ...current, stayMn };
    });
  };

  const addAccommodation = () => {
    setForm((current) => {
      const number = current.stay.length + 1;
      return {
        ...current,
        stay: [
          ...current.stay,
          {
            title: `New accommodation ${number}`,
            description: "",
            image: "",
            gallery: [],
          },
        ],
        stayMn: [
          ...(current.stayMn ?? []),
          {
            title: `Шинэ байрлах байр ${number}`,
            description: "",
            image: "",
            gallery: [],
          },
        ],
      };
    });
  };

  const removeAccommodation = (index: number) => {
    setForm((current) => ({
      ...current,
      stay: current.stay.filter((_, idx) => idx !== index),
      stayMn: current.stayMn?.filter((_, idx) => idx !== index),
    }));
  };

  const removeAccommodationImage = (index: number, imageIndex: number) => {
    setForm((current) => {
      const stay = [...current.stay];
      const images = [
        ...(stay[index].gallery ?? [stay[index].image].filter(Boolean)),
      ];
      images.splice(imageIndex, 1);
      stay[index] = { ...stay[index], image: images[0] ?? "", gallery: images };

      const stayMn = [...(current.stayMn ?? [])];
      if (stayMn[index])
        stayMn[index] = {
          ...stayMn[index],
          image: images[0] ?? "",
          gallery: images,
        };
      return { ...current, stay, stayMn };
    });
  };

  const removeRestaurantImage = (imageIndex: number) => {
    updateForm(
      "restaurantGallery",
      form.restaurantGallery.filter((_, index) => index !== imageIndex),
    );
  };

  const removeGalleryImage = (imageIndex: number) => {
    updateForm(
      "gallery",
      form.gallery.filter((_, index) => index !== imageIndex),
    );
  };

  const updateActivity = (
    index: number,
    locale: "en" | "mn",
    field: "title" | "text",
    value: string,
  ) => {
    setForm((current) => {
      if (locale === "en") {
        const activities = [...current.activities];
        activities[index] = { ...activities[index], [field]: value };
        return { ...current, activities };
      }

      const activitiesMn = [
        ...(current.activitiesMn ??
          localizeDestination(current, "mn").activities),
      ];
      activitiesMn[index] = { ...activitiesMn[index], [field]: value };
      return { ...current, activitiesMn };
    });
  };

  const addActivity = () => {
    setForm((current) => {
      const number = current.activities.length + 1;
      return {
        ...current,
        activities: [
          ...current.activities,
          { title: `New activity ${number}`, text: "", image: "/images/2.jpg" },
        ],
        activitiesMn: [
          ...(current.activitiesMn ?? []),
          {
            title: `Шинэ үйл ажиллагаа ${number}`,
            text: "",
            image: "/images/2.jpg",
          },
        ],
      };
    });
  };

  const removeActivity = (index: number) => {
    setForm((current) => ({
      ...current,
      activities: current.activities.filter((_, idx) => idx !== index),
      activitiesMn: current.activitiesMn?.filter((_, idx) => idx !== index),
    }));
  };

  const uploadImage = async (
    file: File,
    target: "main" | "about" | "activity" | "gallery" | "restaurant",
    index?: number,
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", `site/${slug}`);

    try {
      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result.url)
        throw new Error(result.error || "Upload failed");

      if (target === "main") {
        setForm((current) => ({
          ...current,
          image: result.url,
          aboutImage: current.aboutImage || result.url,
        }));
      }
      if (target === "about") {
        setForm((current) => ({ ...current, aboutImage: result.url }));
      }
      if (target === "activity" && typeof index === "number") {
        setForm((current) => {
          const activities = [...current.activities];
          activities[index] = { ...activities[index], image: result.url };
          const activitiesMn = [...(current.activitiesMn ?? [])];
          if (activitiesMn[index])
            activitiesMn[index] = { ...activitiesMn[index], image: result.url };
          return { ...current, activities, activitiesMn };
        });
      }
      if (target === "gallery") {
        setForm((current) => ({
          ...current,
          gallery: [...current.gallery, result.url],
        }));
      }
      if (target === "restaurant") {
        setForm((current) => ({
          ...current,
          restaurantGallery: [...current.restaurantGallery, result.url],
        }));
      }

      setStatus("Image uploaded successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const uploadAccommodationImages = async (files: FileList, index: number) => {
    setUploading(true);
    setStatus("");

    try {
      const imageUrls = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", `site/${slug}/accommodations`);

          const response = await fetch("/api/cloudinary/upload", {
            method: "POST",
            body: formData,
          });
          const result = await response.json();
          if (!response.ok || !result.url)
            throw new Error(result.error || "Upload failed");
          return String(result.url);
        }),
      );

      setForm((current) => {
        const stay = [...current.stay];
        const images = [...(stay[index].gallery ?? []), ...imageUrls];
        stay[index] = {
          ...stay[index],
          image: images[0] ?? "",
          gallery: images,
        };

        const stayMn = [...(current.stayMn ?? [])];
        if (stayMn[index])
          stayMn[index] = {
            ...stayMn[index],
            image: images[0] ?? "",
            gallery: images,
          };
        return { ...current, stay, stayMn };
      });
      setStatus("Accommodation photos uploaded successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const setTab = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`/admin/resorts/${slug}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleSave = async () => {
    const data = new FormData();
    data.set("slug", slug);
    data.set("name", form.name);
    data.set("nameMn", form.nameMn ?? form.name);
    data.set("region", form.region);
    data.set("regionMn", form.regionMn ?? form.region);
    data.set("eyebrow", form.eyebrow);
    data.set("eyebrowMn", form.eyebrowMn ?? form.eyebrow);
    data.set("signature", form.signature);
    data.set("signatureMn", form.signatureMn ?? form.signature);
    data.set("description", form.description);
    data.set("descriptionMn", form.descriptionMn ?? form.description);
    data.set("image", form.image);
    data.set("aboutImage", form.aboutImage);
    data.set("mapUrl", form.mapUrl);
    data.set("mapCenter", form.mapCenter);
    data.set("phone", form.phone);
    data.set("arrivalText", form.arrivalText);
    data.set("arrivalTextMn", form.arrivalTextMn ?? form.arrivalText);
    data.set("contactText", form.contactText);
    data.set("contactTextMn", form.contactTextMn ?? form.contactText);
    data.set("featuredRestaurantTitle", form.featuredRestaurant.title);
    data.set(
      "featuredRestaurantTitleMn",
      form.featuredRestaurantMn?.title ?? form.featuredRestaurant.title,
    );
    data.set("featuredRestaurantText", form.featuredRestaurant.text);
    data.set(
      "featuredRestaurantTextMn",
      form.featuredRestaurantMn?.text ?? form.featuredRestaurant.text,
    );
    data.set("aboutText", form.aboutText.join("\n\n"));
    data.set("aboutTextMn", (form.aboutTextMn ?? form.aboutText).join("\n\n"));
    data.set("gallery", JSON.stringify(form.gallery));
    data.set("restaurantGallery", JSON.stringify(form.restaurantGallery));
    data.set(
      "stay",
      JSON.stringify(
        form.stay.map((stay, index) => ({
          ...stay,
          titleMn: form.stayMn?.[index]?.title ?? stay.title,
          descriptionMn: form.stayMn?.[index]?.description ?? stay.description,
        })),
      ),
    );
    data.set(
      "activities",
      JSON.stringify(
        form.activities.map((activity, index) => ({
          ...activity,
          titleMn: form.activitiesMn?.[index]?.title ?? activity.title,
          textMn: form.activitiesMn?.[index]?.text ?? activity.text,
        })),
      ),
    );
    const result = await saveResortContent(data);
    setStatus(result.message);
  };

  const updateMapLocation = (coordinates: string) => {
    updateForm("mapCenter", coordinates);
    const [latitude, longitude] = coordinates.split(",");
    updateForm(
      "mapUrl",
      `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=12/${latitude}/${longitude}`,
    );
  };

  const renderPanel = () => {
    if (activeTab === "general") {
      return (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                  Camp Name (EN)
                </label>
                <input
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className="w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                  Camp Name (MN)
                </label>
                <input
                  value={form.nameMn ?? form.name}
                  onChange={(e) => updateForm("nameMn", e.target.value as any)}
                  className="w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                  Location (EN)
                </label>
                <input
                  value={form.region}
                  onChange={(e) => updateForm("region", e.target.value)}
                  className="w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                  Location (MN)
                </label>
                <input
                  value={form.regionMn ?? form.region}
                  onChange={(e) =>
                    updateForm("regionMn", e.target.value as any)
                  }
                  className="w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                  Short Description (EN)
                </label>
                <textarea
                  value={form.signature}
                  onChange={(e) => updateForm("signature", e.target.value)}
                  className="min-h-[90px] w-full resize-none rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                  Short Description (MN)
                </label>
                <textarea
                  value={form.signatureMn ?? form.signature}
                  onChange={(e) =>
                    updateForm("signatureMn", e.target.value as any)
                  }
                  className="min-h-[90px] w-full resize-none rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                Main Image
              </label>
              <div className="flex items-center gap-3 rounded-md border border-[#dfe2df] bg-white p-2.5">
                <div className="h-20 w-24 overflow-hidden rounded-md border border-[#ece2d6] bg-[#ece7e1]">
                  <img
                    src={form.image}
                    alt={form.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <label className="cursor-pointer rounded-full border border-[#dfe2df] bg-[#f7f7f4] px-3 py-2 text-sm text-[#1b1d1f]">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        setUploading(true);
                        void uploadImage(file, "main").finally(() => {
                          event.target.value = "";
                        });
                      }
                    }}
                  />
                </label>
              </div>

              <div className="mt-3 hidden">
                <p className="mb-2 text-sm font-medium text-[#4b5860]">
                  Or choose an existing image
                </p>
                <div className="flex flex-wrap gap-2">
                  {loadingImages ? (
                    <p className="text-sm text-[#68766f]">
                      Loading project images...
                    </p>
                  ) : imageLibraryError ? (
                    <p role="alert" className="text-sm text-red-700">
                      {imageLibraryError}
                    </p>
                  ) : availableImages.length === 0 ? (
                    <p className="text-sm text-[#68766f]">
                      No project images were found.
                    </p>
                  ) : (
                    availableImages.map((image) => (
                      <button
                        key={image.publicId}
                        type="button"
                        aria-label={`Use ${image.publicId} as the main image`}
                        aria-pressed={form.image === image.url}
                        onClick={() => updateForm("image", image.url)}
                        className={[
                          "overflow-hidden rounded-md border-2 p-0.5 transition",
                          form.image === image.url
                            ? "border-[#1a3b34]"
                            : "border-[#dfe2df] hover:border-[#8e9b95]",
                        ].join(" ")}
                      >
                        <img
                          src={image.thumbnail}
                          alt=""
                          className="h-14 w-14 object-cover"
                        />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`destination-page theme-${form.theme} overflow-hidden rounded-[14px] border border-[#e3dfd8] p-3`}
          >
            <div className="mb-3 text-[12px] uppercase tracking-[0.18em] text-[#6b7379]">
              Preview
            </div>
            <div className="overflow-hidden rounded-[12px] border border-[#e1ddd7]">
              <ResortHero
                destination={localizeDestination(form, "en")}
                preview
              />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "accommodation") {
      return (
        <div className="space-y-4">
          {form.stay.map((stay, index) => (
            <div
              key={`${stay.title}-${index}`}
              className="rounded-[14px] border border-[#e3dfd8] bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[16px] font-semibold text-[#1d2124]">
                  Accommodation {index + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeAccommodation(index)}
                  className="rounded-full border border-[#dfe2df] bg-[#f7f7f4] px-3 py-1.5 text-xs text-[#1b1d1f]"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                      Title (EN)
                    </label>
                    <input
                      value={stay.title}
                      onChange={(e) =>
                        updateAccommodation(index, "title", e.target.value)
                      }
                      className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                      Title (MN)
                    </label>
                    <input
                      value={form.stayMn?.[index]?.title ?? ""}
                      onChange={(e) =>
                        updateAccommodationTranslation(
                          index,
                          "title",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                      Description (EN)
                    </label>
                    <textarea
                      value={stay.description}
                      onChange={(event) =>
                        updateAccommodation(
                          index,
                          "description",
                          event.target.value,
                        )
                      }
                      className="min-h-[100px] w-full resize-none rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                      Description (MN)
                    </label>
                    <textarea
                      value={form.stayMn?.[index]?.description ?? ""}
                      onChange={(event) =>
                        updateAccommodationTranslation(
                          index,
                          "description",
                          event.target.value,
                        )
                      }
                      className="min-h-[100px] w-full resize-none rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="overflow-hidden rounded-md border border-[#e4dfd8] bg-[#f2efe9]">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {(stay.gallery ?? []).map((image, imageIndex) => (
                        <div
                          key={`${image}-${imageIndex}`}
                          className="relative overflow-hidden rounded-md border border-[#e4dfd8] bg-[#f2efe9]"
                        >
                          <img
                            src={image}
                            alt={`${stay.title} ${imageIndex + 1}`}
                            className="aspect-video w-full object-cover"
                          />
                          <RemoveImageButton
                            label={`Remove accommodation photo ${imageIndex + 1}`}
                            onClick={() =>
                              removeAccommodationImage(index, imageIndex)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <label className="block cursor-pointer rounded-full border border-[#dfe2df] bg-[#f7f7f4] px-3 py-2 text-center text-sm text-[#1b1d1f]">
                    + Add photos
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        const files = event.target.files;
                        if (files?.length)
                          uploadAccommodationImages(files, index);
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addAccommodation}
            className="rounded-full bg-[#1b3b34] px-4 py-2 text-sm font-medium text-white"
          >
            + Add Accommodation
          </button>
        </div>
      );
    }

    if (activeTab === "restaurant") {
      return (
        <div className="space-y-4 rounded-[14px] border border-[#e3dfd8] bg-white p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                Restaurant title (EN)
              </label>
              <input
                value={form.featuredRestaurant.title}
                onChange={(e) =>
                  updateForm("featuredRestaurant", {
                    ...form.featuredRestaurant,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                Restaurant title (MN)
              </label>
              <input
                value={
                  form.featuredRestaurantMn?.title ??
                  form.featuredRestaurant.title
                }
                onChange={(e) =>
                  updateForm("featuredRestaurantMn", {
                    ...(form.featuredRestaurantMn ?? form.featuredRestaurant),
                    title: e.target.value,
                  })
                }
                className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                Description (EN)
              </label>
              <textarea
                value={form.featuredRestaurant.text}
                onChange={(event) =>
                  updateForm("featuredRestaurant", {
                    ...form.featuredRestaurant,
                    text: event.target.value,
                  })
                }
                className="min-h-[120px] w-full resize-none rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                Description (MN)
              </label>
              <textarea
                value={
                  form.featuredRestaurantMn?.text ??
                  form.featuredRestaurant.text
                }
                onChange={(event) =>
                  updateForm("featuredRestaurantMn", {
                    ...(form.featuredRestaurantMn ?? form.featuredRestaurant),
                    text: event.target.value,
                  })
                }
                className="min-h-[120px] w-full resize-none rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
            {form.restaurantGallery.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative aspect-video overflow-hidden rounded-md border border-[#e4dfd8] bg-[#f2efe9]"
              >
                <img
                  src={image}
                  alt="Restaurant"
                  className="h-full w-full object-cover"
                />
                <RemoveImageButton
                  label={`Remove restaurant photo ${index + 1}`}
                  onClick={() => removeRestaurantImage(index)}
                />
              </div>
            ))}
          </div>
          <label className="inline-block cursor-pointer rounded-full bg-[#1b3b34] px-4 py-2 text-sm font-medium text-white">
            + Add photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setUploading(true);
                  uploadImage(file, "restaurant");
                  event.target.value = "";
                }
              }}
            />
          </label>
        </div>
      );
    }

    if (activeTab === "activities") {
      return (
        <div className="space-y-4">
          {form.activities.map((activity, index) => (
            <div
              key={`${activity.title}-${index}`}
              className="rounded-[14px] border border-[#e3dfd8] bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[16px] font-semibold text-[#1d2124]">
                  Activity {index + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeActivity(index)}
                  className="rounded-full border border-[#dfe2df] bg-[#f7f7f4] px-3 py-1.5 text-xs text-[#1b1d1f]"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                      Title (EN)
                    </label>
                    <input
                      value={activity.title}
                      onChange={(e) =>
                        updateActivity(index, "en", "title", e.target.value)
                      }
                      className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                      Title (MN)
                    </label>
                    <input
                      value={form.activitiesMn?.[index]?.title ?? ""}
                      onChange={(e) =>
                        updateActivity(index, "mn", "title", e.target.value)
                      }
                      className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                      Description (EN)
                    </label>
                    <textarea
                      value={activity.text}
                      onChange={(event) =>
                        updateActivity(index, "en", "text", event.target.value)
                      }
                      className="min-h-[90px] w-full resize-none rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                      Description (MN)
                    </label>
                    <textarea
                      value={form.activitiesMn?.[index]?.text ?? ""}
                      onChange={(event) =>
                        updateActivity(index, "mn", "text", event.target.value)
                      }
                      className="min-h-[90px] w-full resize-none rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="overflow-hidden rounded-md border border-[#e4dfd8] bg-[#f2efe9]">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="h-[150px] w-full object-cover"
                    />
                  </div>
                  <label className="block cursor-pointer rounded-full border border-[#dfe2df] bg-[#f7f7f4] px-3 py-2 text-center text-sm text-[#1b1d1f]">
                    Upload image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setUploading(true);
                          uploadImage(file, "activity", index);
                          event.target.value = "";
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addActivity}
            className="rounded-full bg-[#1b3b34] px-4 py-2 text-sm font-medium text-white"
          >
            + Add Activity
          </button>
        </div>
      );
    }

    if (activeTab === "gallery") {
      return (
        <div className="rounded-[14px] border border-[#e3dfd8] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[18px] font-semibold text-[#1d2124]">
              Gallery
            </div>
            <label className="cursor-pointer rounded-full bg-[#1b3b34] px-3 py-2 text-sm font-medium text-white">
              + Add Photos
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setUploading(true);
                    uploadImage(file, "gallery");
                    event.target.value = "";
                  }
                }}
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {form.gallery.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative aspect-video overflow-hidden rounded-md border border-[#e4dfd8] bg-[#f2efe9]"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <RemoveImageButton
                  label={`Remove gallery photo ${index + 1}`}
                  onClick={() => removeGalleryImage(index)}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableImages.map((image) => (
              <button
                key={image.publicId}
                type="button"
                onClick={() =>
                  updateForm("gallery", [...form.gallery, image.url])
                }
                className="overflow-hidden rounded-md border border-[#dfe2df] bg-[#f7f7f4] p-0.5"
              >
                <img
                  src={image.thumbnail}
                  alt={image.publicId}
                  className="h-12 w-12 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "about") {
      return (
        <div className="space-y-4 rounded-[14px] border border-[#e3dfd8] bg-white p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                About us (EN)
              </label>
              <AdminRichTextEditor
                value={form.aboutText.join("\n\n")}
                onChange={(value) =>
                  updateForm("aboutText", [value])
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4b5860]">
                About us (MN)
              </label>
              <AdminRichTextEditor
                value={(form.aboutTextMn ?? form.aboutText).join("\n\n")}
                onChange={(value) =>
                  updateForm("aboutTextMn", [value])
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#4b5860]">
              About us image
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="aspect-video w-full max-w-sm overflow-hidden rounded-md border border-[#e4dfd8] bg-[#f2efe9]">
                <img
                  src={form.aboutImage}
                  alt="About us preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <label className="cursor-pointer rounded-full border border-[#dfe2df] bg-[#f7f7f4] px-4 py-2 text-sm text-[#1b1d1f]">
                {uploading ? "Uploading..." : "Change image"}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setUploading(true);
                      uploadImage(file, "about");
                      event.target.value = "";
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "location") {
      return (
        <div className="space-y-4 rounded-[14px] border border-[#e3dfd8] bg-white p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#4b5860]">
              Location
            </label>
            <input
              value={form.region}
              onChange={(e) => updateForm("region", e.target.value)}
              className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
            />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-sm font-medium text-[#4b5860]">
                Pick location on map
              </label>
              <span className="text-xs text-[#6b7379]">
                Click the map or drag the marker to set the point
              </span>
            </div>
            <LocationPicker
              coordinates={form.mapCenter}
              onChange={updateMapLocation}
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#5c646b]">
              <span>Coordinates: {form.mapCenter}</span>
              <a
                href={form.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#1b3b34] underline underline-offset-2"
              >
                Open in OpenStreetMap
              </a>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 rounded-[14px] border border-[#e3dfd8] bg-white p-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#4b5860]">
            Phone
          </label>
          <input
            value={form.phone}
            onChange={(e) => updateForm("phone", e.target.value)}
            className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#4b5860]">
              Contact message (EN)
            </label>
            <textarea
              value={form.contactText}
              onChange={(event) =>
                updateForm("contactText", event.target.value)
              }
              className="min-h-[120px] w-full resize-none rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#4b5860]">
              Contact message (MN)
            </label>
            <textarea
              value={form.contactTextMn ?? form.contactText}
              onChange={(event) =>
                updateForm("contactTextMn", event.target.value)
              }
              className="min-h-[120px] w-full resize-none rounded-md border border-[#dfe2df] bg-[#f8f7f4] px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-[#7a8087]">
            Edit camp
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-[#1c2124]">
            {form.name}
          </h1>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center rounded-full border border-[#dfe4e0] bg-white px-4 py-2 text-sm font-medium text-[#1b1d1f] shadow-sm"
        >
          Back to camps
        </Link>
      </div>

      <div className="rounded-[18px] border border-[#e5e1db] bg-[#f8f7f4] p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2 border-b border-[#e6e0d8] pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTab(tab.id)}
              className={[
                "rounded-full px-3 py-2 text-sm font-medium transition",
                activeTab === tab.id
                  ? "bg-[#1b3b34] text-white shadow-sm"
                  : "bg-white text-[#4d5960] border border-[#dfe2df] hover:bg-[#f1f4f2]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>{renderPanel()}</div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            className="px-3 py-2 text-sm font-medium text-[#4d5960]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loadingContent || uploading}
            className="rounded-full bg-[#1a3b34] px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingContent
              ? "Loading..."
              : uploading
                ? "Uploading..."
                : "Save Changes"}
          </button>
        </div>

        {status ? (
          <div className="mt-4 rounded-md border border-[#dfeae6] bg-[#edf8f1] px-3 py-2 text-sm text-[#1d5a45]">
            {status}
          </div>
        ) : null}
      </div>
    </div>
  );
}
