"use client";

import { Button } from "@/components/ui/button";
import { Game } from "@/lib/types";
import { cleanTeamName } from "@/lib/utils";
import Link from "next/link";
import { useState, useMemo } from "react";

interface GamesTableProps {
  games: Game[];
  loading?: boolean;
}

type SortKey =
  | "game_date"
  | "team_name"
  | "opp_team_name"
  | "goals_for"
  | "goals_against";
type SortDirection = "asc" | "desc" | null;

export default function GamesTable({
  games,
  loading = false,
}: GamesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>("game_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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

  const sortedGames = useMemo(() => {
    if (!sortKey || !sortDirection) return games;

    return [...games].sort((a, b) => {
      // Special handling for date sorting
      if (sortKey === "game_date") {
        const dateA = new Date(a.game_date).getTime();
        const dateB = new Date(b.game_date).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

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
  }, [games, sortKey, sortDirection]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getResult = (goalsFor: number, goalsAgainst: number) => {
    if (goalsFor > goalsAgainst) return "W";
    if (goalsFor < goalsAgainst) return "L";
    return "T";
  };

  if (loading) {
    return <p>Loading games...</p>;
  }

  if (games.length === 0) {
    return <p className="text-red-500">No games found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6">All {games.length} Games</h2>

      <div className="overflow-hidden border-[3px] border-neutral-800 rounded-sm">
        <table className="min-w-full">
          <thead>
            <tr className="bg-neutral-200">
              <th
                onClick={() => handleSort("game_date")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] text-left cursor-pointer"
              >
                Date <SortIcon column="game_date" />
              </th>
              <th
                onClick={() => handleSort("team_name")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] text-left cursor-pointer"
              >
                Team <SortIcon column="team_name" />
              </th>
              <th
                onClick={() => handleSort("opp_team_name")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] text-left cursor-pointer"
              >
                Opponent <SortIcon column="opp_team_name" />
              </th>
              <th className="px-6 py-4 border-b-[3px] border-r-[3px] text-center font-bold">
                Final Score
              </th>

              <th className="px-6 py-4 border-b-[3px] text-center font-bold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-neutral-100">
            {sortedGames.map((game, index) => {
              const result = getResult(game.goals_for, game.goals_against);
              return (
                <tr key={index}>
                  <td className="px-6 py-4 border-b-[3px] border-r-[3px] font-semibold">
                    {formatDate(game.game_date)}
                  </td>
                  <td className="px-6 py-4 border-b-[3px] border-r-[3px]">
                    {cleanTeamName(game.team_name)}
                  </td>

                  <td className="px-6 py-4 border-b-[3px] border-r-[3px]">
                    {cleanTeamName(game.opp_team_name)}
                  </td>
                  <td className="px-6 py-4 border-b-[3px] border-r-[3px] text-center font-bold text-lg">
                    {game.goals_for} - {game.goals_against}
                  </td>

                  <td className="px-6 py-4 border-b-[3px] text-center">
                    <Button
                      asChild
                      size="sm"
                      className="border-[2px] bg-neutral-200 hover:bg-neutral-300 rounded-sm"
                    >
                      <Link
                        href={`/games/${encodeURIComponent(
                          game.game_date
                        )}/${encodeURIComponent(game.team_name)}`}
                      >
                        View Game Flow
                      </Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
