"use client";

import { Button } from "@/components/ui/button";
import { Player } from "@/lib/types";
import { cleanTeamName, getInitials } from "@/lib/utils";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayersTableProps {
  players: Player[];
  loading?: boolean;
  selectedTeam?: string;
}

type SortKey =
  | "player_name"
  | "team_name"
  | "games_played"
  | "goals"
  | "successful_plays"
  | "shots";
type SortDirection = "asc" | "desc" | null;

export default function PlayersTable({
  players,
  loading = false,
  selectedTeam = "",
}: PlayersTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedPlayers = useMemo(() => {
    if (!sortKey || !sortDirection) return players;

    return [...players].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [players, sortKey, sortDirection]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) {
      return <span className="ml-1 opacity-40">⇅</span>;
    }
    return sortDirection === "asc" ? (
      <span className="ml-1">↑</span>
    ) : (
      <span className="ml-1">↓</span>
    );
  };

  if (loading) {
    return <p>Loading players...</p>;
  }

  if (players.length === 0) {
    return <p className="text-foreground/60">No players found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-heading mb-6">
        {selectedTeam
          ? `${players.length} Players`
          : `All ${players.length} Players`}
      </h2>

      <div className="border-[3px] border-border bg-secondary-background shadow-[var(--shadow)] rounded-base overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-main">
              <th
                onClick={() => handleSort("player_name")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-left cursor-pointer"
              >
                Player Name <SortIcon column="player_name" />
              </th>
              <th
                onClick={() => handleSort("team_name")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-left cursor-pointer"
              >
                Team <SortIcon column="team_name" />
              </th>
              <th
                onClick={() => handleSort("games_played")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-center cursor-pointer"
              >
                Games <SortIcon column="games_played" />
              </th>
              <th
                onClick={() => handleSort("goals")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-center cursor-pointer"
              >
                🥅 Goals <SortIcon column="goals" />
              </th>
              <th
                onClick={() => handleSort("shots")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-center cursor-pointer"
              >
                🏒 Shots On Goal <SortIcon column="shots" />
              </th>
              <th
                onClick={() => handleSort("successful_plays")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-center cursor-pointer"
              >
                🎯 Passes <SortIcon column="successful_plays" />
              </th>

              <th className="px-6 py-4 border-b-[3px] border-border text-center font-bold">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="">
            {sortedPlayers.map((player, index) => (
              <tr key={index} className="">
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] border-border">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="" alt={player.player_name} />
                      <AvatarFallback>
                        {getInitials(player.player_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-foreground">
                      {player.player_name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-sm text-foreground">
                  {cleanTeamName(player.team_name)}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-center font-base text-foreground">
                  {player.games_played}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-center font-base text-foreground">
                  {player.goals}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-center font-base text-foreground">
                  {player.shots}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-center font-base text-foreground">
                  {player.successful_plays}
                </td>

                <td className="px-6 py-4 border-b-[3px] border-border text-center">
                  <Button
                    asChild
                    size="sm"
                    className="bg-main hover:bg-main/90 text-main-foreground border-[2px] border-border"
                  >
                    <Link
                      href={`/players/${encodeURIComponent(
                        player.player_name
                      )}`}
                    >
                      View Details
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
