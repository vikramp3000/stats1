import { NextResponse } from "next/server";
import { flaskFetch } from "@/lib/flask-client";

export async function GET() {
  try {
    const data = await flaskFetch("/api/teams/stats");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching team stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch team stats" },
      { status: 500 }
    );
  }
}
