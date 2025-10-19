"use client";

import { useState, useEffect } from "react";
import { getGames } from "@/lib/api";
import { Game } from "@/lib/types";
import GamesTable from "@/app/components/GameTable";

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getGames()
      .then((response) => setGames(response.games))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen p-8 w-[60%] mx-auto">
      <h1 className="text-4xl font-bold mb-8">Games 🏒</h1>

      <GamesTable games={games} loading={loading} />
    </main>
  );
}
