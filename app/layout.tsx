import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Integrated tourism lodges",
  description: "Three distinctive escapes across Mongolia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
