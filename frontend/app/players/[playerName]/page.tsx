"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getPlayerDetail } from "@/lib/api";
import { PlayerDetailResponse } from "@/lib/types";
import { cleanTeamName, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RinkChart from "@/app/components/RinkChart";
import StatCard from "@/app/components/StatCard";

export default function PlayerDetailPage() {
  const params = useParams();
  const playerName = decodeURIComponent(params.playerName as string);
  const [data, setData] = useState<PlayerDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlayerDetail(playerName)
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Failed to load player data");
      })
      .finally(() => setLoading(false));
  }, [playerName]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 w-3/4 mx-auto">
        <p>Loading player details...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen p-8 w-3/4 mx-auto">
        <Link href="/players" className="hover:underline mb-4 inline-block">
          ← Back to Players
        </Link>
        <p className="text-red-600">{error || "Player not found"}</p>
      </main>
    );
  }

  const { player, games, events } = data;

  return (
    <main className="min-h-screen p-8 w-3/4 mx-auto">
      <Link href="/players" className="hover:underline mb-4 inline-block">
        ← Back to Players
      </Link>

      {/* Player Header */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-20 h-20">
          <AvatarImage src="" alt={player.player_name} />
          <AvatarFallback className="text-2xl bg-neutral-200">
            {getInitials(player.player_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold">{player.player_name}</h1>
          <p className="text-xl">{cleanTeamName(player.team_name)}</p>
        </div>
      </div>

      {/* Stats Grid and Rink Chart - Side by Side */}
      <div className="flex gap-6 mb-8">
        {/* Stats Grid - Left Side */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Games Played" value={player.games_played} />
            <StatCard label="Total Events" value={player.total_events} />
            <StatCard label="Goals" value={player.goals} emoji="🥅" />
            <StatCard label="Shots" value={player.shots} emoji="🏒" />
            <StatCard
              label="Passes"
              value={player.successful_passes}
              emoji="🎯"
            />
            <StatCard label="Faceoff Wins" value={player.faceoff_wins} />
            <StatCard label="Puck Recoveries" value={player.puck_recoveries} />
            <StatCard label="Takeaways" value={player.takeaways} />
            <StatCard label="Zone Entries" value={player.zone_entries} />
          </div>
        </div>

        {/* Rink Chart - Right Side */}
        <div className="flex-1">
          {/* <RinkChart
            events={events.map((event) => ({
              x_coord: event.x_coord || 0,
              y_coord: event.y_coord || 0,
              event: event.event,
              event_successful: event.event_successful,
            }))}
            title={`${player.player_name} - Shot Chart`}
          /> */}
          <RinkChart
            events={events.map((event) => ({
              x_coord: event.x_coord || 0,
              y_coord: event.y_coord || 0,
              event: event.event,
              event_successful: event.event_successful,
              period: event.period,
              clock_seconds: event.clock_seconds,
              opp_team_name: event.opp_team_name,
            }))}
            title={`${player.player_name} - Shot Chart`}
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
              <th className="px-6 py-4 border-b-[3px] border-r-[3px] text-left ">
                Opponent
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
              <tr key={index} className="">
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] ">
                  {new Date(game.game_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] ">
                  {cleanTeamName(game.opp_team_name)}
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

// Stat Card Component
// function StatCard({
//   label,
//   value,
//   emoji,
// }: {
//   label: string;
//   value: number;
//   emoji?: string;
// }) {
//   return (
//     <div className="border-[3px] border-neutral-800 rounded-sm p-4 bg-neutral-200">
//       <p className="text-sm mb-1">{label}</p>
//       <p className="text-2xl font-bold">
//         {emoji && <span className="mr-2">{emoji}</span>}
//         {value}
//       </p>
//     </div>
//   );
// }
