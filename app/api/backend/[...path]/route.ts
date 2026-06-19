import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { toFrontendUser, type BackendUser } from "@/lib/backend-user";

export const dynamic = "force-dynamic";

const ACCESS_COOKIE = "konu_access";
const REFRESH_COOKIE = "konu_refresh";
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

interface BackendAuthResponse {
  user: BackendUser;
  accessToken: string;
  refreshToken: string;
}

interface BackendTokenResponse {
  accessToken: string;
  refreshToken: string;
}

function config() {
  const baseUrl = process.env.BACKEND_API_URL?.replace(/\/$/, "");
  const apiKey = process.env.BACKEND_API_KEY;
  if (!baseUrl || !apiKey) throw new Error("Backend API ortam değişkenleri eksik");
  return { baseUrl, apiKey };
}

function safePath(parts: string[]): string | null {
  if (parts.length === 0) return null;
  if (parts.some((part) => part === "." || part === ".." || !/^[A-Za-z0-9._~-]+$/.test(part))) return null;
  return parts.join("/");
}

function expectedOrigin(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.replace(":", "");
  return host ? `${proto}://${host}` : new URL(request.url).origin;
}

function hasValidOrigin(request: NextRequest): boolean {
  if (!MUTATING_METHODS.has(request.method)) return true;
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === expectedOrigin(request));
}

function requestIsSecure(request: NextRequest): boolean {
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim()
    .toLowerCase();
  if (forwardedProto) return forwardedProto === "https";
  return new URL(request.url).protocol === "https:";
}

function cookieOptions(request: NextRequest, maxAge: number) {
  return {
    httpOnly: true,
    secure: requestIsSecure(request),
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

function setAuthCookies(
  request: NextRequest,
  response: NextResponse,
  tokens: BackendTokenResponse,
): void {
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, cookieOptions(request, 15 * 60));
  response.cookies.set(
    REFRESH_COOKIE,
    tokens.refreshToken,
    cookieOptions(request, 7 * 24 * 60 * 60),
  );
}

function clearAuthCookies(request: NextRequest, response: NextResponse): void {
  response.cookies.set(ACCESS_COOKIE, "", {
    ...cookieOptions(request, 0),
    expires: new Date(0),
  });
  response.cookies.set(REFRESH_COOKIE, "", {
    ...cookieOptions(request, 0),
    expires: new Date(0),
  });
}

async function callBackend(request: NextRequest, path: string, accessToken?: string, overrideBody?: BodyInit): Promise<Response> {
  const { baseUrl, apiKey } = config();
  const headers = new Headers({ Accept: "application/json", "X-API-Key": apiKey });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  const userAgent = request.headers.get("user-agent");
  if (userAgent) headers.set("User-Agent", userAgent);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  let body: BodyInit | undefined = overrideBody;
  if (!body && request.method !== "GET" && request.method !== "HEAD") body = await request.arrayBuffer();

  return fetch(`${baseUrl}/${path}${new URL(request.url).search}`, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
}

async function refreshSession(request: NextRequest, refreshToken: string): Promise<BackendTokenResponse | null> {
  const { baseUrl, apiKey } = config();
  const response = await fetch(`${baseUrl}/auth/refresh`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...(request.headers.get("user-agent") ? { "User-Agent": request.headers.get("user-agent")! } : {}),
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) return null;
  return (await response.json()) as BackendTokenResponse;
}

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ error: { message: "Geçersiz istek kaynağı" } }, { status: 403 });
  }

  const path = safePath((await context.params).path);
  if (!path) return NextResponse.json({ error: { message: "Geçersiz API yolu" } }, { status: 400 });

  try {
    const store = await cookies();
    if (path === "auth/logout" && request.method === "POST") {
      const refreshToken = store.get(REFRESH_COOKIE)?.value;
      if (refreshToken) await callBackend(request, path, undefined, JSON.stringify({ refreshToken }));
      const response = new NextResponse(null, { status: 204 });
      clearAuthCookies(request, response);
      return response;
    }

    let backendResponse = await callBackend(request, path, store.get(ACCESS_COOKIE)?.value);
    let rotatedTokens: BackendTokenResponse | null = null;
    if (backendResponse.status === 401 && path !== "auth/login" && path !== "auth/register") {
      const refreshToken = store.get(REFRESH_COOKIE)?.value;
      if (refreshToken) {
        rotatedTokens = await refreshSession(request, refreshToken);
        if (rotatedTokens) backendResponse = await callBackend(request, path, rotatedTokens.accessToken);
      }
    }

    const contentType = backendResponse.headers.get("content-type") || "application/json";
    const payload = backendResponse.status === 204 ? null : await backendResponse.arrayBuffer();

    if ((path === "auth/login" || path === "auth/register") && backendResponse.ok && payload) {
      const auth = JSON.parse(new TextDecoder().decode(payload)) as BackendAuthResponse;
      const response = NextResponse.json({ user: toFrontendUser(auth.user) }, { status: backendResponse.status });
      setAuthCookies(request, response, auth);
      return response;
    }

    if (path === "auth/me" && backendResponse.ok && payload) {
      const data = JSON.parse(new TextDecoder().decode(payload)) as { user: BackendUser };
      const response = NextResponse.json({ user: toFrontendUser(data.user) });
      if (rotatedTokens) setAuthCookies(request, response, rotatedTokens);
      return response;
    }

    const response = new NextResponse(payload, {
      status: backendResponse.status,
      headers: { "Content-Type": contentType, "Cache-Control": "no-store" },
    });
    if (rotatedTokens) setAuthCookies(request, response, rotatedTokens);
    if (backendResponse.status === 401 && !rotatedTokens) clearAuthCookies(request, response);
    return response;
  } catch (error) {
    console.error("Backend proxy hatası", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: { message: "Backend servisine ulaşılamıyor" } }, { status: 503 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
