"use client";

import { useState, useEffect } from "react";
import { getPlayers, getTeams } from "@/lib/api";
import { Player } from "@/lib/types";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch teams on mount
  useEffect(() => {
    getTeams().then(setTeams).catch(console.error);
  }, []);

  // Fetch players when team changes
  useEffect(() => {
    setLoading(true);
    getPlayers(selectedTeam || undefined)
      .then((response) => setPlayers(response.players))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTeam]);

  // Calculate success rate
  const getSuccessRate = (player: Player) => {
    if (player.total_events === 0) return 0;
    return ((player.successful_events / player.total_events) * 100).toFixed(1);
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Players 🏒</h1>

      {/* Team Filter */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Filter by Team</label>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full max-w-md p-2 border rounded text-black"
        >
          <option value="">All Teams</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team.replace("Olympic (Women) - ", "")}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && <p>Loading players...</p>}

      {/* Players Table */}
      {!loading && players.length > 0 && (
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
                <th className="px-6 py-3 border text-center">Total Events</th>
                <th className="px-6 py-3 border text-center">Successful</th>
                <th className="px-6 py-3 border text-center">Success Rate</th>
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
                  <td className="px-6 py-3 border text-center">
                    {player.total_events}
                  </td>
                  <td className="px-6 py-3 border text-center text-green-600">
                    {player.successful_events}
                  </td>
                  <td className="px-6 py-3 border text-center font-semibold">
                    {getSuccessRate(player)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Results */}
      {!loading && players.length === 0 && (
        <p className="text-gray-500">No players found.</p>
      )}
    </main>
  );
}
