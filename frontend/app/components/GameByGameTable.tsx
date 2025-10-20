import { cleanTeamName } from "@/lib/utils";
import { PlayerGame, TeamGame } from "@/lib/types";

interface GameByGameTableProps {
  games: PlayerGame[] | TeamGame[];
}

export default function GameByGameTable({ games }: GameByGameTableProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Game by Game</h2>
      <div className="border-[3px] rounded-sm overflow-hidden">
        <table className="min-w-full bg-neutral-100">
          <thead className="bg-neutral-300 font-bold">
            <tr>
              <th className="px-6 py-4 border-b-[3px] border-r-[3px] text-left">
                Date
              </th>
              <th className="px-6 py-4 border-b-[3px] border-r-[3px] text-left">
                Opponent
              </th>
              <th className="px-6 py-4 border-b-[3px] border-r-[3px] text-center">
                Final Score
              </th>
              <th className="px-6 py-4 border-b-[3px] border-r-[3px] text-center">
                Goals
              </th>
              <th className="px-6 py-4 border-b-[3px] border-r-[3px]">Shots</th>
              <th className="px-6 py-4 border-b-[3px] text-center">Passes</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, index) => (
              <tr key={index}>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px]">
                  {new Date(game.game_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px]">
                  {cleanTeamName(game.opp_team_name)}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] text-center font-bold">
                  {game.score_for} - {game.score_against}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] text-center">
                  {game.goals}
                </td>
                <td className="px-6 py-4 border-b-[3px] border-r-[3px] text-center">
                  {game.shots}
                </td>
                <td className="px-6 py-4 border-b-[3px] text-center">
                  {game.passes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
