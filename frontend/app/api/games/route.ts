import { NextResponse } from "next/server";
import { flaskFetch } from "@/lib/flask-client";

export async function GET() {
  try {
    const data = await flaskFetch("/api/games");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
