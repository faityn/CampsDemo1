"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { signOut } from "@/app/admin/actions";
import AdminNavigation from "@/components/admin/AdminNavigation";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh w-full bg-[#f4f5f4] text-[#1d2022]">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <aside
        id="admin-navigation"
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-[250px] shrink-0 flex-col bg-[#0d2d2d] px-4 py-5 text-white transition-all duration-200 lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0",
          collapsed ? "lg:w-[76px] lg:px-3" : "lg:w-[250px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div
          className={[
            "mb-8 flex min-h-9 items-center gap-3",
            collapsed ? "lg:justify-center lg:px-0" : "px-2",
          ].join(" ")}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1f403f] text-base font-semibold text-white">
            ▣
          </div>
          <div
            className={[
              "min-w-0 flex-1 leading-tight",
              collapsed ? "lg:hidden" : "",
            ].join(" ")}
          >
            <div className="text-[16px] font-semibold tracking-tight">
              Admin
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">
              Tourism Management
            </div>
          </div>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-2 py-1 text-xl text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          >
            ×
          </button>
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((value) => !value)}
            className="hidden rounded-lg px-2 py-1 text-lg text-white/70 hover:bg-white/10 hover:text-white lg:block"
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <AdminNavigation
          collapsed={collapsed}
          onNavigate={() => setMobileOpen(false)}
        />

        <Link
          href="/"
          target="_blank"
          title="View website"
          onClick={() => setMobileOpen(false)}
          className={[
            "mt-6 flex items-center gap-3 rounded-xl border-t border-white/10 px-3 pt-5 text-[14px] text-white/70 transition hover:text-white",
            collapsed ? "lg:justify-center lg:px-0" : "",
          ].join(" ")}
        >
          <span className="w-4 shrink-0 text-center text-[13px] opacity-80">
            ↗
          </span>
          <span className={collapsed ? "lg:hidden" : ""}>View website</span>
        </Link>

        <div
          className={[
            "mt-auto border-t border-white/10 pt-4",
            collapsed ? "lg:px-0" : "",
          ].join(" ")}
        >
          <div
            className={[
              "mb-3 px-3 text-[10px] uppercase tracking-[0.18em] text-white/45",
              collapsed ? "lg:hidden" : "",
            ].join(" ")}
          >
            Explore, manage, grow.
          </div>
          <form action={signOut}>
            <button
              title="Logout"
              className={[
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] text-white/70 transition hover:bg-white/5 hover:text-white",
                collapsed ? "lg:justify-center lg:px-0" : "",
              ].join(" ")}
              type="submit"
            >
              <span className="w-4 shrink-0 text-center text-[13px] opacity-80">
                ⇠
              </span>
              <span className={collapsed ? "lg:hidden" : ""}>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-[#f5f5f3]">
        <div className="flex h-14 items-center border-b border-[#e4e5e2] px-4 lg:hidden">
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-controls="admin-navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-[#1d302c] hover:bg-[#e8ebe8]"
          >
            ☰
          </button>
          <span className="ml-3 text-sm font-semibold text-[#1d302c]">
            Admin
          </span>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
