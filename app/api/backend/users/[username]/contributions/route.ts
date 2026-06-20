import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  
  // Create deterministic mock data based on the username string
  const hash = Array.from(username).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // We want exactly 365 days of data ending today
  const contributions = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalContributions = 0;

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    
    // Pseudo-random generation based on hash and date
    const daySeed = hash + i * 17;
    
    // Most days (70%) have 0 contributions.
    // The rest have some varying intensity.
    let count = 0;
    if (daySeed % 100 > 70) {
      count = (daySeed % 5) + 1; // 1 to 5
      if (daySeed % 100 > 95) {
        count += (daySeed % 10); // Spikes
      }
    }
    
    totalContributions += count;
    
    contributions.push({
      date: dateString,
      count,
    });
  }

  return NextResponse.json({
    contributions,
    totalContributions,
  });
}
