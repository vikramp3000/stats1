import { NextResponse } from "next/server";
import { flaskFetch } from "@/lib/flask-client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamName: string }> }
) {
  try {
    const { teamName: teamNameParam } = await params;
    const teamName = decodeURIComponent(teamNameParam);
    const data = await flaskFetch(
      `/api/teams/${encodeURIComponent(teamName)}/averages`
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching team averages:", error);
    return NextResponse.json(
      { error: "Failed to fetch team averages" },
      { status: 500 }
    );
  }
}
