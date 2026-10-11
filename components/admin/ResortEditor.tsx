"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { saveResortContent } from "@/app/actions/site-content";
import type { Destination } from "@/data/destinations";

type AccommodationItem = {
  title: string;
  description: string;
  image: string;
  gallery?: string[];
};

const defaultImageOptions = [
  "/images/hoyorzagal/31.JPG",
  "/images/alungoo/30.JPG",
  "/images/guru/30.JPG",
  "/images/hoyorzagal/a1.jpg",
  "/images/alungoo/11.JPG",
  "/images/hoyorzagal/1.JPG",
  "/images/alungoo/15.jpg",
  "/images/guru/20.JPG",
];

const createAccommodation = (): AccommodationItem => ({
  title: "",
  description: "",
  image: "/images/2.jpg",
  gallery: [],
});

export default function ResortEditor({
  destination,
}: {
  destination: Destination;
}) {
  const [form, setForm] = useState({
    ...destination,
    aboutText: destination.aboutText.join("\n\n"),
    stay: destination.stay.length
      ? destination.stay.map((item) => ({
          title: item.title,
          description: item.description,
          image: item.image,
          gallery: item.gallery ?? [],
        }))
      : [createAccommodation()],
  });
  const [projectImages, setProjectImages] = useState<string[]>(defaultImageOptions);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/media/files")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.files) && data.files.length > 0) {
          setProjectImages(data.files.slice(0, 24));
        }
      })
      .catch(() => undefined);
  }, []);

  function updateAccommodation(
    index: number,
    field: keyof AccommodationItem,
    value: string,
  ) {
    setForm((current) => {
      const next = [...(current.stay as AccommodationItem[])];
      next[index] = {
        ...next[index],
        [field]: value,
      };
      return {
        ...current,
        stay: next,
      };
    });
  }

  function addAccommodation() {
    setForm((current) => ({
      ...current,
      stay: [...(current.stay as AccommodationItem[]), createAccommodation()],
    }));
  }

  function removeAccommodation(index: number) {
    setForm((current) => {
      const next = [...(current.stay as AccommodationItem[])];
      if (next.length === 1) {
        next[0] = createAccommodation();
        return { ...current, stay: next };
      }
      return { ...current, stay: next.filter((_, itemIndex) => itemIndex !== index) };
    });
  }

  async function uploadImage(
    file: File,
    target: "hero" | "accommodation",
    index?: number,
  ) {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("folder", `site/${destination.slug}`);

    try {
      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: payload,
      });
      const result = await response.json();

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Upload failed.");
      }

      if (target === "hero") {
        setForm((current) => ({ ...current, image: result.url }));
      } else if (typeof index === "number") {
        setForm((current) => {
          const next = [...(current.stay as AccommodationItem[])];
          next[index] = { ...next[index], image: result.url };
          return { ...current, stay: next };
        });
      }

      setStatus("Image uploaded to Cloudinary.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      setUploadingIndex(null);
    }
  }

  async function handleHeroUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setIsUploading(true);
    await uploadImage(file, "hero");
    event.target.value = "";
  }

  async function handleAccommodationUpload(
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setIsUploading(true);
    setUploadingIndex(index);
    await uploadImage(file, "accommodation", index);
    event.target.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanStay = (form.stay as AccommodationItem[]).filter(
      (item) => item.title.trim() || item.description.trim() || item.image.trim(),
    );

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "stay") {
        return;
      }
      if (Array.isArray(value)) {
        data.append(key, JSON.stringify(value));
        return;
      }
      if (value !== null && value !== undefined) {
        data.append(key, String(value));
      }
    });

    data.set("stay", JSON.stringify(cleanStay));
    data.set("slug", destination.slug);
    const result = await saveResortContent(data);
    setStatus(result.message);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(16,19,25,0.45)] md:p-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.38em] text-[#d4a15d]">Overview</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Resort profile</h3>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[#d4a15d] px-5 py-2.5 text-sm font-medium text-[#171a1d] transition hover:brightness-110"
          >
            Save resort
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-white/60">Resort name</label>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0b0d0f] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/60">Slug</label>
            <input
              value={destination.slug}
              readOnly
              className="w-full rounded-2xl border border-white/10 bg-[#0b0d0f] px-3 py-2.5 text-white/60 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/60">Region</label>
            <input
              value={form.region}
              onChange={(event) => setForm({ ...form, region: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0b0d0f] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/60">Eyebrow</label>
            <input
              value={form.eyebrow}
              onChange={(event) => setForm({ ...form, eyebrow: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0b0d0f] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-white/60">Short description</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-[#0b0d0f] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-white/60">Signature line</label>
            <textarea
              value={form.signature}
              onChange={(event) => setForm({ ...form, signature: event.target.value })}
              className="min-h-[90px] w-full rounded-2xl border border-white/10 bg-[#0b0d0f] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-white/60">About text</label>
            <textarea
              value={form.aboutText}
              onChange={(event) => setForm({ ...form, aboutText: event.target.value })}
              className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-[#0b0d0f] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/60">Main image URL</label>
            <input
              value={form.image}
              onChange={(event) => setForm({ ...form, image: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0b0d0f] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/60">Upload main image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleHeroUpload}
              className="w-full rounded-2xl border border-dashed border-white/20 bg-[#0b0d0f] px-3 py-3 text-sm text-white/75"
            />
            {isUploading && <div className="text-sm text-[#d4a15d]">Uploading...</div>}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/60">Accent color</label>
            <input
              value={form.accent}
              onChange={(event) => setForm({ ...form, accent: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0b0d0f] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/60">Phone</label>
            <input
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0b0d0f] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-white/60">Contact text</label>
            <textarea
              value={form.contactText}
              onChange={(event) => setForm({ ...form, contactText: event.target.value })}
              className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-[#0b0d0f] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
            />
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 md:p-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.38em] text-[#d4a15d]">Accommodation</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">House types</h3>
          </div>
          <button
            type="button"
            onClick={addAccommodation}
            className="rounded-full border border-[#d4a15d]/50 bg-[#d4a15d]/10 px-4 py-2 text-sm text-[#f2d7a2] transition hover:bg-[#d4a15d]/20"
          >
            + Add accommodation
          </button>
        </div>

        <div className="space-y-5">
          {(form.stay as AccommodationItem[]).map((accommodation, index) => (
            <div
              key={`${destination.slug}-stay-${index}`}
              className="rounded-3xl border border-white/10 bg-[#0b0d0f] p-4 md:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">
                  Accommodation {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeAccommodation(index)}
                  className="text-xs text-white/50 transition hover:text-[#f0b86c]"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Accommodation title</label>
                    <input
                      value={accommodation.title}
                      onChange={(event) =>
                        updateAccommodation(index, "title", event.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#111417] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Description</label>
                    <textarea
                      value={accommodation.description}
                      onChange={(event) =>
                        updateAccommodation(index, "description", event.target.value)
                      }
                      className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-[#111417] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111417] p-2">
                    <img
                      src={accommodation.image || "/images/2.jpg"}
                      alt={accommodation.title || `Accommodation ${index + 1}`}
                      className="h-48 w-full rounded-xl object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Image URL</label>
                    <input
                      value={accommodation.image}
                      onChange={(event) =>
                        updateAccommodation(index, "image", event.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#111417] px-3 py-2.5 text-white outline-none transition focus:border-[#d4a15d]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Upload image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleAccommodationUpload(index, event)}
                      className="w-full rounded-2xl border border-dashed border-white/20 bg-[#111417] px-3 py-3 text-sm text-white/75"
                    />
                    {uploadingIndex === index && isUploading && (
                      <div className="text-sm text-[#d4a15d]">Uploading...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 md:p-8">
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#d4a15d]">Assets</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Project image library</h3>
        <div className="mt-5 flex flex-wrap gap-3">
          {projectImages.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setForm((current) => ({ ...current, image }))}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 transition hover:border-[#d4a15d]/60"
            >
              <img src={image} alt="project asset" className="h-16 w-16 object-cover" />
            </button>
          ))}
        </div>
      </div>

      {status && <p className="text-sm text-[#d4a15d]">{status}</p>}
    </form>
  );
}
