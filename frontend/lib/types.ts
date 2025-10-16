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

export interface Player {
  player_name: string;
  team_name: string;
  games_played: number;
  goals: number;
  successful_plays: number;
  shots: number;
}

export interface PlayersResponse {
  players: Player[];
  count: number;
}
