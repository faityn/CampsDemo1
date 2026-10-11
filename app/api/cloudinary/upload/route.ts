import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { destinations } from "@/data/destinations";
import { cloudinary, optimizeCloudinaryImage } from "@/lib/cloudinary";
import { isAdminAuthenticated } from "@/lib/require-admin";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "");

  if (!file || typeof file === "string") {
    return Response.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "Only image files can be uploaded." }, { status: 400 });
  }

  const allowedFolders = new Set([
    "site/home",
    ...destinations.flatMap((destination) => [
      `site/${destination.slug}`,
      `site/${destination.slug}/accommodations`,
    ]),
  ]);
  if (!allowedFolders.has(folder)) {
    return Response.json({ error: "Unknown upload folder." }, { status: 400 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return Response.json(
      {
        error:
          "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local.",
      },
      { status: 400 },
    );
  }

  try {
    const uploadResultPromise = new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (!result?.secure_url) {
            reject(new Error("Cloudinary upload returned no secure URL."));
          } else {
            resolve({ secure_url: result.secure_url });
          }
        },
      );
      void pipeline(Readable.from(readFileChunks(file)), stream).catch(reject);
    });

    const result = await uploadResultPromise;
    return Response.json({ url: optimizeCloudinaryImage(result.secure_url) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

async function* readFileChunks(file: File): AsyncGenerator<Uint8Array> {
  const reader = file.stream().getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
