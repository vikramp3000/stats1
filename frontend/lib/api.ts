import { EventsResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// API Functions

export async function getTeams(): Promise<string[]> {
  const response = await fetch("/api/teams"); // Changed from localhost:5000
  if (!response.ok) throw new Error("Failed to fetch teams");
  const data = await response.json();
  return data.teams;
}

export async function getEvents(params?: {
  team?: string;
  player?: string;
  event?: string;
  limit?: number;
  offset?: number;
}): Promise<EventsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.team) searchParams.set("team", params.team);
  if (params?.player) searchParams.set("player", params.player);
  if (params?.event) searchParams.set("event", params.event);
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.offset) searchParams.set("offset", params.offset.toString());

  // NOW calls Next.js API route instead of Flask directly
  const url = `/api/events?${searchParams.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
}
