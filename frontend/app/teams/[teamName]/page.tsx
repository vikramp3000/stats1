"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getTeamDetail } from "@/lib/api";
import { TeamDetailResponse } from "@/lib/types";
import { cleanTeamName } from "@/lib/utils";
import RinkChart from "@/app/components/RinkChart";
import StatCard from "@/app/components/StatCard";

export default function TeamDetailPage() {
  const params = useParams();
  const teamName = decodeURIComponent(params.teamName as string);
  const [data, setData] = useState<TeamDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTeamDetail(teamName)
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Failed to load team data");
      })
      .finally(() => setLoading(false));
  }, [teamName]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 w-[60%] mx-auto">
        <p>Loading team details...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen p-8 w-[60%] mx-auto">
        <Link href="/teams" className="hover:underline mb-4 inline-block">
          ← Back to Teams
        </Link>
        <p className="text-red-600">{error || "Team not found"}</p>
      </main>
    );
  }

  const { team, games, events } = data;

  return (
    <main className="min-h-screen p-8 w-[60%] mx-auto">
      <Link href="/teams" className="hover:underline mb-4 inline-block">
        ← Back to Teams
      </Link>

      {/* Team Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{cleanTeamName(team.team_name)}</h1>
        <p className="text-xl text-foreground/60">Team Statistics</p>
      </div>

      {/* Stats Grid and Rink Chart - Side by Side */}
      <div className="flex gap-6 mb-8">
        {/* Stats Grid - Left Side */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Games Played" value={team.games_played} />
            <StatCard label="Total Events" value={team.total_events} />
            <StatCard label="Goals" value={team.goals} emoji="🥅" />
            <StatCard label="Shots On Goal" value={team.shots} emoji="🏒" />
            <StatCard label="Passes" value={team.passes} emoji="🎯" />
            <StatCard label="Puck Recoveries" value={team.puck_recoveries} />
            <StatCard label="Takeaways" value={team.takeaways} />
            <StatCard label="Zone Entries" value={team.zone_entries} />
            <StatCard label="Faceoff Wins" value={team.faceoff_wins} />
            <StatCard label="Penalties" value={team.penalties} />
            <StatCard label="Dump Ins/Outs" value={team.dump_ins_outs} />
          </div>
        </div>

        {/* Rink Chart - Right Side */}
        <div className="flex-1">
          <RinkChart
            events={events.map((event) => ({
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
            title={`${cleanTeamName(team.team_name)} - Shot Chart`}
          />
        </div>
      </div>

      {/* Game by Game */}
      <h2 className="text-2xl font-bold mb-4">Game by Game</h2>
      <div className="border-[3px] rounded-sm overflow-hidden">
        <table className="min-w-full bg-neutral-100">
          <thead className="bg-neutral-200 font-bold">
            <tr>
              <th className="px-6 py-4 border-b-[3px] border-r-[3px] text-left">
                Date
              </th>
              <th className="px-6 py-4 border-b-[3px] border-r-[3px] text-left">
                Opponent
              </th>
              <th className="px-6 py-4 border-b-[3px] border-r-[3px] text-center">
                Final Score
              </th>
              <th className="px-6 py-4 border-b-[3px] border-r-[3px] text-center">
                Goals
              </th>
              <th className="px-6 py-4 border-b-[3px] border-r-[3px]">Shots</th>
              <th className="px-6 py-4 border-b-[3px] text-center">Passes</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, index) => (
              <tr key={index}>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px]">
                  {new Date(game.game_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px]">
                  {cleanTeamName(game.opp_team_name)}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] text-center font-bold">
                  {game.score_for} - {game.score_against}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] text-center">
                  {game.goals}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] text-center">
                  {game.shots}
                </td>
                <td className="px-6 py-4 border-b-[3px] text-center">
                  {game.passes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
