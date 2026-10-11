"use client";

import { saveIntroContent } from "@/app/actions/site-content";
import { useEffect, useState } from "react";
import { getIntroContent } from "@/lib/site-content";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";

const imageOptions = [
  "/images/alungoo/30.JPG",
  "/images/hoyorzagal/31.JPG",
  "/images/guru/30.JPG",
  "/images/2.jpg",
];

export default function IntroAdminPage() {
  const [content, setContent] = useState({
    eyebrow: "Mongolian Camps",
    eyebrowMn: "Монголын баазууд",
    tagline: "Curated stays in the wild",
    taglineMn: "Зэрлэгт тохирсон амралт",
    countryName: "MONGOLIA",
    countryNameMn: "МОНГОЛ",
    motto: "Slow travel. Vast skies. Deep calm.",
    mottoMn: "Удаан аялал. Уудам тэнгэр. Тайван амгалан.",
    heroImage: "/images/alungoo/30.JPG",
    destinationsLabel: "Destinations",
    destinationsLabelMn: "Байрлал",
    chooseLabel: "Choose your horizon",
    chooseLabelMn: "Сонголтоо хийж үзээрэй",
    closingHeadline: "<p>Space to breathe</p><p>Time to stay</p>",
    closingHeadlineMn:
      "<p>Амьсгалах уудам орон зай.</p><p>Саатан тухлах цаг.</p>",
    closing:
      "A slower kind of luxury — wide horizons, warm hospitality, and time that actually feels like yours.",
    closingMn:
      "Удаан, тайван тансаглал — уудам хаяа, дулаан найрсаг байдал, яг таны цаг хугацаа.",
  });
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getIntroContent();
      setContent({
        eyebrow: data.eyebrow,
        eyebrowMn: data.eyebrowMn ?? data.eyebrow,
        tagline: data.tagline,
        taglineMn: data.taglineMn ?? data.tagline,
        countryName: data.countryName,
        countryNameMn: data.countryNameMn ?? data.countryName,
        motto: data.motto,
        mottoMn: data.mottoMn ?? data.motto,
        heroImage: data.heroImage,
        destinationsLabel: data.destinationsLabel,
        destinationsLabelMn: data.destinationsLabelMn ?? data.destinationsLabel,
        chooseLabel: data.chooseLabel,
        chooseLabelMn: data.chooseLabelMn ?? data.chooseLabel,
        closingHeadline: data.closingHeadline,
        closingHeadlineMn: data.closingHeadlineMn ?? data.closingHeadline,
        closing: data.closing,
        closingMn: data.closingMn ?? data.closing,
      });
      setIsLoading(false);
    }

    load();
  }, []);

  const updateField = (field: keyof typeof content, value: string) => {
    setContent((current) => ({ ...current, [field]: value }));
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "site/home");

    try {
      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result.url) {
        throw new Error(result.error || "Upload failed");
      }
      setContent((current) => ({ ...current, heroImage: result.url }));
      setStatus("Image uploaded successfully.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Image upload failed.",
      );
    }

    event.target.value = "";
  };

  const handleSave = async () => {
    const formData = new FormData();
    Object.entries(content).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await saveIntroContent(formData);
    setStatus(result.message);
  };

  if (isLoading) {
    return (
      <div className="rounded-[18px] border border-[#e3e0db] bg-[#f7f6f4] p-8 text-[#48555d]">
        Loading intro content...
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-[18px] border border-[#e3e0db] bg-[#f7f6f4] p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[42px] font-semibold tracking-tight text-[#171b1d]">
              Intro Page
            </h2>
            <p className="text-[15px] text-[#5d6870]">
              Edit the hero text and homepage content.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="rounded-full bg-[#1d3e35] px-4 py-2 text-sm font-medium text-white"
          >
            Save Changes
          </button>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-[#e1ddd7] bg-white p-3">
          <div className="relative h-[260px] overflow-hidden rounded-[12px]">
            <img
              src={content.heroImage}
              alt="Intro preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8">
              <div className="max-w-[430px] text-white">
                <div className="text-[12px] uppercase tracking-[0.18em] text-white/80">
                  {content.eyebrow}
                </div>
                <h3 className="mt-3 text-[52px] font-semibold leading-[0.95] tracking-tight">
                  {content.tagline}
                </h3>
                <button className="mt-5 rounded-full bg-white/20 px-5 py-2.5 text-sm font-medium backdrop-blur-sm">
                  {content.chooseLabel} →
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                  Eyebrow (EN)
                </label>
                <input
                  value={content.eyebrow}
                  onChange={(e) => updateField("eyebrow", e.target.value)}
                  className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f5] px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                  Eyebrow (MN)
                </label>
                <input
                  value={content.eyebrowMn}
                  onChange={(e) => updateField("eyebrowMn", e.target.value)}
                  className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f5] px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                  Hero title (EN)
                </label>
                <input
                  value={content.tagline}
                  onChange={(e) => updateField("tagline", e.target.value)}
                  className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f5] px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                  Hero title (MN)
                </label>
                <input
                  value={content.taglineMn}
                  onChange={(e) => updateField("taglineMn", e.target.value)}
                  className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f5] px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                  Country label (EN)
                </label>
                <input
                  value={content.countryName}
                  onChange={(e) => updateField("countryName", e.target.value)}
                  className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f5] px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                  Country label (MN)
                </label>
                <input
                  value={content.countryNameMn}
                  onChange={(e) => updateField("countryNameMn", e.target.value)}
                  className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f5] px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                  Motto (EN)
                </label>
                <input
                  value={content.motto}
                  onChange={(e) => updateField("motto", e.target.value)}
                  className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f5] px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                  Motto (MN)
                </label>
                <input
                  value={content.mottoMn}
                  onChange={(e) => updateField("mottoMn", e.target.value)}
                  className="w-full rounded-md border border-[#dfe2df] bg-[#f8f7f5] px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="rounded-[18px] border border-[#e3e0db] bg-[#f7f6f4] p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[28px] font-semibold tracking-tight text-[#1b1f21]">
            Content
          </h3>
          <button
            onClick={handleSave}
            className="rounded-full border border-[#dfe3e1] bg-white px-3 py-1.5 text-sm text-[#1d2124]"
          >
            Save Changes
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                Choose label (EN)
              </label>
              <input
                value={content.chooseLabel}
                onChange={(e) => updateField("chooseLabel", e.target.value)}
                className="w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                Choose label (MN)
              </label>
              <input
                value={content.chooseLabelMn}
                onChange={(e) => updateField("chooseLabelMn", e.target.value)}
                className="w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
              />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                Destinations label (EN)
              </label>
              <input
                value={content.destinationsLabel}
                onChange={(e) =>
                  updateField("destinationsLabel", e.target.value)
                }
                className="w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                Destinations label (MN)
              </label>
              <input
                value={content.destinationsLabelMn}
                onChange={(e) =>
                  updateField("destinationsLabelMn", e.target.value)
                }
                className="w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
              />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 ">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                Closing headline (EN)
              </label>
              <AdminRichTextEditor
                value={content.closingHeadline}
                onChange={(value) => updateField("closingHeadline", value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                Closing headline (MN)
              </label>
              <AdminRichTextEditor
                value={content.closingHeadlineMn}
                onChange={(value) => updateField("closingHeadlineMn", value)}
              />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                Closing sentence (EN)
              </label>
              <textarea
                value={content.closing}
                onChange={(e) => updateField("closing", e.target.value)}
                className="min-h-[90px] w-full resize-none rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4a555d]">
                Closing sentence (MN)
              </label>
              <textarea
                value={content.closingMn}
                onChange={(e) => updateField("closingMn", e.target.value)}
                className="min-h-[90px] w-full resize-none rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1c1f22] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#4a555d]">
              Background image
            </label>
            <div className="flex items-center gap-3 rounded-md border border-[#dfe2df] bg-white p-2">
              <div className="h-16 w-16 overflow-hidden rounded-md border border-[#dfe3e1] bg-[#eee]">
                <img
                  src={content.heroImage}
                  alt="Hero"
                  className="h-full w-full object-cover"
                />
              </div>
              <label className="cursor-pointer rounded-full border border-[#dfe3e1] bg-[#f7f7f4] px-3 py-2 text-sm text-[#1b1f21]">
                Change image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
            </div>
            {/* <div className="mt-3 grid grid-cols-4 gap-2">
              {imageOptions.map((image) => (
                <button key={image} type="button" className="overflow-hidden rounded-md border border-[#dfe2df] bg-white p-0.5" onClick={() => updateField("heroImage", image)}>
                  <img src={image} alt="Library image" className="h-12 w-full object-cover" />
                </button>
              ))}
            </div> */}
          </div>

          {status ? (
            <div className="rounded-md border border-[#dfeae6] bg-[#edf8f1] px-3 py-2 text-sm text-[#1d5a45]">
              {status}
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
