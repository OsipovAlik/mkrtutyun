"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredentials, createSessionToken, isAdmin, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/admin-auth";
import { resetContent, saveContent } from "@/lib/content/store";
import type { SiteContent } from "@/lib/content/types";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!checkCredentials(username, password)) {
    // Small delay to slow down password guessing.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Սխալ մուտքանուն կամ գաղտնաբառ։" };
  }

  (await cookies()).set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin");
}

export async function saveSiteContentAction(content: SiteContent): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Unauthorized" };
  }
  return saveContent(content);
}

export async function resetSiteContentAction(): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Unauthorized" };
  }
  return resetContent();
}
