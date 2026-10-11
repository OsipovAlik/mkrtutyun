import { promises as fs } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/admin-auth";

const MAX_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "File exceeds 25 MB limit" }, { status: 400 });
  }

  const extension = path.extname(file.name).toLowerCase();
  const safeBase = path
    .basename(file.name, extension)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 32);
  const fileName = `${Date.now()}-${safeBase || "upload"}${extension}`;

  // If Vercel Blob token exists, upload to cloud
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`uploads/${fileName}`, file, {
        access: "public",
        addRandomSuffix: true,
      });
      return Response.json({ url: blob.url });
    } catch (error) {
      console.error("[upload] Vercel Blob error:", error);
      return Response.json({ error: "Failed to upload to cloud storage" }, { status: 500 });
    }
  }

  // Local fallback: write to public/uploads
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    return Response.json({ url: `/uploads/${fileName}` });
  } catch (error) {
    console.error("[upload] Local write error:", error);
    return Response.json({ error: "Failed to save file locally" }, { status: 500 });
  }
}
