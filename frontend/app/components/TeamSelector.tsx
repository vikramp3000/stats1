"use client";

interface TeamSelectorProps {
  teams: string[];
  selectedTeam: string;
  onTeamChange: (team: string) => void;
}

export default function TeamSelector({
  teams,
  selectedTeam,
  onTeamChange,
}: TeamSelectorProps) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium mb-2">Select Team</label>
      <select
        value={selectedTeam}
        onChange={(e) => onTeamChange(e.target.value)}
        className="w-full max-w-md p-2 border rounded text-black"
      >
        <option value="">-- Select a team --</option>
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
    </div>
  );
}
