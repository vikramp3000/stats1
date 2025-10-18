import {
  EventsResponse,
  PlayerDetailResponse,
  PlayersResponse,
  TeamAverages,
  TeamDetailResponse,
  TeamsResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// API Functions
//this is used to get the list of all teams
export async function getTeams(): Promise<string[]> {
  const response = await fetch("/api/teams"); // Changed from localhost:5000
  if (!response.ok) throw new Error("Failed to fetch teams");
  const data = await response.json();
  return data.teams;
}

//this is used to get the list of all events - will delete later
export async function getEvents(params?: {
  team?: string;
  player?: string;
  event?: string;
  limit?: number;
  offset?: number;
}): Promise<EventsResponse> {
  // build the search params
  const searchParams = new URLSearchParams();
  if (params?.team) searchParams.set("team", params.team);
  if (params?.player) searchParams.set("player", params.player);
  if (params?.event) searchParams.set("event", params.event);
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.offset) searchParams.set("offset", params.offset.toString());

  // api call to the events route
  const url = `/api/events?${searchParams.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
}

//this is used to get the list of all players
export async function getPlayers(team?: string): Promise<PlayersResponse> {
  const url = team
    ? `/api/players?team=${encodeURIComponent(team)}`
    : "/api/players";

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch players");
  return response.json();
}

//this is used to get the detailed stats for a specific player
export async function getPlayerDetail(
  playerName: string
): Promise<PlayerDetailResponse> {
  const response = await fetch(
    `/api/players/${encodeURIComponent(playerName)}`
  );
  if (!response.ok) throw new Error("Failed to fetch player details");
  return response.json();
}

//this is used to get the list of all teams with stats
export async function getTeamsStats(): Promise<TeamsResponse> {
  const response = await fetch("/api/teams/stats");
  if (!response.ok) throw new Error("Failed to fetch team stats");
  return response.json();
}

//this is used to get the detailed stats for a specific team
export async function getTeamDetail(
  teamName: string
): Promise<TeamDetailResponse> {
  const response = await fetch(`/api/teams/${encodeURIComponent(teamName)}`);
  if (!response.ok) throw new Error("Failed to fetch team details");
  return response.json();
}

//this is used to get team averages for comparison
export async function getTeamAverages(teamName: string): Promise<TeamAverages> {
  const response = await fetch(
    `/api/teams/${encodeURIComponent(teamName)}/averages`
  );
  if (!response.ok) throw new Error("Failed to fetch team averages");
  return response.json();
}
