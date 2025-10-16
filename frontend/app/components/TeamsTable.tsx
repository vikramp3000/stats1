"use client";

import { Team } from "@/lib/types";
import { cleanTeamName } from "@/lib/utils";
import { useState, useMemo } from "react";

interface TeamsTableProps {
  teams: Team[];
  loading?: boolean;
}

type SortKey = "team_name" | "games_played" | "goals" | "shots" | "passes";
type SortDirection = "asc" | "desc" | null;

export default function TeamsTable({
  teams,
  loading = false,
}: TeamsTableProps) {
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

  const sortedTeams = useMemo(() => {
    if (!sortKey || !sortDirection) return teams;

    return [...teams].sort((a, b) => {
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
  }, [teams, sortKey, sortDirection]);

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
    return <p>Loading teams...</p>;
  }

  if (teams.length === 0) {
    return <p className="text-foreground/60">No teams found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6">All {teams.length} Teams</h2>

      <div className="overflow-hidden border-[3px] border-neutral-800 rounded-sm">
        <table className="min-w-full">
          <thead>
            <tr className="bg-neutral-200">
              <th
                onClick={() => handleSort("team_name")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] text-left cursor-pointer"
              >
                Team Name <SortIcon column="team_name" />
              </th>
              <th
                onClick={() => handleSort("games_played")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] text-center cursor-pointer"
              >
                Games Played <SortIcon column="games_played" />
              </th>
              <th
                onClick={() => handleSort("goals")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] text-center cursor-pointer"
              >
                🥅 Goals <SortIcon column="goals" />
              </th>
              <th
                onClick={() => handleSort("shots")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] text-center cursor-pointer"
              >
                🏒 Shots On Goal <SortIcon column="shots" />
              </th>
              <th
                onClick={() => handleSort("passes")}
                className="px-6 py-4 border-b-[3px] text-center cursor-pointer"
              >
                🎯 Passes <SortIcon column="passes" />
              </th>
            </tr>
          </thead>

          <tbody className="bg-neutral-100">
            {sortedTeams.map((team, index) => (
              <tr key={index}>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] font-semibold">
                  {cleanTeamName(team.team_name)}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] text-center">
                  {team.games_played}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] text-center">
                  {team.goals}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] text-center">
                  {team.shots}
                </td>
                <td className="px-6 py-4 border-b-[3px] text-center">
                  {team.passes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
