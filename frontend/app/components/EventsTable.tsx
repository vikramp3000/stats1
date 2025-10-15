"use client";

import { PlayByPlayEvent } from "@/lib/types";

interface EventsTableProps {
  events: PlayByPlayEvent[];
  loading?: boolean;
}

export default function EventsTable({
  events,
  loading = false,
}: EventsTableProps) {
  if (loading) {
    return <p>Loading events...</p>;
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Recent Events ({events.length})
      </h2>
      <table className="min-w-full bg-white border text-black text-sm">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            {/* 1. ID */}
            <th className="px-3 py-2 border">ID</th>

            {/* 2-6. Game Info */}
            <th className="px-3 py-2 border">Date</th>
            <th className="px-3 py-2 border">Season</th>
            <th className="px-3 py-2 border">Team</th>
            <th className="px-3 py-2 border">Opponent</th>
            <th className="px-3 py-2 border">Venue</th>

            {/* 7-8. Time Info */}
            <th className="px-3 py-2 border">Period</th>
            <th className="px-3 py-2 border">Time</th>

            {/* 9-10. Score */}
            <th className="px-3 py-2 border">GF</th>
            <th className="px-3 py-2 border">GA</th>

            {/* 11. Situation */}
            <th className="px-3 py-2 border">Situation</th>

            {/* 12-14. Event Info */}
            <th className="px-3 py-2 border">Event</th>
            <th className="px-3 py-2 border">Success</th>
            <th className="px-3 py-2 border">Event Type</th>

            {/* 15-17. Primary Player */}
            <th className="px-3 py-2 border">Player</th>
            <th className="px-3 py-2 border">X</th>
            <th className="px-3 py-2 border">Y</th>

            {/* 18-20. Secondary Player */}
            <th className="px-3 py-2 border">Player 2</th>
            <th className="px-3 py-2 border">X2</th>
            <th className="px-3 py-2 border">Y2</th>

            {/* 21-23. Event Details */}
            <th className="px-3 py-2 border">Detail 1</th>
            <th className="px-3 py-2 border">Detail 2</th>
            <th className="px-3 py-2 border">Detail 3</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-gray-50">
              {/* 1. ID */}
              <td className="px-3 py-2 border text-center text-gray-500 text-xs">
                {event.id}
              </td>

              {/* 2. game_date */}
              <td className="px-3 py-2 border whitespace-nowrap">
                {new Date(event.game_date).toLocaleDateString()}
              </td>

              {/* 3. season_year */}
              <td className="px-3 py-2 border text-center">
                {event.season_year}
              </td>

              {/* 4. team_name */}
              <td className="px-3 py-2 border text-xs">
                {event.team_name.replace("Olympic (Women) - ", "")}
              </td>

              {/* 5. opp_team_name */}
              <td className="px-3 py-2 border text-xs">
                {event.opp_team_name.replace("Olympic (Women) - ", "")}
              </td>

              {/* 6. venue */}
              <td className="px-3 py-2 border text-center">
                {event.venue === "home" ? "🏠" : "✈️"}
              </td>

              {/* 7. period */}
              <td className="px-3 py-2 border text-center">{event.period}</td>

              {/* 8. clock_seconds */}
              <td className="px-3 py-2 border text-center whitespace-nowrap">
                {Math.floor(event.clock_seconds / 60)}:
                {(event.clock_seconds % 60).toString().padStart(2, "0")}
              </td>

              {/* 9. goals_for */}
              <td className="px-3 py-2 border text-center font-semibold">
                {event.goals_for}
              </td>

              {/* 10. goals_against */}
              <td className="px-3 py-2 border text-center font-semibold">
                {event.goals_against}
              </td>

              {/* 11. situation_type */}
              <td className="px-3 py-2 border text-center text-xs">
                {event.situation_type}
              </td>

              {/* 12. event */}
              <td className="px-3 py-2 border font-medium">{event.event}</td>

              {/* 13. event_successful */}
              <td className="px-3 py-2 border text-center">
                {event.event_successful ? "✅" : "❌"}
              </td>

              {/* 14. event_type */}
              <td className="px-3 py-2 border text-xs">
                {event.event_type || "-"}
              </td>

              {/* 15. player_name */}
              <td className="px-3 py-2 border">{event.player_name || "-"}</td>

              {/* 16. x_coord */}
              <td className="px-3 py-2 border text-center text-xs">
                {event.x_coord ?? "-"}
              </td>

              {/* 17. y_coord */}
              <td className="px-3 py-2 border text-center text-xs">
                {event.y_coord ?? "-"}
              </td>

              {/* 18. player_name_2 */}
              <td className="px-3 py-2 border text-xs">
                {event.player_name_2 || "-"}
              </td>

              {/* 19. x_coord_2 */}
              <td className="px-3 py-2 border text-center text-xs">
                {event.x_coord_2 ?? "-"}
              </td>

              {/* 20. y_coord_2 */}
              <td className="px-3 py-2 border text-center text-xs">
                {event.y_coord_2 ?? "-"}
              </td>

              {/* 21. event_detail_1 */}
              <td className="px-3 py-2 border text-xs">
                {event.event_detail_1 || "-"}
              </td>

              {/* 22. event_detail_2 */}
              <td className="px-3 py-2 border text-xs">
                {event.event_detail_2 || "-"}
              </td>

              {/* 23. event_detail_3 */}
              <td className="px-3 py-2 border text-xs">
                {event.event_detail_3 || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
