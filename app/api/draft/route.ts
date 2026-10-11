import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") || "/";
  const draft = await draftMode();
  draft.enable();
  redirect(path);
}
