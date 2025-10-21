"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getGameDetail } from "@/lib/api";
import { GameDetailResponse } from "@/lib/types";
import { cleanTeamName } from "@/lib/utils";
import GameFlowRink from "@/app/components/GameFlowRink";
import RinkChart from "@/app/components/RinkChart";
import { Button } from "@/components/ui/button";

export default function GameDetailPage() {
  const params = useParams();
  const gameDate = decodeURIComponent(params.date as string);
  const teamName = decodeURIComponent(params.team as string);
  const [data, setData] = useState<GameDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamView, setTeamView] = useState<"home" | "away" | "combined">(
    "combined"
  );

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
      <main className="min-h-screen p-8 w-[60%] mx-auto">
        <p>Loading game details...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen p-8 w-[60%] mx-auto">
        <Link href="/games" className="hover:underline mb-4 inline-block">
          ← Back to Games
        </Link>
        <p className="text-red-600">{error || "Game not found"}</p>
      </main>
    );
  }

  const { game, events } = data;

  // Filter events based on selected team view
  const filteredEvents =
    teamView === "combined"
      ? events
      : events.filter(
          (e) =>
            e.team_name ===
            (teamView === "home" ? game.team_name : game.opp_team_name)
        );

  // Get the title based on view
  const getRinkChartTitle = () => {
    if (teamView === "home") return `${cleanTeamName(game.team_name)} Events`;
    if (teamView === "away")
      return `${cleanTeamName(game.opp_team_name)} Events`;
    return "Game Events - Combined";
  };

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen p-8 w-[60%] mx-auto">
      <Link href="/games" className="hover:underline mb-4 inline-block">
        ← Back to Games
      </Link>

      {/* Game Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {cleanTeamName(game.team_name)} vs {cleanTeamName(game.opp_team_name)}
        </h1>
        <p className="text-xl text-foreground/60">
          {formatDate(game.game_date)}
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

      {/* Game Stats and Rink Chart - Side by Side */}
      <div className="flex gap-6 mb-8">
        {/* Stats Comparison - Left Side */}
        <div className="flex-1">
          <div className="border-[3px] border-neutral-800 rounded-sm p-6 bg-neutral-300">
            <h3 className="text-2xl font-bold mb-4">Game Statistics</h3>

            {/* Stats Table */}
            <div className="bg-neutral-100 border-[3px] border-neutral-800 rounded-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left border-b-[3px] border-r-[3px] border-neutral-800">
                      Stat
                    </th>
                    <th className="px-4 py-3 text-center border-b-[3px] border-r-[3px] border-neutral-800">
                      {cleanTeamName(game.team_name)}
                    </th>
                    <th className="px-4 py-3 text-center border-b-[3px] border-neutral-800">
                      {cleanTeamName(game.opp_team_name)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Goals */}
                  <tr>
                    <td className="px-4 py-3 font-bold border-b-[3px] border-r-[3px] border-neutral-800">
                      🥅 Goals
                    </td>
                    <td className="px-4 py-3 text-center border-b-[3px] border-r-[3px] border-neutral-800 font-bold text-xl">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Shot" &&
                            e.event_successful &&
                            e.team_name === game.team_name
                        ).length
                      }
                    </td>
                    <td className="px-4 py-3 text-center border-b-[3px] border-neutral-800 font-bold text-xl">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Shot" &&
                            e.event_successful &&
                            e.team_name === game.opp_team_name
                        ).length
                      }
                    </td>
                  </tr>

                  {/* Shots */}
                  <tr>
                    <td className="px-4 py-3 font-bold border-b-[3px] border-r-[3px] border-neutral-800">
                      🏒 Shots
                    </td>
                    <td className="px-4 py-3 text-center border-b-[3px] border-r-[3px] border-neutral-800">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Shot" && e.team_name === game.team_name
                        ).length
                      }
                    </td>
                    <td className="px-4 py-3 text-center border-b-[3px] border-neutral-800">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Shot" &&
                            e.team_name === game.opp_team_name
                        ).length
                      }
                    </td>
                  </tr>

                  {/* Passes */}
                  <tr>
                    <td className="px-4 py-3 font-bold border-b-[3px] border-r-[3px] border-neutral-800">
                      🎯 Passes
                    </td>
                    <td className="px-4 py-3 text-center border-b-[3px] border-r-[3px] border-neutral-800">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Play" && e.team_name === game.team_name
                        ).length
                      }
                    </td>
                    <td className="px-4 py-3 text-center border-b-[3px] border-neutral-800">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Play" &&
                            e.team_name === game.opp_team_name
                        ).length
                      }
                    </td>
                  </tr>

                  {/* Faceoff Wins */}
                  <tr>
                    <td className="px-4 py-3 font-bold border-b-[3px] border-r-[3px] border-neutral-800">
                      ⚫ Faceoff Wins
                    </td>
                    <td className="px-4 py-3 text-center border-b-[3px] border-r-[3px] border-neutral-800">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Faceoff Win" &&
                            e.team_name === game.team_name
                        ).length
                      }
                    </td>
                    <td className="px-4 py-3 text-center border-b-[3px] border-neutral-800">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Faceoff Win" &&
                            e.team_name === game.opp_team_name
                        ).length
                      }
                    </td>
                  </tr>

                  {/* Takeaways */}
                  <tr>
                    <td className="px-4 py-3 font-bold border-b-[3px] border-r-[3px] border-neutral-800">
                      🎯 Takeaways
                    </td>
                    <td className="px-4 py-3 text-center border-b-[3px] border-r-[3px] border-neutral-800">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Takeaway" &&
                            e.team_name === game.team_name
                        ).length
                      }
                    </td>
                    <td className="px-4 py-3 text-center border-b-[3px] border-neutral-800">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Takeaway" &&
                            e.team_name === game.opp_team_name
                        ).length
                      }
                    </td>
                  </tr>

                  {/* Puck Recoveries */}
                  <tr>
                    <td className="px-4 py-3 font-bold border-b-[3px] border-r-[3px] border-neutral-800">
                      🔄 Recoveries
                    </td>
                    <td className="px-4 py-3 text-center border-b-[3px] border-r-[3px] border-neutral-800">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Puck Recovery" &&
                            e.team_name === game.team_name
                        ).length
                      }
                    </td>
                    <td className="px-4 py-3 text-center border-b-[3px] border-neutral-800">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Puck Recovery" &&
                            e.team_name === game.opp_team_name
                        ).length
                      }
                    </td>
                  </tr>

                  {/* Zone Entries */}
                  <tr>
                    <td className="px-4 py-3 font-bold border-r-[3px] border-neutral-800">
                      ⬆️ Zone Entries
                    </td>
                    <td className="px-4 py-3 text-center border-r-[3px] border-neutral-800">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Zone Entry" &&
                            e.team_name === game.team_name
                        ).length
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      {
                        events.filter(
                          (e) =>
                            e.event === "Zone Entry" &&
                            e.team_name === game.opp_team_name
                        ).length
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Rink Chart - Right Side */}
        <div className="flex-1">
          {/* Team View Toggle Buttons */}
          <div className="flex gap-3 mb-4 justify-center">
            <Button
              onClick={() => setTeamView("home")}
              size="lg"
              className={`border-[3px] rounded-sm font-bold shadow-[4px_4px_0px_0px_rgb(38,38,38)] hover:shadow-[2px_2px_0px_0px_rgb(38,38,38)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 active:shadow-[0px_0px_0px_0px_rgb(38,38,38)] active:translate-x-[4px] active:translate-y-[4px] ${
                teamView === "home"
                  ? "bg-amber-500 text-white border-neutral-800 hover:bg-amber-600"
                  : "bg-neutral-50 text-neutral-800 border-neutral-800 hover:bg-neutral-200"
              }`}
            >
              {cleanTeamName(game.team_name)}
            </Button>
            <Button
              onClick={() => setTeamView("away")}
              size="lg"
              className={`border-[3px] rounded-sm font-bold shadow-[4px_4px_0px_0px_rgb(38,38,38)] hover:shadow-[2px_2px_0px_0px_rgb(38,38,38)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 active:shadow-[0px_0px_0px_0px_rgb(38,38,38)] active:translate-x-[4px] active:translate-y-[4px] ${
                teamView === "away"
                  ? "bg-violet-500 text-white border-neutral-800 hover:bg-violet-700"
                  : "bg-neutral-50 text-neutral-800 border-neutral-800 hover:bg-neutral-200"
              }`}
            >
              {cleanTeamName(game.opp_team_name)}
            </Button>
            <Button
              onClick={() => setTeamView("combined")}
              size="lg"
              className={`border-[3px] rounded-sm font-bold shadow-[4px_4px_0px_0px_rgb(38,38,38)] hover:shadow-[2px_2px_0px_0px_rgb(38,38,38)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 active:shadow-[0px_0px_0px_0px_rgb(38,38,38)] active:translate-x-[4px] active:translate-y-[4px] ${
                teamView === "combined"
                  ? "bg-green-500 text-white border-neutral-800 hover:bg-green-600"
                  : "bg-neutral-50 text-neutral-800 border-neutral-800 hover:bg-neutral-200"
              }`}
            >
              Combined
            </Button>
          </div>

          {/* RinkChart with filtered events */}
          <RinkChart
            events={filteredEvents.map((event) => ({
              x_coord: event.x_coord || 0,
              y_coord: event.y_coord || 0,
              event: event.event,
              event_successful: event.event_successful,
              period: event.period,
              clock_seconds: event.clock_seconds,
              player_name: event.player_name || "",
              opp_team_name: event.opp_team_name,
              event_type: event.event_type,
              player_name_2: event.player_name_2,
              x_coord_2: event.x_coord_2,
              y_coord_2: event.y_coord_2,
            }))}
            title={getRinkChartTitle()}
          />
        </div>
      </div>
    </main>
  );
}
