"use client";

import { useState, useEffect } from "react";
import { getTeams, getEvents, type PlayByPlayEvent } from "@/lib/api";

export default function Home() {
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [events, setEvents] = useState<PlayByPlayEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch teams on mount
  useEffect(() => {
    getTeams().then(setTeams).catch(console.error);
  }, []);

  // Fetch events when team changes
  useEffect(() => {
    if (!selectedTeam) return;

    setLoading(true);
    getEvents({ team: selectedTeam, limit: 2000 })
      .then((response) => setEvents(response.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTeam]);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">NHL Stats Dashboard 🏒</h1>

      {/* Team Selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Select Team</label>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full max-w-md p-2 border rounded text-black"
        >
          <option value="">-- Select a team --</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>

      {/* Events Table */}
      {loading && <p>Loading events...</p>}

      {!loading && events.length > 0 && (
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">
            Recent Events ({events.length})
          </h2>
          <table className="min-w-full bg-white border text-black">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Period</th>
                <th className="px-4 py-2 border">Time</th>
                <th className="px-4 py-2 border">Player</th>
                <th className="px-4 py-2 border">Event</th>
                <th className="px-4 py-2 border">Success</th>
                <th className="px-4 py-2 border">Situation</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">
                    {event.period}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {Math.floor(event.clock_seconds / 60)}:
                    {(event.clock_seconds % 60).toString().padStart(2, "0")}
                  </td>
                  <td className="px-4 py-2 border">
                    {event.player_name || "-"}
                  </td>
                  <td className="px-4 py-2 border">{event.event}</td>
                  <td className="px-4 py-2 border text-center">
                    {event.event_successful ? "✅" : "❌"}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {event.situation_type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && selectedTeam && events.length === 0 && (
        <p>No events found for this team.</p>
      )}
    </main>
  );
}
