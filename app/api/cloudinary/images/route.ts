import { destinations } from "@/data/destinations";
import { cloudinary, optimizeCloudinaryImage } from "@/lib/cloudinary";
import { isAdminAuthenticated } from "@/lib/require-admin";

type CloudinaryImageResource = {
  public_id: string;
  secure_url: string;
  created_at: string;
};

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const slug = new URL(request.url).searchParams.get("resort");
  if (!slug || !destinations.some((destination) => destination.slug === slug)) {
    return Response.json({ error: "A valid resort is required." }, { status: 400 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return Response.json({ error: "Cloudinary is not configured." }, { status: 503 });
  }

  const assetFolders = [`site/${slug}`, `site/${slug}/accommodations`];
  const images: CloudinaryImageResource[] = [];

  try {
    for (const assetFolder of assetFolders) {
      let nextCursor: string | undefined;

      try {
        do {
          const result = await cloudinary.api.resources_by_asset_folder(
            assetFolder,
            {
              max_results: 500,
              ...(nextCursor ? { next_cursor: nextCursor } : {}),
            },
          );
          images.push(
            ...((result.resources ?? []) as CloudinaryImageResource[]).filter(
              (image) => Boolean(image.secure_url),
            ),
          );
          nextCursor = result.next_cursor;
        } while (nextCursor);
      } catch (error) {
        const message = getCloudinaryErrorMessage(error);
        if (message.startsWith("Folder doesn't exist:")) {
          continue;
        }
        throw error;
      }
    }

    images.sort((a, b) => b.created_at.localeCompare(a.created_at));

    return Response.json({
      files: images.map((image) => ({
        publicId: image.public_id,
        url: optimizeCloudinaryImage(image.secure_url),
        thumbnail: optimizeCloudinaryImage(image.secure_url, 320),
      })),
    });
  } catch (error) {
    return Response.json(
      { error: getCloudinaryErrorMessage(error) },
      { status: 502 },
    );
  }
}

function getCloudinaryErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof error.error === "object" &&
    error.error !== null &&
    "message" in error.error &&
    typeof error.error.message === "string"
  ) {
    return error.error.message;
  }
  return error instanceof Error ? error.message : "Unable to load Cloudinary images.";
}
