-- Save this as: create_tables.sql

CREATE TABLE IF NOT EXISTS play_by_play (
    id SERIAL PRIMARY KEY,
    game_date DATE,
    season_year INTEGER,
    team_name VARCHAR(100),
    opp_team_name VARCHAR(100),
    venue VARCHAR(10),
    period INTEGER,
    clock_seconds INTEGER,
    situation_type VARCHAR(20),
    goals_for INTEGER,
    goals_against INTEGER,
    player_name VARCHAR(100),
    event VARCHAR(50),
    event_successful BOOLEAN,
    x_coord NUMERIC,
    y_coord NUMERIC,
    event_type VARCHAR(50),
    player_name_2 VARCHAR(100),
    x_coord_2 NUMERIC,
    y_coord_2 NUMERIC,
    event_detail_1 VARCHAR(100),
    event_detail_2 VARCHAR(100),
    event_detail_3 VARCHAR(100)
);

CREATE INDEX idx_team_name ON play_by_play(team_name);
CREATE INDEX idx_game_date ON play_by_play(game_date);
CREATE INDEX idx_player_name ON play_by_play(player_name);