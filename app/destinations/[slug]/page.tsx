import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations } from "@/data/destinations";
import DestinationDetails from "@/components/DestinationDetails";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);
  if (!destination) notFound();

  return (
    <main
      className={`destination-page theme-${destination.theme} min-h-screen`}
    >
      <section className="relative h-[78vh] min-h-[620px] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            destination.theme === "guru"
              ? "from-[#183b28]/55"
              : destination.theme === "alungoo"
                ? "from-[#6e3a21]/55"
                : "from-[#0d0e0b]/55"
          } via-transparent to-black/20`}
        />
        <div className="absolute right-6 top-7 z-10 md:right-12">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.3em] text-white/65 hover:text-white"
          >
            ← Back to destinations
          </Link>
        </div>
        <div className="absolute left-6 top-6 z-10 md:left-10 md:top-10">
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-[2px] bg-white p-2 shadow-2xl md:h-32 md:w-32 md:p-4"
            style={{
              borderColor:
                destination.theme === "hoyor-zagal"
                  ? "#6e3a21"
                  : destination.accent,
            }}
          >
            <svg aria-hidden="true" className="absolute h-0 w-0">
              <defs>
                <filter id={`destination-logo-${destination.theme}`}>
                  <feColorMatrix
                    in="SourceGraphic"
                    result="toneMask"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1 -1 -1 1 3"
                  />
                  <feComposite
                    in="toneMask"
                    in2="SourceGraphic"
                    operator="in"
                    result="logoMask"
                  />
                  <feFlood
                    floodColor={
                      destination.theme === "hoyor-zagal"
                        ? "#6e3a21"
                        : destination.theme === "guru"
                          ? "#2f8f57"
                          : destination.accent
                    }
                  />
                  <feComposite in2="logoMask" operator="in" />
                </filter>
              </defs>
            </svg>
            <img
              src={destination.logo}
              alt={`${destination.name} logo`}
              className="h-full w-full object-contain"
              style={{ filter: `url(#destination-logo-${destination.theme})` }}
            />
          </div>
        </div>
        <div className="absolute bottom-12 left-6 z-10 items-end gap-4 text-white md:left-12 md:gap-6">
          <div>
            <p
              className="mb-3 text-[10px] uppercase tracking-[0.4em]"
              style={{ color: destination.accent }}
            >
              {destination.eyebrow}
            </p>
            <h1 className="font-serif text-6xl md:text-[9vw]">
              {destination.name}
            </h1>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
              {destination.region}
            </p>
          </div>
        </div>
      </section>

      <section className="overview mx-auto max-w-5xl px-6 py-24 md:py-36">
        <p className="max-w-3xl text-3xl leading-tight md:text-6xl">
          {destination.signature}
        </p>
        <p className="mt-8 max-w-2xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
          {destination.description}
        </p>

        <div className="mt-16 grid gap-8 border-t border-[color:var(--line)] pt-8 md:grid-cols-3">
          {destination.facts.map((fact) => (
            <div key={fact.label}>
              <p className="text-[9px] uppercase tracking-[.3em] text-[color:var(--muted)]">
                {fact.label}
              </p>
              <p className="mt-3 text-sm">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>

      <DestinationDetails destination={destination} />
    </main>
  );
}
