from flask import Flask, jsonify, request
# from flask_cors import CORS
from database import get_db_connection, get_db_cursor

#ADD BLUEPRINTS

app = Flask(__name__)
# CORS(app)  # Enable CORS for Next.js frontend

# Configuration - put settings at the top
MAX_LIMIT = 2000    # Don't let users request too much data//default is 2000

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({"message": "NHL Stats API is running!"})


#get events by team, player, event type, limit, and offset
@app.route('/api/events', methods=['GET'])
def get_events():
    """Get play-by-play events with optional filters"""
    
    # Step 1: Validate inputs
    try:
        limit = int(request.args.get('limit', 2000))
        offset = int(request.args.get('offset', 0))
    except ValueError:
        return jsonify({"error": "limit and offset must be numbers"}), 400
    
    # Check limits
    if limit < 1 or limit > MAX_LIMIT:
        return jsonify({"error": f"limit must be between 1 and {MAX_LIMIT}"}), 400
    
    if offset < 0:
        return jsonify({"error": "offset cannot be negative"}), 400
    
    # Get filter parameters
    team = request.args.get('team')
    player = request.args.get('player')
    event_type = request.args.get('event')
    
    # Step 2: Try to get data, handle errors
    try:
        with get_db_connection() as conn: #connect to the database
            with get_db_cursor(conn) as cur: #get a cursor to the database
                # Build query
                query = "SELECT * FROM play_by_play WHERE 1=1" #the 1=1 is a boolean operator that is always true (makes it easier to add filters)
                params = [] #params is a list of parameters to the query
                
                if team:
                    query += " AND team_name = %s" #adds a filter for the team name
                    params.append(team) #adds the team name to the list of parameters
                
                if player:
                    query += " AND player_name = %s" #adds a filter for the player name
                    params.append(player) #adds the player name to the list of parameters
                
                if event_type:
                    query += " AND event = %s" #adds a filter for the event type
                    params.append(event_type) #adds the event type to the list of parameters
                
                query += " ORDER BY game_date DESC, period, clock_seconds DESC LIMIT %s OFFSET %s"
                params.extend([limit, offset]) #adds the limit and offset to the list of parameters
                
                cur.execute(query, params)
                events = cur.fetchall() #fetches all the events from the database
        
        # Step 3: Return successful response
        return jsonify({
            "data": events, #returns the events to the client
            "count": len(events), #returns the number of events to the client
            "limit": limit, #returns the limit to the client
            "offset": offset #returns the offset to the client
        }), 200
    
    except Exception as e: #handles errors
        # Step 4: Handle errors gracefully
        print(f"Error fetching events: {e}")  # Log the error
        return jsonify({"error": "Failed to fetch events"}), 500

#get teams
@app.route('/api/teams', methods=['GET'])
def get_teams():
    """Get list of all teams"""
    try:
        with get_db_connection() as conn: #connect to the database
            with get_db_cursor(conn) as cur: #get a cursor to the database
                cur.execute("SELECT DISTINCT team_name FROM play_by_play ORDER BY team_name") #executes the query to get the list of all teams
                teams = [row['team_name'] for row in cur.fetchall()] #fetches all the teams from the database
        
        return jsonify({"teams": teams}), 200 #returns the teams to the client
    
    except Exception as e:
        print(f"Error fetching teams: {e}")
        return jsonify({"error": "Failed to fetch teams"}), 500

# Get all players with their stats
@app.route('/api/players', methods=['GET'])
def get_players():
    """Get list of all players with their team and stats"""
    try:
        team_filter = request.args.get('team')
        
        with get_db_connection() as conn:
            with get_db_cursor(conn) as cur:
                query = """
                    SELECT 
                        player_name,
                        team_name,
                        COUNT(DISTINCT game_date) as games_played,
                        
                        -- Goals (Shot that is successful = true)
                        SUM(CASE WHEN event = 'Shot' AND event_successful = true THEN 1 ELSE 0 END) as goals,
                        
                        -- Successful Plays (passes)
                        SUM(CASE WHEN event = 'Play' AND event_successful = true THEN 1 ELSE 0 END) as successful_plays,
                        
                        -- Shots (unsuccessful, event_successful = false)
                        SUM(CASE WHEN event = 'Shot' AND event_successful = false THEN 1 ELSE 0 END) as shots
                        
                    FROM play_by_play
                    WHERE player_name IS NOT NULL
                """
                
                params = []
                if team_filter:
                    query += " AND team_name = %s"
                    params.append(team_filter)
                
                query += """
                    GROUP BY player_name, team_name
                    ORDER BY player_name ASC
                """
                
                cur.execute(query, params)
                players = cur.fetchall()
        
        return jsonify({
            "players": players,
            "count": len(players)
        }), 200
    
    except Exception as e:
        print(f"Error fetching players: {e}")
        return jsonify({"error": "Failed to fetch players"}), 500

# Get detailed stats for a specific player
@app.route('/api/players/<player_name>', methods=['GET'])
def get_player_detail(player_name):
    """Get detailed statistics and all events for a specific player"""
    try:
        with get_db_connection() as conn:
            with get_db_cursor(conn) as cur:
                # Get player summary stats
                summary_query = """
                    SELECT 
                        player_name,
                        team_name,
                        COUNT(DISTINCT game_date) as games_played,
                        COUNT(*) as total_events,
                        
                        -- Goals
                        SUM(CASE WHEN event = 'Shot' AND event_successful = true THEN 1 ELSE 0 END) as goals,
                        
                        -- Shots on goal (unsuccessful)
                        SUM(CASE WHEN event = 'Shot' AND event_successful = false THEN 1 ELSE 0 END) as shots,
                        
                        -- Successful passes
                        SUM(CASE WHEN event = 'Play' AND event_successful = true THEN 1 ELSE 0 END) as successful_passes,
                        
                        -- Incomplete passes
                        SUM(CASE WHEN event = 'Play' AND event_successful = false THEN 1 ELSE 0 END) as incomplete_passes,
                        
                        -- Other events
                        SUM(CASE WHEN event = 'Faceoff Win' THEN 1 ELSE 0 END) as faceoff_wins,
                        SUM(CASE WHEN event = 'Puck Recovery' THEN 1 ELSE 0 END) as puck_recoveries,
                        SUM(CASE WHEN event = 'Takeaway' THEN 1 ELSE 0 END) as takeaways,
                        SUM(CASE WHEN event = 'Zone Entry' THEN 1 ELSE 0 END) as zone_entries,
                        SUM(CASE WHEN event = 'Dump In/Out' THEN 1 ELSE 0 END) as dump_ins_outs,
                        SUM(CASE WHEN event = 'Penalty Taken' THEN 1 ELSE 0 END) as penalties
                        
                    FROM play_by_play
                    WHERE player_name = %s
                    GROUP BY player_name, team_name
                """
                
                cur.execute(summary_query, (player_name,))
                summary = cur.fetchone()
                
                if not summary:
                    return jsonify({"error": "Player not found"}), 404
                
                # Get all events for this player
                events_query = """
                    SELECT 
                        period,
                        clock_seconds,
                        event,
                        event_successful,
                        x_coord,
                        y_coord,
                        opp_team_name,
                        event_type,
                        player_name_2,
                        x_coord_2,
                        y_coord_2
                    FROM play_by_play
                    WHERE player_name = %s 
                    AND x_coord IS NOT NULL 
                    AND event IN ('Shot', 'Play')
                    ORDER BY game_date DESC
                """

                cur.execute(events_query, (player_name,))
                events = cur.fetchall()
                
                # Get game-by-game breakdown
                games_query = """
                    WITH final_scores AS (
                        SELECT DISTINCT ON (game_date, opp_team_name)
                            game_date,
                            opp_team_name,
                            goals_for,
                            goals_against
                        FROM play_by_play
                        WHERE player_name = %s
                        ORDER BY game_date, opp_team_name, period DESC, clock_seconds ASC
                    )
                    SELECT 
                        p.game_date,
                        p.opp_team_name,
                        COUNT(*) as total_events,
                        SUM(CASE WHEN p.event = 'Shot' AND p.event_successful = true THEN 1 ELSE 0 END) as goals,
                        SUM(CASE WHEN p.event = 'Shot' AND p.event_successful = false THEN 1 ELSE 0 END) as shots,
                        SUM(CASE WHEN p.event = 'Play' AND p.event_successful = true THEN 1 ELSE 0 END) as passes,
                        fs.goals_for as score_for,
                        fs.goals_against as score_against
                    FROM play_by_play p
                    JOIN final_scores fs ON p.game_date = fs.game_date AND p.opp_team_name = fs.opp_team_name
                    WHERE p.player_name = %s
                    GROUP BY p.game_date, p.opp_team_name, fs.goals_for, fs.goals_against
                    ORDER BY p.game_date DESC
                """
                
                cur.execute(games_query, (player_name, player_name))
                games = cur.fetchall()
        
        return jsonify({
            "player": summary,
            "events": events,
            "games": games,
            "events_count": len(events)
        }), 200
    
    except Exception as e:
        print(f"Error fetching player detail: {e}")
        return jsonify({"error": "Failed to fetch player details"}), 500

# Get all teams with their stats
@app.route('/api/teams/stats', methods=['GET'])
def get_teams_stats():
    """Get list of all teams with their aggregated stats"""
    try:
        with get_db_connection() as conn:
            with get_db_cursor(conn) as cur:
                query = """
                    SELECT 
                        team_name,
                        COUNT(DISTINCT game_date) as games_played,
                        
                        -- Goals (Shot that is successful = true)
                        SUM(CASE WHEN event = 'Shot' AND event_successful = true THEN 1 ELSE 0 END) as goals,
                        
                        -- Shots on goal (unsuccessful)
                        SUM(CASE WHEN event = 'Shot' AND event_successful = false THEN 1 ELSE 0 END) as shots,
                        
                        -- Successful Plays (passes)
                        SUM(CASE WHEN event = 'Play' AND event_successful = true THEN 1 ELSE 0 END) as passes
                        
                    FROM play_by_play
                    WHERE team_name IS NOT NULL
                    GROUP BY team_name
                    ORDER BY team_name ASC
                """
                
                cur.execute(query)
                teams = cur.fetchall()
        
        return jsonify({
            "teams": teams,
            "count": len(teams)
        }), 200
    
    except Exception as e:
        print(f"Error fetching team stats: {e}")
        return jsonify({"error": "Failed to fetch team stats"}), 500

# Get detailed stats for a specific team
@app.route('/api/teams/<team_name>', methods=['GET'])
def get_team_detail(team_name):
    """Get detailed statistics and all events for a specific team"""
    try:
        with get_db_connection() as conn:
            with get_db_cursor(conn) as cur:
                # Get team summary stats
                summary_query = """
                    SELECT 
                        team_name,
                        COUNT(DISTINCT game_date) as games_played,
                        COUNT(*) as total_events,
                        
                        -- Goals
                        SUM(CASE WHEN event = 'Shot' AND event_successful = true THEN 1 ELSE 0 END) as goals,
                        
                        -- Shots on goal (unsuccessful)
                        SUM(CASE WHEN event = 'Shot' AND event_successful = false THEN 1 ELSE 0 END) as shots,
                        
                        -- Successful passes
                        SUM(CASE WHEN event = 'Play' AND event_successful = true THEN 1 ELSE 0 END) as passes,
                        
                        -- Other events
                        SUM(CASE WHEN event = 'Faceoff Win' THEN 1 ELSE 0 END) as faceoff_wins,
                        SUM(CASE WHEN event = 'Puck Recovery' THEN 1 ELSE 0 END) as puck_recoveries,
                        SUM(CASE WHEN event = 'Takeaway' THEN 1 ELSE 0 END) as takeaways,
                        SUM(CASE WHEN event = 'Zone Entry' THEN 1 ELSE 0 END) as zone_entries,
                        SUM(CASE WHEN event = 'Dump In/Out' THEN 1 ELSE 0 END) as dump_ins_outs,
                        SUM(CASE WHEN event = 'Penalty Taken' THEN 1 ELSE 0 END) as penalties

                        
                    FROM play_by_play
                    WHERE team_name = %s
                    GROUP BY team_name
                """
                
                cur.execute(summary_query, (team_name,))
                summary = cur.fetchone()
                
                if not summary:
                    return jsonify({"error": "Team not found"}), 404
                
                # Get events with coordinates for the shot chart
                events_query = """
                    SELECT 
                        period,
                        clock_seconds,
                        event,
                        event_successful,
                        x_coord,
                        y_coord,
                        player_name,
                        opp_team_name,
                        event_type,
                        player_name_2,
                        x_coord_2,
                        y_coord_2
                    FROM play_by_play
                    WHERE team_name = %s 
                    AND x_coord IS NOT NULL 
                    AND event IN ('Shot', 'Play')
                    ORDER BY game_date DESC
                """
                
                cur.execute(events_query, (team_name,))
                events = cur.fetchall()
                
                # Get game-by-game breakdown
                games_query = """
                    WITH final_scores AS (
                        SELECT DISTINCT ON (game_date, opp_team_name)
                            game_date,
                            opp_team_name,
                            goals_for,
                            goals_against
                        FROM play_by_play
                        WHERE team_name = %s
                        ORDER BY game_date, opp_team_name, period DESC, clock_seconds ASC
                    )
                    SELECT 
                        p.game_date,
                        p.opp_team_name,
                        COUNT(*) as total_events,
                        SUM(CASE WHEN p.event = 'Shot' AND p.event_successful = true THEN 1 ELSE 0 END) as goals,
                        SUM(CASE WHEN p.event = 'Shot' AND p.event_successful = false THEN 1 ELSE 0 END) as shots,
                        SUM(CASE WHEN p.event = 'Play' AND p.event_successful = true THEN 1 ELSE 0 END) as passes,
                        fs.goals_for as score_for,
                        fs.goals_against as score_against
                    FROM play_by_play p
                    JOIN final_scores fs ON p.game_date = fs.game_date AND p.opp_team_name = fs.opp_team_name
                    WHERE p.team_name = %s
                    GROUP BY p.game_date, p.opp_team_name, fs.goals_for, fs.goals_against
                    ORDER BY p.game_date DESC
                """
                
                cur.execute(games_query, (team_name, team_name))
                games = cur.fetchall()
        
        return jsonify({
            "team": summary,
            "events": events,
            "games": games,
            "events_count": len(events)
        }), 200
    
    except Exception as e:
        print(f"Error fetching team detail: {e}")
        return jsonify({"error": "Failed to fetch team details"}), 500

# Get team averages for comparison
@app.route('/api/teams/<team_name>/averages', methods=['GET'])
def get_team_averages(team_name):
    """Get average stats for a team (for player comparison)"""
    try:
        with get_db_connection() as conn:
            with get_db_cursor(conn) as cur:
                query = """
                    SELECT 
                        COUNT(DISTINCT player_name) as total_players,
                        AVG(goals_per_player) as avg_goals,
                        AVG(shots_per_player) as avg_shots,
                        AVG(shooting_pct) as avg_shooting_pct,
                        AVG(pass_completion_pct) as avg_pass_completion_pct
                    FROM (
                        SELECT 
                            player_name,
                            SUM(CASE WHEN event = 'Shot' AND event_successful = true THEN 1 ELSE 0 END) as goals_per_player,
                            SUM(CASE WHEN event = 'Shot' AND event_successful = false THEN 1 ELSE 0 END) as shots_per_player,
                            CASE 
                                WHEN (SUM(CASE WHEN event = 'Shot' AND event_successful = true THEN 1 ELSE 0 END) + 
                                      SUM(CASE WHEN event = 'Shot' AND event_successful = false THEN 1 ELSE 0 END)) > 0
                                THEN (SUM(CASE WHEN event = 'Shot' AND event_successful = true THEN 1 ELSE 0 END)::float / 
                                     (SUM(CASE WHEN event = 'Shot' AND event_successful = true THEN 1 ELSE 0 END) + 
                                      SUM(CASE WHEN event = 'Shot' AND event_successful = false THEN 1 ELSE 0 END))) * 100
                                ELSE 0
                            END as shooting_pct,
                            CASE 
                                WHEN (SUM(CASE WHEN event = 'Play' AND event_successful = true THEN 1 ELSE 0 END) + 
                                      SUM(CASE WHEN event = 'Play' AND event_successful = false THEN 1 ELSE 0 END)) > 0
                                THEN (SUM(CASE WHEN event = 'Play' AND event_successful = true THEN 1 ELSE 0 END)::float / 
                                     (SUM(CASE WHEN event = 'Play' AND event_successful = true THEN 1 ELSE 0 END) + 
                                      SUM(CASE WHEN event = 'Play' AND event_successful = false THEN 1 ELSE 0 END))) * 100
                                ELSE 0
                            END as pass_completion_pct
                        FROM play_by_play
                        WHERE team_name = %s AND player_name IS NOT NULL
                        GROUP BY player_name
                    ) player_stats
                """
                
                cur.execute(query, (team_name,))
                result = cur.fetchone()
                
                if not result:
                    return jsonify({"error": "Team not found"}), 404
                
                return jsonify(result), 200
    
    except Exception as e:
        print(f"Error fetching team averages: {e}")
        return jsonify({"error": "Failed to fetch team averages"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)