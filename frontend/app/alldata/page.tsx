"use client";

import { useState, useEffect } from "react";
import { getTeams, getEvents } from "@/lib/api";
import TeamSelector from "@/app/components/TeamSelector";
import EventsTable from "@/app/components/EventsTable";
import { PlayByPlayEvent } from "@/lib/types";

export default function AllDataPage() {
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
      <h1 className="text-4xl font-bold mb-8">All Play-by-Play Data 🏒</h1>

      <TeamSelector
        teams={teams}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
      />

      <EventsTable events={events} loading={loading} />

      {!loading && selectedTeam && events.length === 0 && (
        <p>No events found for this team.</p>
      )}
    </main>
  );
}
