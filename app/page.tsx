import Intro from "@/components/Intro";
import { getAllResortContent, getIntroContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [introContent, resortContent] = await Promise.all([
    getIntroContent(),
    getAllResortContent(),
  ]);

  return <Intro introContent={introContent} destinations={resortContent} />;
}