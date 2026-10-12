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

export default function AdminNavigation({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
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
            title={item.label}
            onClick={onNavigate}
            className={[
              "flex items-center gap-3 rounded-xl border-l-2 px-3 py-2.5 text-[15px] transition",
              collapsed ? "lg:justify-center lg:px-0" : "",
              isActive
                ? "border-[#d6b779] bg-[#183933] font-semibold text-white"
                : "border-transparent text-white/70 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            <span className="w-4 shrink-0 text-center text-[13px] opacity-80">
              {item.icon}
            </span>
            <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
