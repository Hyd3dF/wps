import "server-only";
import { cookies } from "next/headers";

export async function backendGet<T>(path: string): Promise<T | null> {
  const baseUrl = process.env.BACKEND_API_URL?.replace(/\/$/, "");
  const apiKey = process.env.BACKEND_API_KEY;
  if (!baseUrl || !apiKey) return null;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-API-Key": apiKey,
  };

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("konu_access")?.value;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch {
    // cookies() might throw during build static generation
  }

  try {
    const response = await fetch(`${baseUrl}/${path.replace(/^\//, "")}`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}
