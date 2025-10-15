import pandas as pd
import psycopg2
from database import get_db_connection
import os

def load_csv_to_db(csv_path):
    """Load CSV data into PostgreSQL database"""
    print(f"Reading CSV from {csv_path}...")
    df = pd.read_csv(csv_path)
    
    # Convert 't'/'f' to boolean
    df['event_successful'] = df['event_successful'].map({'t': True, 'f': False})
    
    # Convert game_date to proper date format
    df['game_date'] = pd.to_datetime(df['game_date'], dayfirst=True)
    
    # Replace empty strings with None for numeric columns
    numeric_cols = ['x_coord', 'y_coord', 'x_coord_2', 'y_coord_2']
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    print(f"Connecting to database...")
    conn = get_db_connection()
    cur = conn.cursor()
    
    print(f"Inserting {len(df)} rows...")
    
    # Insert data row by row
    insert_query = """
        INSERT INTO play_by_play (
            game_date, season_year, team_name, opp_team_name, venue,
            period, clock_seconds, situation_type, goals_for, goals_against,
            player_name, event, event_successful, x_coord, y_coord,
            event_type, player_name_2, x_coord_2, y_coord_2,
            event_detail_1, event_detail_2, event_detail_3
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    for idx, row in df.iterrows():
        cur.execute(insert_query, tuple(row))
        if (idx + 1) % 1000 == 0:
            print(f"Inserted {idx + 1} rows...")
    
    conn.commit()
    cur.close()
    conn.close()
    
    print(f"✓ Successfully loaded {len(df)} rows into database!")

if __name__ == "__main__":
    csv_path = "../notes/pxp_womens_oly_2022_v2.csv"
    load_csv_to_db(csv_path)