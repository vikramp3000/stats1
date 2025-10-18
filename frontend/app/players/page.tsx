"use client";

import { useState, useEffect } from "react";
import { getPlayers, getTeams } from "@/lib/api";
import { Player } from "@/lib/types";
import TeamFilter from "@/app/components/TeamFilter";
import PlayersTable from "@/app/components/PlayersTable";

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

  return (
    <main className="min-h-screen p-8 w-[60%] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-8">Players 🏒</h1>
        <TeamFilter
          teams={teams}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
          showAllOption={true}
        />
      </div>

      <PlayersTable
        players={players}
        loading={loading}
        selectedTeam={selectedTeam}
      />
    </main>
  );
}
