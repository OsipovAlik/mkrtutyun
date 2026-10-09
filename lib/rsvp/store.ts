import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { RsvpInput } from "./validation";

/**
 * RSVP storage.
 *
 * - On Vercel: Upstash Redis (free tier, added from the Vercel Marketplace),
 *   used when its REST env vars are present. No extra npm package needed.
 * - Locally / self-hosted: a JSON file in `data/rsvps.json`.
 *
 * Responses are keyed by the guest's name, so if someone answers twice,
 * the latest answer replaces the earlier one (no double-counted guests).
 */

export type RsvpRecord = RsvpInput & { submittedAt: string };

export type SaveResult = { ok: true } | { ok: false };

const HASH_KEY = "rsvps";
const FILE_PATH = path.join(process.cwd(), "data", "rsvps.json");

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

function keyFor(name: string) {
  return name.toLocaleLowerCase("hy").replace(/\s+/g, " ").trim();
}

async function redis(command: string[]) {
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

async function readFile(): Promise<Record<string, RsvpRecord>> {
  try {
    return JSON.parse(await fs.readFile(FILE_PATH, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }
}

// Serialise file writes so two simultaneous answers can't overwrite each other.
let fileQueue: Promise<unknown> = Promise.resolve();

export async function saveRsvp(input: RsvpInput): Promise<SaveResult> {
  const record: RsvpRecord = { ...input, submittedAt: new Date().toISOString() };
  try {
    if (redisConfig()) {
      await redis(["HSET", HASH_KEY, keyFor(input.name), JSON.stringify(record)]);
    } else {
      const write = fileQueue.then(async () => {
        const all = await readFile();
        all[keyFor(input.name)] = record;
        await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
        const tmp = `${FILE_PATH}.tmp`;
        await fs.writeFile(tmp, JSON.stringify(all, null, 2), "utf8");
        await fs.rename(tmp, FILE_PATH);
      });
      fileQueue = write.catch(() => {});
      await write;
    }
    return { ok: true };
  } catch (error) {
    console.error("[rsvp] Could not save response:", error);
    return { ok: false };
  }
}

/** All responses, newest first. */
export async function listRsvps(): Promise<RsvpRecord[]> {
  let records: RsvpRecord[];
  if (redisConfig()) {
    const flat = ((await redis(["HGETALL", HASH_KEY])) ?? []) as string[];
    records = [];
    for (let i = 1; i < flat.length; i += 2) records.push(JSON.parse(flat[i]));
  } else {
    records = Object.values(await readFile());
  }
  return records.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export function summarize(records: RsvpRecord[]) {
  const attending = records.filter((r) => r.attendance === "yes");
  return {
    totalGuests: attending.reduce((sum, r) => sum + r.guests, 0),
    attendingResponses: attending.length,
    declinedResponses: records.length - attending.length,
  };
}
