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

// Detailed player stats

export interface PlayerDetail {
  player_name: string;
  team_name: string;
  games_played: number;
  total_events: number;
  goals: number;
  shots: number;
  successful_passes: number;
  incomplete_passes: number;
  faceoff_wins: number;
  puck_recoveries: number;
  takeaways: number;
  zone_entries: number;
  dump_ins_outs: number;
  penalties: number;
}

export interface PlayerEvent {
  game_date: string;
  period: number;
  clock_seconds: number;
  event: string;
  event_successful: boolean;
  event_type: string | null;
  x_coord: number | null;
  y_coord: number | null;
  player_name_2: string | null;
  event_detail_1: string | null;
  event_detail_2: string | null;
  event_detail_3: string | null;
  situation_type: string;
  goals_for: number;
  goals_against: number;
  opp_team_name: string; // Add this line
}

export interface PlayerGame {
  game_date: string;
  opp_team_name: string;
  total_events: number;
  goals: number;
  shots: number;
  passes: number;
}

export interface PlayerDetailResponse {
  player: PlayerDetail;
  events: PlayerEvent[];
  games: PlayerGame[];
  events_count: number;
}

// Team stats
export interface Team {
  team_name: string;
  games_played: number;
  goals: number;
  shots: number;
  passes: number;
}

export interface TeamsResponse {
  teams: Team[];
  count: number;
}

//Team detail stats
export interface TeamDetail {
  team_name: string;
  games_played: number;
  total_events: number;
  goals: number;
  shots: number;
  passes: number;
  faceoff_wins: number;
  puck_recoveries: number;
  takeaways: number;
  zone_entries: number;
}

export interface TeamEvent {
  period: number;
  clock_seconds: number;
  event: string;
  event_successful: boolean;
  x_coord: number | null;
  y_coord: number | null;
  player_name: string | null;
  opp_team_name: string; // Add this line
}

export interface TeamGame {
  game_date: string;
  opp_team_name: string;
  total_events: number;
  goals: number;
  shots: number;
  passes: number;
}

export interface TeamDetailResponse {
  team: TeamDetail;
  events: TeamEvent[];
  games: TeamGame[];
  events_count: number;
}
