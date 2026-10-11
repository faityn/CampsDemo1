import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In | Mongolian Camps",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-dvh bg-[#f7f7f3] text-[#172522] lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden min-h-dvh overflow-hidden bg-[#183b34] lg:block">
        <img
          src="/images/2.jpg"
          alt="The vast Mongolian steppe"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102a27]/90 via-[#102a27]/25 to-[#102a27]/25" />
        <div className="absolute inset-x-0 top-0 flex items-center gap-3 px-12 py-10 text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-xl">
            △
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.24em]">
            Mongolia · Curated stays
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 max-w-3xl px-12 pb-16 text-white xl:px-16">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-white/75">
            OPEN LAND · QUIET STAYS
          </p>
          <h1 className="max-w-2xl font-serif text-5xl leading-[1.08] tracking-tight xl:text-7xl">
            Your gateway to
            <br />
            Mongolia’s wild places.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/75">
            Manage your camps’ stories, imagery, and guest information—all in one place.
          </p>
          <div className="mt-12 flex items-center gap-3 text-xs tracking-wide text-white/60">
            <span className="h-px w-10 bg-white/50" />
            HOYORZAGAL · ADMIN PAGE
          </div>
        </div>
      </section>

      <section className="flex min-h-dvh flex-col justify-between px-6 py-8 sm:px-12 lg:px-16 xl:px-24">
        <div className="flex items-center gap-3 lg:invisible">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c443b] text-lg text-white">
            △
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">
            HOYORZAGAL
          </span>
        </div>

        <div className="mx-auto w-full max-w-[420px] py-14">
          <div className="mb-10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8eee8] text-xl text-[#1c443b]">
              ◈
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#718078]">
              ADMIN PORTAL
            </p>
            <h2 className="font-serif text-4xl tracking-tight text-[#172522] sm:text-[42px]">
              Welcome back
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-[#718078]">
              Sign in to continue to your dashboard.
            </p>
          </div>
          <AdminLoginForm />
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#849089]">
            <span aria-hidden="true">⌑</span>
            Your sign-in is protected by a secure connection
          </div>
        </div>

        <footer className="text-center text-[11px] tracking-wide text-[#9aa39e]">
          © {new Date().getFullYear()} HOYORZAGAL · ADMIN PAGE
        </footer>
      </section>
    </main>
  );
}
