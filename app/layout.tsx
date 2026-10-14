import "./globals.css";
import "leaflet/dist/leaflet.css";
import SmoothScroll from "@/components/SmoothScroll";
import { LocaleProvider } from "@/i18n/LocaleProvider";

export const metadata = {
  title: "Mongolian Camps | Монголын аяллын баазууд",
  description:
    "Discover distinctive stays across Mongolia. Монгол орны өвөрмөц аяллын баазуудтай танилцаарай.",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LocaleProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </LocaleProvider>
      </body>
    </html>
  );
}
