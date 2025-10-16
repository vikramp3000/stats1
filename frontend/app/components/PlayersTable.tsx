"use client";

import { Player } from "@/lib/types";

interface PlayersTableProps {
  players: Player[];
  loading?: boolean;
  selectedTeam?: string;
}

export default function PlayersTable({
  players,
  loading = false,
  selectedTeam = "",
}: PlayersTableProps) {
  // Loading state
  if (loading) {
    return <p>Loading players...</p>;
  }

  // No results
  if (players.length === 0) {
    return <p className="text-gray-500">No players found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">
        {selectedTeam
          ? `${players.length} Players`
          : `All ${players.length} Players`}
      </h2>

      <table className="min-w-full bg-white border text-black">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border text-left">Player Name</th>
            <th className="px-6 py-3 border text-left">Team</th>
            <th className="px-6 py-3 border text-center">Games Played</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-3 border font-semibold">
                {player.player_name}
              </td>
              <td className="px-6 py-3 border text-sm">
                {player.team_name.replace("Olympic (Women) - ", "")}
              </td>
              <td className="px-6 py-3 border text-center">
                {player.games_played}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
