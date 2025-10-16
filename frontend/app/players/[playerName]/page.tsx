"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PlayerDetailPage() {
  const params = useParams();
  const playerName = decodeURIComponent(params.playerName as string);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We'll fetch player data here later
    setLoading(false);
  }, [playerName]);

  return (
    <main className="min-h-screen p-8">
      {/* Back Button */}
      <Link
        href="/players"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Players
      </Link>

      {/* Player Header */}
      <h1 className="text-4xl font-bold mb-8">{playerName}</h1>

      {loading ? (
        <p>Loading player details...</p>
      ) : (
        <div>
          <p className="text-gray-600 mb-8">
            Detailed stats and information for {playerName}
          </p>

          {/* Placeholder for future content */}
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <p className="text-gray-500">Player details coming soon...</p>
          </div>
        </div>
      )}
    </main>
  );
}
