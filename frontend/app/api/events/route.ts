import { NextRequest, NextResponse } from "next/server";
import { flaskFetch } from "@/lib/flask-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get query parameters from the request
    const team = searchParams.get("team");
    const player = searchParams.get("player");
    const event = searchParams.get("event");
    const limit = searchParams.get("limit") || "20";
    const offset = searchParams.get("offset") || "0";

    // Build Flask API URL with parameters
    const params = new URLSearchParams();
    if (team) params.set("team", team);
    if (player) params.set("player", player);
    if (event) params.set("event", event);
    params.set("limit", limit);
    params.set("offset", offset);

    // Call Flask backend
    const data = await flaskFetch(`/api/events?${params.toString()}`);

    // Return the data to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
