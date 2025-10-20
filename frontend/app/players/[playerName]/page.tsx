"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getPlayerDetail, getTeamAverages } from "@/lib/api";
import { PlayerDetailResponse, TeamAverages } from "@/lib/types";
import { cleanTeamName, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RinkChart from "@/app/components/RinkChart";
import StatCard from "@/app/components/StatCard";
import GameByGameTable from "@/app/components/GameByGameTable";

export default function PlayerDetailPage() {
  const params = useParams();
  const playerName = decodeURIComponent(params.playerName as string);
  const [data, setData] = useState<PlayerDetailResponse | null>(null);
  const [teamAverages, setTeamAverages] = useState<TeamAverages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlayerDetail(playerName)
      .then((playerData) => {
        setData(playerData);
        // Fetch team averages after we have player data
        return getTeamAverages(playerData.player.team_name);
      })
      .then(setTeamAverages)
      .catch((err) => {
        console.error(err);
        setError("Failed to load player data");
      })
      .finally(() => setLoading(false));
  }, [playerName]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 w-[60%] mx-auto">
        <p>Loading player details...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen p-8 w-[60%] mx-auto">
        <Link href="/players" className="hover:underline mb-4 inline-block">
          ← Back to Players
        </Link>
        <p className="text-red-600">{error || "Player not found"}</p>
      </main>
    );
  }

  const { player, games, events } = data;

  // Calculate shooting percentage
  const totalShots = player.goals + player.shots;
  const shootingPct =
    totalShots > 0 ? ((player.goals / totalShots) * 100).toFixed(1) : 0;

  // Calculate pass completion rate
  const totalPasses = player.successful_passes + player.incomplete_passes;
  const passCompletionPct =
    totalPasses > 0
      ? ((player.successful_passes / totalPasses) * 100).toFixed(1)
      : 0;

  return (
    <main className="min-h-screen p-8 w-[60%] mx-auto">
      <Link href="/players" className="hover:underline mb-4 inline-block">
        ← Back to Players
      </Link>

      {/* Player Header */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-20 h-20">
          <AvatarFallback className="text-2xl bg-neutral-300">
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
            <StatCard label="Shots On Goal" value={player.shots} emoji="🏒" />
            <StatCard label="Shooting %" value={`${shootingPct}%`} emoji="📊" />
            <StatCard
              label="Passes"
              value={player.successful_passes}
              emoji="🎯"
            />
            <StatCard
              label="Pass Completion %"
              value={`${passCompletionPct}%`}
              emoji="✅"
            />
            <StatCard label="Puck Recoveries" value={player.puck_recoveries} />
            <StatCard label="Takeaways" value={player.takeaways} />
            <StatCard label="Zone Entries" value={player.zone_entries} />
            <StatCard label="Faceoff Wins" value={player.faceoff_wins} />
            <StatCard label="Penalties" value={player.penalties} />
            <StatCard label="Dump Ins/Outs" value={player.dump_ins_outs} />
          </div>
          {/* Performance vs Team Card */}
          {teamAverages && (
            <div className="border-[3px] border-neutral-800 rounded-sm p-6 bg-neutral-300 mb-8 w-full mt-[25px]">
              <h2 className="text-2xl font-bold mb-4">
                🏆 Performance vs Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shooting % Comparison */}
                <div className="p-4 bg-neutral-100 rounded border-[3px] border-neutral-800">
                  <p className="text-sm text-neutral-600 mb-1">Shooting %</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{shootingPct}%</span>
                    {Number(shootingPct) > teamAverages.avg_shooting_pct ? (
                      <span className="text-green-600 font-semibold">
                        ↑ +
                        {(
                          Number(shootingPct) - teamAverages.avg_shooting_pct
                        ).toFixed(1)}
                        %
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        ↓{" "}
                        {(
                          Number(shootingPct) - teamAverages.avg_shooting_pct
                        ).toFixed(1)}
                        %
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Team avg: {teamAverages.avg_shooting_pct.toFixed(1)}%
                  </p>
                </div>

                {/* Pass Completion % Comparison */}
                <div className="p-4 bg-neutral-100 rounded border-[3px] border-neutral-800">
                  <p className="text-sm text-neutral-600 mb-1">
                    Pass Completion %
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {passCompletionPct}%
                    </span>
                    {Number(passCompletionPct) >
                    teamAverages.avg_pass_completion_pct ? (
                      <span className="text-green-600 font-semibold">
                        ↑ +
                        {(
                          Number(passCompletionPct) -
                          teamAverages.avg_pass_completion_pct
                        ).toFixed(1)}
                        %
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        ↓{" "}
                        {(
                          Number(passCompletionPct) -
                          teamAverages.avg_pass_completion_pct
                        ).toFixed(1)}
                        %
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Team avg: {teamAverages.avg_pass_completion_pct.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
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
              opp_team_name: event.opp_team_name,
              situation_type: event.situation_type,
              player_name_2: event.player_name_2,
              event_type: event.event_type,
              x_coord_2: event.x_coord_2,
              y_coord_2: event.y_coord_2,
            }))}
            title={`${player.player_name} - Shot Chart`}
          />
        </div>
      </div>

      {/* Game by Game */}
      <GameByGameTable games={games} />
    </main>
  );
}
