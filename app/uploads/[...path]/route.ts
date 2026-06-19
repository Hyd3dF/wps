import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function safePath(parts: string[]): string | null {
  if (parts.length < 2) return null;
  if (parts.some((part) => part === "." || part === ".." || !/^[A-Za-z0-9._~-]+$/.test(part))) {
    return null;
  }
  return parts.map(encodeURIComponent).join("/");
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const path = safePath((await context.params).path);
  if (!path) return new NextResponse("File not found", { status: 404 });

  const apiBaseUrl = process.env.BACKEND_API_URL?.replace(/\/$/, "");
  if (!apiBaseUrl) return new NextResponse("Storage unavailable", { status: 503 });

  const backendBaseUrl = apiBaseUrl.replace(/\/api$/, "");

  try {
    const backendResponse = await fetch(`${backendBaseUrl}/uploads/${path}`, {
      headers: { Accept: request.headers.get("accept") || "*/*" },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (!backendResponse.ok) {
      return new NextResponse("File not found", { status: backendResponse.status });
    }

    return new NextResponse(await backendResponse.arrayBuffer(), {
      status: 200,
      headers: {
        "Content-Type": backendResponse.headers.get("content-type") || "application/octet-stream",
        "Cache-Control": backendResponse.headers.get("cache-control") || "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Storage unavailable", { status: 503 });
  }
}
