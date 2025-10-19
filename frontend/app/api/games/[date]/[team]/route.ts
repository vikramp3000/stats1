import { NextResponse } from "next/server";
import { flaskFetch } from "@/lib/flask-client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string; team: string }> }
) {
  try {
    const { date, team } = await params;
    const gameDate = decodeURIComponent(date);
    const teamName = decodeURIComponent(team);
    const data = await flaskFetch(
      `/api/games/${encodeURIComponent(gameDate)}/${encodeURIComponent(
        teamName
      )}`
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching game details:", error);
    return NextResponse.json(
      { error: "Failed to fetch game details" },
      { status: 500 }
    );
  }
}
