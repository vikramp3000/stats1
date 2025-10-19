"use client";

import { useState, useEffect } from "react";
import { getTeamsStats } from "@/lib/api";
import { Team } from "@/lib/types";
import TeamsTable from "../components/TeamsTable";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTeamsStats()
      .then((response) => setTeams(response.teams))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen p-8 w-[60%] mx-auto">
      <h1 className="text-4xl font-bold mb-8">Teams 🏒</h1>

      <TeamsTable teams={teams} loading={loading} />
    </main>
  );
}
