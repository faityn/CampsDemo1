import Link from "next/link";
import { destinations } from "@/data/destinations";

const statCards = [
  { label: "Total Camps", value: "3", meta: "Active", icon: "△" },
  { label: "Total Images", value: "24", meta: "Uploaded", icon: "◫" },
  { label: "Total Pages", value: "3", meta: "Published", icon: "🗂" },
  { label: "Last Updated", value: "2 min ago", meta: "Oct 10, 2026", icon: "◔" },
];

const quickAccess = [
  { name: "ALUNGOO", href: `/admin/resorts/${destinations[1]?.slug ?? "alungoo"}`, image: destinations[1]?.image ?? "/images/alungoo/30.JPG" },
  { name: "HOYOR ZAGAL", href: `/admin/resorts/${destinations[0]?.slug ?? "hoyorzagal"}`, image: destinations[0]?.image ?? "/images/hoyorzagal/31.JPG" },
  { name: "GURU ECO COMPLEX", href: `/admin/resorts/${destinations[2]?.slug ?? "guru"}`, image: destinations[2]?.image ?? "/images/guru/7.JPG" },
  { name: "INTRO PAGE", href: "/admin/intro", image: "/images/alungoo/30.JPG" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[42px] font-semibold tracking-tight text-[#1c2124]">
            Welcome back, Admin!
          </h1>
          <p className="mt-1 text-[15px] text-[#5a646e]">
            Manage your camps and keep your content up to date.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-[#dfe4e0] bg-white px-3 py-2 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfeae7] text-[14px] font-semibold text-[#1b2a28]">
            A
          </div>
          <div className="text-right leading-tight">
            <div className="text-[13px] font-semibold text-[#1d2124]">Admin</div>
            <div className="text-[11px] text-[#6b7379]">Super Admin</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-[16px] border border-[#eae5df] bg-[#f7f6f4] p-4 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[13px] text-[#58656c]">{card.label}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfeae7] text-[#1a5347]">
                {card.icon}
              </span>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div className="text-[30px] font-semibold tracking-tight text-[#1a1d20]">{card.value}</div>
              <div className="text-[12px] text-[#59676d]">{card.meta}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[18px] border border-[#eae5df] bg-[#f7f6f4] p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[28px] font-semibold tracking-tight text-[#1c2124]">Quick Access</h2>
          <button className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#4f5a62]">
            View all →
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickAccess.map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-[18px] border border-[#e4e2df] bg-[#f0efe9] shadow-sm"
            >
              <div className="relative h-[150px] overflow-hidden">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/35" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="text-[18px] font-semibold tracking-tight">{item.name}</div>
                </div>
              </div>
              <div className="p-3">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1e3c36] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#234e46]"
                >
                  Manage →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
