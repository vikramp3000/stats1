"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getGameDetail } from "@/lib/api";
import { GameDetailResponse } from "@/lib/types";
import { cleanTeamName } from "@/lib/utils";
import EventsTable from "@/app/components/EventsTable";
import GameFlowRink from "@/app/components/GameFlowRink";

export default function GameDetailPage() {
  const params = useParams();
  const gameDate = decodeURIComponent(params.date as string);
  const teamName = decodeURIComponent(params.team as string);
  const [data, setData] = useState<GameDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getGameDetail(gameDate, teamName)
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Failed to load game data");
      })
      .finally(() => setLoading(false));
  }, [gameDate, teamName]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 w-3/4 mx-auto">
        <p>Loading game details...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen p-8 w-3/4 mx-auto">
        <Link href="/games" className="hover:underline mb-4 inline-block">
          ← Back to Games
        </Link>
        <p className="text-red-600">{error || "Game not found"}</p>
      </main>
    );
  }

  const { game, events } = data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen p-8 w-3/4 mx-auto">
      <Link href="/games" className="hover:underline mb-4 inline-block">
        ← Back to Games
      </Link>

      {/* Game Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {cleanTeamName(game.team_name)} vs {cleanTeamName(game.opp_team_name)}
        </h1>
        <p className="text-xl text-foreground/60">
          {formatDate(game.game_date)} •{" "}
          {game.venue === "home" ? "🏠 Home" : "✈️ Away"}
        </p>
        <p className="text-3xl font-bold mt-4">
          Final Score: {game.goals_for} - {game.goals_against}
        </p>
      </div>

      {/* Game Flow Rink */}
      <div className="mb-8">
        <GameFlowRink
          events={events}
          homeTeam={game.team_name}
          awayTeam={game.opp_team_name}
        />
      </div>

      {/* Events Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Play-by-Play Events ({events.length})
        </h2>
        <EventsTable events={events} />
      </div>
    </main>
  );
}
