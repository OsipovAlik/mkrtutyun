import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath, updateTag } from "next/cache";
import { DEFAULT_CONTENT } from "./defaults";
import { sanitizeContent } from "./sanitize";
import type { SiteContent } from "./types";

const REDIS_CONTENT_KEY = "site_content";
const FILE_PATH = path.join(process.cwd(), "data", "content.json");

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function redisCommand(command: unknown[]) {
  const config = redisConfig()!;
  const res = await fetch(config.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Redis responded with ${res.status}`);
  const data = (await res.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error(data.error);
  return data.result;
}

async function readFromStorage(): Promise<SiteContent | null> {
  try {
    if (redisConfig()) {
      const raw = await redisCommand(["GET", REDIS_CONTENT_KEY]);
      if (typeof raw === "string") {
        return sanitizeContent(JSON.parse(raw));
      }
      return null;
    }

    const data = await fs.readFile(FILE_PATH, "utf8");
    return sanitizeContent(JSON.parse(data));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    console.error("[content] Failed to read stored content, using defaults:", error);
    return null;
  }
}

/**
 * Reads the active site content.
 * Falls back to DEFAULT_CONTENT if not set or corrupted.
 */
export async function getContent(): Promise<SiteContent> {
  const stored = await readFromStorage();
  return stored ?? DEFAULT_CONTENT;
}

/**
 * Saves updated content to storage and invalidates caches.
 */
export async function saveContent(rawContent: unknown): Promise<{ ok: boolean; error?: string }> {
  const sanitized = sanitizeContent(rawContent);
  const jsonStr = JSON.stringify(sanitized, null, 2);

  try {
    if (redisConfig()) {
      await redisCommand(["SET", REDIS_CONTENT_KEY, jsonStr]);
    } else {
      await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
      const tmp = `${FILE_PATH}.tmp`;
      await fs.writeFile(tmp, jsonStr, "utf8");
      await fs.rename(tmp, FILE_PATH);
    }

    // Immediately expire cache tags and revalidate routes
    try {
      updateTag("site-content");
    } catch {
      // updateTag is valid only inside Server Actions
    }
    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");

    return { ok: true };
  } catch (error) {
    console.error("[content] Failed to save content:", error);
    return { ok: false, error: String(error) };
  }
}

/**
 * Resets content to DEFAULT_CONTENT.
 */
export async function resetContent(): Promise<{ ok: boolean }> {
  return saveContent(DEFAULT_CONTENT);
}
