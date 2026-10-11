"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { saveIntroContent, seedDefaultContent } from "@/app/actions/site-content";
import type { IntroPageContent } from "@/lib/site-content";

const defaultImageOptions = [
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/hoyorzagal/31.JPG",
  "/images/alungoo/30.JPG",
  "/images/guru/30.JPG",
];

export default function IntroEditor({ content }: { content: IntroPageContent }) {
  const [form, setForm] = useState(content);
  const [projectImages, setProjectImages] = useState<string[]>(defaultImageOptions);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);
    const payload = new FormData();
    payload.append("file", file);
    payload.append("folder", "site/home");

    try {
      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: payload,
      });
      const result = await response.json();

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Upload failed.");
      }

      setForm((current) => ({ ...current, heroImage: result.url }));
      setStatus("Image uploaded to Cloudinary.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, String(value)));

    const result = await saveIntroContent(data);
    setStatus(result.message);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-white/60">Eyebrow</label>
          <input
            value={form.eyebrow}
            onChange={(event) => setForm({ ...form, eyebrow: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-[#0b0d0f] px-3 py-2 text-white outline-none ring-0 transition focus:border-[#d4a15d]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/60">Tagline</label>
          <input
            value={form.tagline}
            onChange={(event) => setForm({ ...form, tagline: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-[#0b0d0f] px-3 py-2 text-white outline-none ring-0 transition focus:border-[#d4a15d]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/60">Country name</label>
          <input
            value={form.countryName}
            onChange={(event) => setForm({ ...form, countryName: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-[#0b0d0f] px-3 py-2 text-white outline-none ring-0 transition focus:border-[#d4a15d]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/60">Motto</label>
          <input
            value={form.motto}
            onChange={(event) => setForm({ ...form, motto: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-[#0b0d0f] px-3 py-2 text-white outline-none ring-0 transition focus:border-[#d4a15d]"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-white/60">Destinations description</label>
          <textarea
            value={form.destinationsDescription}
            onChange={(event) => setForm({ ...form, destinationsDescription: event.target.value })}
            className="min-h-[110px] w-full rounded-xl border border-white/10 bg-[#0b0d0f] px-3 py-2 text-white outline-none ring-0 transition focus:border-[#d4a15d]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/60">Hero image</label>
          <input
            value={form.heroImage}
            onChange={(event) => setForm({ ...form, heroImage: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-[#0b0d0f] px-3 py-2 text-white outline-none ring-0 transition focus:border-[#d4a15d]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/60">Upload new image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="w-full rounded-xl border border-dashed border-white/20 bg-[#0b0d0f] px-3 py-3 text-sm text-white/75"
          />
          {isUploading && <div className="text-sm text-[#d4a15d]">Uploading...</div>}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-white/60">Select from project images</p>
        <div className="flex flex-wrap gap-3">
          {projectImages.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setForm((current) => ({ ...current, heroImage: image }))}
              className="overflow-hidden rounded-xl border border-white/10 bg-black/20"
            >
              <img src={image} alt="project asset" className="h-20 w-20 object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="rounded-xl bg-[#d4a15d] px-4 py-2 font-medium text-[#171a1d]">
          Save intro content
        </button>
        <button
          type="button"
          onClick={async () => {
            const result = await seedDefaultContent();
            setStatus(result.message);
          }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
        >
          Reset to default
        </button>
      </div>

      {status && <p className="text-sm text-[#d4a15d]">{status}</p>}
    </form>
  );
}
