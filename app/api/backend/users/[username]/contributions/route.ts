import { NextResponse } from "next/server";
import { backendGet } from "@/lib/backend-server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");
  
  const path = `users/${encodeURIComponent(username)}/contributions${year ? `?year=${year}` : ""}`;
  
  const data = await backendGet<{
    contributions: { date: string; count: number }[];
    totalContributions: number;
  }>(path);

  if (!data) {
    return NextResponse.json({ contributions: [], totalContributions: 0 });
  }

  return NextResponse.json(data);
}

