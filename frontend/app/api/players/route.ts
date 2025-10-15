import { NextRequest, NextResponse } from "next/server";
import { flaskFetch } from "@/lib/flask-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const team = searchParams.get("team");

    // Build Flask API URL
    const endpoint = team
      ? `/api/players?team=${encodeURIComponent(team)}`
      : "/api/players";

    const data = await flaskFetch(endpoint);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}
