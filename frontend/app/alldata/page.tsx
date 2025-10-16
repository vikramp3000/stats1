"use client";

import { useState, useEffect } from "react";
import { getTeams, getEvents } from "@/lib/api";
import { PlayByPlayEvent } from "@/lib/types";
import TeamFilter from "@/app/components/TeamFilter";
import EventsTable from "@/app/components/EventsTable";

export default function AllDataPage() {
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [events, setEvents] = useState<PlayByPlayEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTeams().then(setTeams).catch(console.error);
  }, []);

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
      <h1 className="text-3xl font-bold mb-8">Play-by-Play Events</h1>

      <TeamFilter
        teams={teams}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        label="Select Team"
        showAllOption={false}
      />

      <EventsTable events={events} loading={loading} />

      {!loading && selectedTeam && events.length === 0 && (
        <p>No events found for this team.</p>
      )}
    </main>
  );
}
