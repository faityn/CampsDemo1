import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import AdminNavigation from "@/components/admin/AdminNavigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full bg-[#f4f5f4] text-[#1d2022]">
      <div className="min-h-dvh w-full overflow-hidden bg-[#f4f5f4]">
        <div className="flex min-h-dvh">
          <aside className="flex min-h-dvh w-[250px] shrink-0 flex-col bg-[#0d2d2d] px-4 py-5 text-white">
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1f403f] text-base font-semibold text-white">
                ▣
              </div>
              <div className="leading-tight">
                <div className="text-[16px] font-semibold tracking-tight">
                  Admin
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                  Tourism Management
                </div>
              </div>
            </div>

            <AdminNavigation />

            <Link
              href="/"
              target="_blank"
              className="mt-6 flex items-center gap-3 rounded-xl border-t border-white/10 px-3 pt-5 text-[14px] text-white/70 transition hover:text-white"
            >
              <span className="w-4 text-center text-[13px] opacity-80">↗</span>
              <span>View website</span>
            </Link>

            <div className="mt-auto border-t border-white/10 pt-4">
              <div className="mb-3 px-3 text-[10px] uppercase tracking-[0.18em] text-white/45">
                Explore, manage, grow.
              </div>
              <form action={signOut}>
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] text-white/70 transition hover:bg-white/5 hover:text-white"
                  type="submit"
                >
                  <span className="w-4 text-center text-[13px] opacity-80">
                    ⇠
                  </span>
                  <span>Logout</span>
                </button>
              </form>
            </div>
          </aside>

          <main className="min-w-0 flex-1 bg-[#f5f5f3] p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
