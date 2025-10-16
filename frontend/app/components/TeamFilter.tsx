"use client";

interface TeamFilterProps {
  teams: string[];
  selectedTeam: string;
  onTeamChange: (team: string) => void;
  label?: string;
  showAllOption?: boolean;
}

export default function TeamFilter({
  teams,
  selectedTeam,
  onTeamChange,
  label = "Filter by Team",
  showAllOption = true,
}: TeamFilterProps) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        value={selectedTeam}
        onChange={(e) => onTeamChange(e.target.value)}
        className="w-full max-w-md p-2 border rounded text-black"
      >
        {showAllOption && <option value="">All Teams</option>}
        {!showAllOption && <option value="">-- Select a team --</option>}
        {teams.map((team) => (
          <option key={team} value={team}>
            {team.replace("Olympic (Women) - ", "")}
          </option>
        ))}
      </select>
    </div>
  );
}
