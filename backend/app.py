from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_db_connection, get_db_cursor

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({"message": "NHL Stats API is running!"})

@app.route('/api/events', methods=['GET'])
def get_events():
    """Get play-by-play events with optional filters"""
    # Get query parameters
    team = request.args.get('team')
    player = request.args.get('player')
    event_type = request.args.get('event')
    limit = request.args.get('limit', 100, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    conn = get_db_connection()
    cur = get_db_cursor(conn)
    
    # Build query dynamically based on filters
    query = "SELECT * FROM play_by_play WHERE 1=1"
    params = []
    
    if team:
        query += " AND team_name = %s"
        params.append(team)
    
    if player:
        query += " AND player_name = %s"
        params.append(player)
    
    if event_type:
        query += " AND event = %s"
        params.append(event_type)
    
    query += " ORDER BY game_date, period, clock_seconds DESC LIMIT %s OFFSET %s"
    params.extend([limit, offset])
    
    cur.execute(query, params)
    events = cur.fetchall()
    
    cur.close()
    conn.close()
    
    return jsonify({
        "data": events,
        "count": len(events),
        "limit": limit,
        "offset": offset
    })

@app.route('/api/teams', methods=['GET'])
def get_teams():
    """Get list of all teams"""
    conn = get_db_connection()
    cur = get_db_cursor(conn)
    
    cur.execute("SELECT DISTINCT team_name FROM play_by_play ORDER BY team_name")
    teams = [row['team_name'] for row in cur.fetchall()]
    
    cur.close()
    conn.close()
    
    return jsonify({"teams": teams})

@app.route('/api/players', methods=['GET'])
def get_players():
    """Get list of all players"""
    team = request.args.get('team')
    
    conn = get_db_connection()
    cur = get_db_cursor(conn)
    
    if team:
        cur.execute(
            "SELECT DISTINCT player_name FROM play_by_play WHERE team_name = %s AND player_name IS NOT NULL ORDER BY player_name",
            (team,)
        )
    else:
        cur.execute("SELECT DISTINCT player_name FROM play_by_play WHERE player_name IS NOT NULL ORDER BY player_name")
    
    players = [row['player_name'] for row in cur.fetchall()]
    
    cur.close()
    conn.close()
    
    return jsonify({"players": players})

@app.route('/api/stats/player/<player_name>', methods=['GET'])
def get_player_stats(player_name):
    """Get statistics for a specific player"""
    conn = get_db_connection()
    cur = get_db_cursor(conn)
    
    query = """
        SELECT 
            event,
            COUNT(*) as count,
            SUM(CASE WHEN event_successful THEN 1 ELSE 0 END) as successful_count
        FROM play_by_play
        WHERE player_name = %s
        GROUP BY event
        ORDER BY count DESC
    """
    
    cur.execute(query, (player_name,))
    stats = cur.fetchall()
    
    cur.close()
    conn.close()
    
    return jsonify({
        "player": player_name,
        "stats": stats
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)