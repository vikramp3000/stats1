import { NextResponse } from "next/server";
import { flaskFetch } from "@/lib/flask-client";

export async function GET() {
  try {
    const data = await flaskFetch("/api/teams");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
