import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-200 p-8">
      {/* Hero Section */}
      <div className="max-w-[60%] mx-auto mb-12">
        <div className="bg-neutral-300 border-[3px] border-neutral-800 rounded-sm p-12 text-center text-neutral-800">
          <h1 className="text-6xl font-bold mb-4">
            🏒 2022 Women&apos;s Olympic Hockey
          </h1>
          <p className="text-2xl text-foreground/70 mb-2">
            2022 Olympics Play-by-Play Analytics
          </p>
          <p className="text-lg text-foreground/60">
            Explore comprehensive statistics, game flow analysis, and player
            performance from the tournament
          </p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="max-w-[60%] mx-auto mb-12">
        <h2 className="text-4xl font-bold mb-6 text-center">
          Explore the Data
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Games/Game Flow */}
          <Link href="/games">
            <div className="bg-blue-500 border-[3px] border-neutral-800 rounded-sm p-6 hover:bg-blue-600 transition-colors h-full">
              {/* Image Placeholder */}
              <div className="bg-neutral-100 border-[3px] border-neutral-800 rounded-sm h-40 mb-4 flex items-center justify-center">
                <div className="text-6xl">🏒</div>
              </div>

              <h3 className="text-2xl font-bold mb-2 text-white">
                Game Flow Analysis
              </h3>
              <p className="text-white/90 mb-3">
                Interactive play-by-play visualization. Watch events unfold on
                an animated rink with detailed stats.
              </p>

              <div className="space-y-1 text-sm text-white/80">
                <p>• Play-by-play event tracking</p>
                <p>• Interactive rink visualization</p>
                <p>• Team comparisons</p>
                <p>• Shot charts</p>
              </div>
            </div>
          </Link>

          {/* Teams */}
          <Link href="/teams">
            <div className="bg-green-500 border-[3px] border-neutral-800 rounded-sm p-6 hover:bg-green-600 transition-colors h-full">
              {/* Image Placeholder */}
              <div className="bg-neutral-100 border-[3px] border-neutral-800 rounded-sm h-40 mb-4 flex items-center justify-center">
                <div className="text-6xl">🏅</div>
              </div>

              <h3 className="text-2xl font-bold mb-2 text-white">
                Team Statistics
              </h3>
              <p className="text-white/90 mb-3">
                Compare team performance across the tournament. Analyze shooting
                percentages and zone entries.
              </p>

              <div className="space-y-1 text-sm text-white/80">
                <p>• 5 National teams</p>
                <p>• Comprehensive shot charts</p>
                <p>• Game-by-game breakdowns</p>
                <p>• Team averages</p>
              </div>
            </div>
          </Link>

          {/* Players */}
          <Link href="/players">
            <div className="bg-amber-500 border-[3px] border-neutral-800 rounded-sm p-6 hover:bg-amber-600 transition-colors h-full">
              {/* Image Placeholder */}
              <div className="bg-neutral-100 border-[3px] border-neutral-800 rounded-sm h-40 mb-4 flex items-center justify-center">
                <div className="text-6xl">⭐</div>
              </div>

              <h3 className="text-2xl font-bold mb-2 text-white">
                Player Performance
              </h3>
              <p className="text-white/90 mb-3">
                Individual player statistics. Track goals, assists, shooting
                accuracy, and advanced metrics.
              </p>

              <div className="space-y-1 text-sm text-white/80">
                <p>• 100+ Athletes tracked</p>
                <p>• Individual event tracking</p>
                <p>• Performance rankings</p>
                <p>• Detailed breakdowns</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-[60%] mx-auto mb-12">
        <div className="bg-neutral-300 border-[3px] border-neutral-800 rounded-sm p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Tournament Overview
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-500 border-[3px] border-neutral-800 rounded-sm p-6 text-center">
              <div className="text-5xl font-bold text-white mb-2">6</div>
              <div className="text-white font-bold">Games</div>
            </div>

            <div className="bg-blue-500 border-[3px] border-neutral-800 rounded-sm p-6 text-center">
              <div className="text-5xl font-bold text-white mb-2">5</div>
              <div className="text-white font-bold">Nations</div>
            </div>

            <div className="bg-violet-500 border-[3px] border-neutral-800 rounded-sm p-6 text-center">
              <div className="text-5xl font-bold text-white mb-2">100+</div>
              <div className="text-white font-bold">Athletes</div>
            </div>

            <div className="bg-orange-500 border-[3px] border-neutral-800 rounded-sm p-6 text-center">
              <div className="text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-white font-bold">Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Details */}
      <div className="max-w-[60%] mx-auto">
        <div className="bg-neutral-300 border-[3px] border-neutral-800 rounded-sm p-8">
          <h2 className="text-3xl font-bold mb-6">What&apos;s Included</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-neutral-100 border-[3px] border-neutral-800 rounded-sm p-6">
              <h3 className="text-xl font-bold mb-3">Game Analysis</h3>
              <ul className="space-y-2 text-foreground/80">
                <li>🏒 Play-by-play event tracking with coordinates</li>
                <li>📊 Interactive rink visualization</li>
                <li>🎯 Shot charts and pass maps</li>
                <li>⏱️ Period-by-period breakdowns</li>
                <li>⚔️ Team vs team comparisons</li>
              </ul>
            </div>

            <div className="bg-neutral-100 border-[3px] border-neutral-800 rounded-sm p-6">
              <h3 className="text-xl font-bold mb-3">Advanced Metrics</h3>
              <ul className="space-y-2 text-foreground/80">
                <li>⬆️ Zone entry success rates</li>
                <li>🎯 Pass completion percentages</li>
                <li>⚫ Faceoff win statistics</li>
                <li>🔄 Puck recovery tracking</li>
                <li>📈 Player-level event data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
