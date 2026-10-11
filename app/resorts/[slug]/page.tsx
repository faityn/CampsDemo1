import { notFound } from "next/navigation";
import ResortPageContent from "@/components/ResortPageContent";
import { getResortContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function ResortPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resort = await getResortContent(slug);

  if (!resort) notFound();

  return <ResortPageContent destination={resort} />;
}
