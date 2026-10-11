import { promises as fs } from "fs";
import path from "path";

import { destinations } from "@/data/destinations";
import { isAdminAuthenticated } from "@/lib/require-admin";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const imageRoot = path.join(process.cwd(), "public", "images");
  const resortSlug = new URL(request.url).searchParams.get("resort");
  if (resortSlug && !destinations.some((destination) => destination.slug === resortSlug)) {
    return Response.json({ error: "Unknown resort." }, { status: 400 });
  }

  const root = resortSlug ? path.join(imageRoot, resortSlug) : imageRoot;
  try {
    await fs.access(root);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return Response.json({ files: [] });
    }
    throw error;
  }

  const files = await collectFiles(root);

  return Response.json({ files });
}

async function collectFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }

    if (/\.(png|jpe?g|gif|webp|svg)$/i.test(entry.name)) {
      const relative = path.relative(path.join(process.cwd(), "public"), fullPath);
      files.push(`/${relative.replace(/\\/g, "/")}`);
    }
  }

  return files.sort();
}
