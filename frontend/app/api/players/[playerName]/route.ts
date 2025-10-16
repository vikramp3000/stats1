import { NextRequest, NextResponse } from "next/server";
import { flaskFetch } from "@/lib/flask-client";

interface RouteParams {
  params: {
    playerName: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { playerName } = params;
    const data = await flaskFetch(
      `/api/players/${encodeURIComponent(playerName)}`
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching player detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch player details" },
      { status: 500 }
    );
  }
}
