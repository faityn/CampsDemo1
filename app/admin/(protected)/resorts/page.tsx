import Link from "next/link";
import { destinations } from "@/data/destinations";

const stats = [
  { label: "Total Camps", value: "3", meta: "Active" },
  { label: "Total Images", value: "24", meta: "Uploaded" },
  { label: "Total Pages", value: "3", meta: "Published" },
  { label: "Last Updated", value: "2 min ago", meta: "Oct 10, 2026" },
];

export default function ResortsAdminPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-[#7a8087]">Dashboard</p>
          <h1 className="mt-2 text-[42px] font-semibold tracking-tight text-[#1c2124]">
            Manage your camps and content
          </h1>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-[#dfe4e0] bg-white px-3 py-2 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfeae7] text-[14px] font-semibold text-[#1b2a28]">
            A
          </div>
          <div className="text-right leading-tight">
            <div className="text-[13px] font-semibold">Admin</div>
            <div className="text-[11px] text-[#6b7379]">Super Admin</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-[16px] border border-[#e7e5df] bg-[#f8f7f4] p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] text-[#58656c]">{item.label}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dfeae7] text-[#1a5347]">◌</span>
            </div>
            <div className="text-[30px] font-semibold tracking-tight text-[#171b1e]">{item.value}</div>
            <div className="mt-1 text-[12px] text-[#5a646d]">{item.meta}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        <div className="flex-1 rounded-[18px] border border-[#e5e1db] bg-[#f8f7f4] p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-[34px] font-semibold tracking-tight text-[#171b1e]">Camps</h2>
            <button className="rounded-full bg-[#1b3b34] px-4 py-2 text-sm font-medium text-white">
              + Add New Camp
            </button>
          </div>

          <div className="overflow-hidden rounded-[12px] border border-[#e3dfd8] bg-white">
            <table className="min-w-full">
              <thead className="bg-[#f3f5f4] text-left text-[11px] uppercase tracking-[0.18em] text-[#5b666d]">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Image</th>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((resort, index) => (
                  <tr key={resort.slug} className="border-t border-[#ece7e1] align-middle">
                    <td className="px-5 py-4 text-sm text-[#5c646b]">{index + 1}</td>
                    <td className="px-5 py-4">
                      <div className="h-16 w-20 overflow-hidden rounded-xl border border-[#ebe1d1] bg-[#f0efe9]">
                        <img src={resort.image} alt={resort.name} className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[16px] font-medium text-[#1b2024]">{resort.name}</td>
                    <td className="px-5 py-4 text-sm text-[#586269]">{resort.region}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full border border-[#a4e1b3] bg-[#ebf8ee] px-3 py-1 text-[11px] font-medium text-[#1d6e4f]">
                        Published
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/resorts/${resort.slug}`}
                          className="inline-flex items-center rounded-md border border-[#badcc6] bg-[#f1faf4] px-3 py-1.5 text-xs font-medium text-[#1d6e4f]"
                        >
                          Edit
                        </Link>
                        <button type="button" className="inline-flex items-center rounded-md border border-[#f0c5c5] bg-[#fff1f1] px-3 py-1.5 text-xs font-medium text-[#b65757]">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="w-[420px] rounded-[18px] border border-[#e5e1db] bg-[#f8f7f4] p-4 shadow-sm">
          <div className="mb-4 border-b border-[#e6e0d8] pb-3">
            <h3 className="text-[28px] font-semibold tracking-tight text-[#1d2124]">Edit Camp - Alungoo Ger Hotel</h3>
          </div>

          <div className="mb-4 flex gap-2 border-b border-[#e6e0d8] pb-2 text-sm">
            {['General', 'Gallery', 'Features', 'SEO'].map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={[
                  "px-3 py-2 font-medium",
                  index === 0 ? "border-b-2 border-[#1d3f37] text-[#1d3f37]" : "text-[#6b7379]",
                ].join(" ")}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#4c5860]">Camp Name *</label>
              <input defaultValue="Alungoo Ger Hotel" className="w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#4c5860]">Short Description *</label>
              <textarea defaultValue="Experience comfort and nature in perfect harmony at Alungoo Ger Hotel, located in the heart of Terelj National Park." className="min-h-[90px] w-full resize-none rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#4c5860]">Location *</label>
              <select defaultValue="Terelj" className="w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none">
                <option>Terelj</option>
                <option>Gobi</option>
                <option>Khövsgöl</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#4c5860]">Status</label>
              <select defaultValue="Published" className="w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-[14px] text-[#1a1d20] outline-none">
                <option>Published</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#4c5860]">Main Image</label>
              <div className="flex items-center justify-between gap-3 rounded-md border border-[#dfe2df] bg-white p-2.5">
                <div className="h-16 w-20 overflow-hidden rounded-md border border-[#e0ddd5] bg-[#eee]">
                  <img src={destinations[1]?.image ?? "/images/alungoo/30.JPG"} alt="Main" className="h-full w-full object-cover" />
                </div>
                <button type="button" className="rounded-full border border-[#dfe2df] bg-[#f7f7f4] px-3 py-2 text-sm text-[#1a1d20]">
                  Change Image
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" className="px-3 py-2 text-sm font-medium text-[#4b5860]">Cancel</button>
            <button type="button" className="rounded-full bg-[#1a3b34] px-5 py-2.5 text-sm font-medium text-white">Save Changes</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
