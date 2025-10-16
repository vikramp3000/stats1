"use client";

import { Player } from "@/lib/types";
import Link from "next/link";

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
  if (loading) {
    return <p>Loading players...</p>;
  }

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
            <th className="px-6 py-3 border text-center">Games</th>
            <th className="px-6 py-3 border text-center">🥅 Goals</th>
            <th className="px-6 py-3 border text-center">🎯 Plays</th>
            <th className="px-6 py-3 border text-center">🏒 Shots</th>
            <th className="px-6 py-3 border text-center">Actions</th>{" "}
            {/* NEW */}
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
              <td className="px-6 py-3 border text-center font-bold text-red-600">
                {player.goals}
              </td>
              <td className="px-6 py-3 border text-center text-green-600">
                {player.successful_plays}
              </td>
              <td className="px-6 py-3 border text-center">{player.shots}</td>
              {/* NEW: View Details Button */}
              <td className="px-6 py-3 border text-center">
                <Link
                  href={`/players/${encodeURIComponent(player.player_name)}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
