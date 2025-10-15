import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">🏒 NHL Stats</h1>
        <p className="text-xl text-gray-600 mb-8">
          Women's Olympic Hockey Play-by-Play Data
        </p>

        <div className="space-y-4">
          <Link
            href="/alldata"
            className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            View All Data →
          </Link>

          {/* Placeholder for future pages */}
          <div className="text-sm text-gray-500 mt-8">
            <p>Coming soon:</p>
            <p>• Player Stats</p>
            <p>• Team Comparisons</p>
            <p>• Game Analytics</p>
          </div>
        </div>
      </div>
    </main>
  );
}
