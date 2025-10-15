const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Type definitions based on your data structure
export interface PlayByPlayEvent {
  id: number;
  game_date: string;
  season_year: number;
  team_name: string;
  opp_team_name: string;
  venue: string;
  period: number;
  clock_seconds: number;
  situation_type: string;
  goals_for: number;
  goals_against: number;
  player_name: string | null;
  event: string;
  event_successful: boolean;
  x_coord: number | null;
  y_coord: number | null;
  event_type: string | null;
  player_name_2: string | null;
  x_coord_2: number | null;
  y_coord_2: number | null;
  event_detail_1: string | null;
  event_detail_2: string | null;
  event_detail_3: string | null;
}

export interface EventsResponse {
  data: PlayByPlayEvent[];
  count: number;
  limit: number;
  offset: number;
}

export interface PlayerStat {
  event: string;
  count: number;
  successful_count: number;
}

export interface PlayerStatsResponse {
  player: string;
  stats: PlayerStat[];
}

// API Functions
export async function getTeams(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/teams`);
  if (!response.ok) throw new Error('Failed to fetch teams');
  const data = await response.json();
  return data.teams;
}

export async function getPlayers(team?: string): Promise<string[]> {
  const url = team 
    ? `${API_BASE_URL}/api/players?team=${encodeURIComponent(team)}`
    : `${API_BASE_URL}/api/players`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch players');
  const data = await response.json();
  return data.players;
}

export async function getEvents(params?: {
  team?: string;
  player?: string;
  event?: string;
  limit?: number;
  offset?: number;
}): Promise<EventsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.team) searchParams.set('team', params.team);
  if (params?.player) searchParams.set('player', params.player);
  if (params?.event) searchParams.set('event', params.event);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());

  const url = `${API_BASE_URL}/api/events?${searchParams.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
}

export async function getPlayerStats(playerName: string): Promise<PlayerStatsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/stats/player/${encodeURIComponent(playerName)}`
  );
  if (!response.ok) throw new Error('Failed to fetch player stats');
  return response.json();
}