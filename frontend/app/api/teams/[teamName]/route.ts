import { NextResponse } from "next/server";
import { flaskFetch } from "@/lib/flask-client";

export async function GET(
  request: Request,
  { params }: { params: { teamName: string } }
) {
  try {
    const teamName = decodeURIComponent(params.teamName);
    const data = await flaskFetch(`/api/teams/${encodeURIComponent(teamName)}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching team details:", error);
    return NextResponse.json(
      { error: "Failed to fetch team details" },
      { status: 500 }
    );
  }
}
