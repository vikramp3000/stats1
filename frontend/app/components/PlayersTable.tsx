"use client";

import { Button } from "@/components/ui/button";
import { Player } from "@/lib/types";
import { cleanTeamName } from "@/lib/utils";
import Link from "next/link";
import { useState, useMemo } from "react";

interface PlayersTableProps {
  players: Player[];
  loading?: boolean;
  selectedTeam?: string;
}

type SortKey =
  | "player_name"
  | "team_name"
  | "games_played"
  | "goals"
  | "successful_plays"
  | "shots";
type SortDirection = "asc" | "desc" | null;

export default function PlayersTable({
  players,
  loading = false,
  selectedTeam = "",
}: PlayersTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedPlayers = useMemo(() => {
    if (!sortKey || !sortDirection) return players;

    return [...players].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [players, sortKey, sortDirection]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) {
      return <span className="ml-1 text-foreground/40">⇅</span>;
    }
    return sortDirection === "asc" ? (
      <span className="ml-1">↑</span>
    ) : (
      <span className="ml-1">↓</span>
    );
  };

  if (loading) {
    return <p>Loading players...</p>;
  }

  if (players.length === 0) {
    return <p className="text-muted-foreground">No players found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-heading mb-6">
        {selectedTeam
          ? `${players.length} Players`
          : `All ${players.length} Players`}
      </h2>

      {/* Neobrutalism Table Container with Shadow */}
      <div className="border-[3px] border-border bg-secondary-background shadow-[var(--shadow)] rounded-base overflow-hidden">
        <table className="min-w-full">
          {/* Header with Blue Background */}
          <thead>
            <tr className="bg-main">
              <th
                onClick={() => handleSort("player_name")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-left cursor-pointer"
              >
                Player Name <SortIcon column="player_name" />
              </th>
              <th
                onClick={() => handleSort("team_name")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-left cursor-pointer"
              >
                Team <SortIcon column="team_name" />
              </th>
              <th
                onClick={() => handleSort("games_played")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-center cursor-pointer"
              >
                Games <SortIcon column="games_played" />
              </th>
              <th
                onClick={() => handleSort("goals")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-center cursor-pointer"
              >
                🥅 Goals <SortIcon column="goals" />
              </th>
              <th
                onClick={() => handleSort("shots")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-center cursor-pointer"
              >
                🏒 Shots On Goal <SortIcon column="shots" />
              </th>
              <th
                onClick={() => handleSort("successful_plays")}
                className="px-6 py-4 border-b-[3px] border-r-[3px] border-border text-center cursor-pointer"
              >
                🎯 Passes <SortIcon column="successful_plays" />
              </th>

              <th className="px-6 py-4 border-b-[3px] border-border text-center font-heading">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body with White Background */}
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr key={index} className="hover:bg-background transition-colors">
                <td className="px-6 py-4 border-b-[2px] border-r-[2px] border-border font-semibold">
                  {player.player_name}
                </td>
                <td className="px-6 py-4 border-b-[2px] border-r-[2px] border-border text-sm">
                  {cleanTeamName(player.team_name)}
                </td>
                <td className="px-6 py-4 border-b-[2px] border-r-[2px] border-border text-center font-base">
                  {player.games_played}
                </td>
                <td className="px-6 py-4 border-b-[2px] border-r-[2px] border-border text-center font-base">
                  {player.goals}
                </td>
                <td className="px-6 py-4 border-b-[2px] border-r-[2px] border-border text-center font-base">
                  {player.shots}
                </td>
                <td className="px-6 py-4 border-b-[2px] border-r-[2px] border-border text-center font-base">
                  {player.successful_plays}
                </td>

                <td className="px-6 py-4 border-b-[2px] border-border text-center">
                  <Button asChild>
                    <Link
                      href={`/players/${encodeURIComponent(
                        player.player_name
                      )}`}
                    >
                      View Details
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// "use client";

// import { Button } from "@/components/ui/button";
// import { Player } from "@/lib/types";
// import Link from "next/link";
// import { useState, useMemo } from "react";

// interface PlayersTableProps {
//   players: Player[];
//   loading?: boolean;
//   selectedTeam?: string;
// }

// type SortKey =
//   | "player_name"
//   | "team_name"
//   | "games_played"
//   | "goals"
//   | "successful_plays"
//   | "shots";
// type SortDirection = "asc" | "desc" | null;

// export default function PlayersTable({
//   players,
//   loading = false,
//   selectedTeam = "",
// }: PlayersTableProps) {
//   const [sortKey, setSortKey] = useState<SortKey | null>(null);
//   const [sortDirection, setSortDirection] = useState<SortDirection>(null);

//   // Handle column header click
//   const handleSort = (key: SortKey) => {
//     if (sortKey === key) {
//       // Cycle through: asc → desc → null
//       if (sortDirection === "asc") {
//         setSortDirection("desc");
//       } else if (sortDirection === "desc") {
//         setSortDirection(null);
//         setSortKey(null);
//       }
//     } else {
//       setSortKey(key);
//       setSortDirection("asc");
//     }
//   };

//   // Sort players based on current sort state
//   const sortedPlayers = useMemo(() => {
//     if (!sortKey || !sortDirection) return players;

//     return [...players].sort((a, b) => {
//       const aValue = a[sortKey];
//       const bValue = b[sortKey];

//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return sortDirection === "asc"
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }

//       if (typeof aValue === "number" && typeof bValue === "number") {
//         return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
//       }

//       return 0;
//     });
//   }, [players, sortKey, sortDirection]);

//   // Render sort indicator
//   const SortIcon = ({ column }: { column: SortKey }) => {
//     if (sortKey !== column) {
//       return <span className="text-gray-400 ml-1">⇅</span>;
//     }
//     return sortDirection === "asc" ? (
//       <span className="ml-1">↑</span>
//     ) : (
//       <span className="ml-1">↓</span>
//     );
//   };

//   if (loading) {
//     return <p>Loading players...</p>;
//   }

//   if (players.length === 0) {
//     return <p className="text-gray-500">No players found.</p>;
//   }

//   return (
//     <div className="overflow-x-auto">
//       <h2 className="text-2xl font-semibold mb-4">
//         {selectedTeam
//           ? `${players.length} Players`
//           : `All ${players.length} Players`}
//       </h2>

//       <table className="min-w-full bg-white border text-black">
//         <thead className="bg-gray-100">
//           <tr>
//             {/* Sortable Headers */}
//             <th
//               onClick={() => handleSort("player_name")}
//               className="px-6 py-3 border text-left cursor-pointer hover:bg-gray-200 select-none"
//             >
//               Player Name <SortIcon column="player_name" />
//             </th>
//             <th
//               onClick={() => handleSort("team_name")}
//               className="px-6 py-3 border text-left cursor-pointer hover:bg-gray-200 select-none"
//             >
//               Team <SortIcon column="team_name" />
//             </th>
//             <th
//               onClick={() => handleSort("games_played")}
//               className="px-6 py-3 border text-center cursor-pointer hover:bg-gray-200 select-none"
//             >
//               Games <SortIcon column="games_played" />
//             </th>
//             <th
//               onClick={() => handleSort("goals")}
//               className="px-6 py-3 border text-center cursor-pointer hover:bg-gray-200 select-none"
//             >
//               🥅 Goals <SortIcon column="goals" />
//             </th>
//             <th
//               onClick={() => handleSort("successful_plays")}
//               className="px-6 py-3 border text-center cursor-pointer hover:bg-gray-200 select-none"
//             >
//               🎯 Plays <SortIcon column="successful_plays" />
//             </th>
//             <th
//               onClick={() => handleSort("shots")}
//               className="px-6 py-3 border text-center cursor-pointer hover:bg-gray-200 select-none"
//             >
//               🏒 Shots <SortIcon column="shots" />
//             </th>
//             <th className="px-6 py-3 border text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedPlayers.map((player, index) => (
//             <tr key={index} className="hover:bg-gray-50">
//               <td className="px-6 py-3 border font-semibold">
//                 {player.player_name}
//               </td>
//               <td className="px-6 py-3 border text-sm">
//                 {player.team_name.replace("Olympic (Women) - ", "")}
//               </td>
//               <td className="px-6 py-3 border text-center">
//                 {player.games_played}
//               </td>
//               <td className="px-6 py-3 border text-center font-bold text-red-600">
//                 {player.goals}
//               </td>
//               <td className="px-6 py-3 border text-center text-green-600">
//                 {player.successful_plays}
//               </td>
//               <td className="px-6 py-3 border text-center">{player.shots}</td>
//               <td className="px-6 py-3 border text-center">
//                 {/* <Link
//                   href={`/players/${encodeURIComponent(player.player_name)}`}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
//                 >
//                   View Details
//                 </Link> */}
//                 <Button>
//                   <Link
//                     href={`/players/${encodeURIComponent(player.player_name)}`}
//                     //className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
//                   >
//                     View Details
//                   </Link>
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
