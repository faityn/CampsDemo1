"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { destinations } from "@/data/destinations";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "◫" },
  { href: "/admin/intro", label: "Intro Page", icon: "◌" },
  ...destinations.map((resort) => ({
    href: `/admin/resorts/${resort.slug}`,
    label: resort.name.toUpperCase(),
    icon: "△",
  })),
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
      {nav.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex items-center gap-3 rounded-xl border-l-2 px-3 py-2.5 text-[15px] transition",
              isActive
                ? "border-[#d6b779] bg-[#183933] font-semibold text-white"
                : "border-transparent text-white/70 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            <span className="w-4 text-center text-[13px] opacity-80">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
