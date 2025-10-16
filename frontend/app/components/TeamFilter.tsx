"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cleanTeamName } from "@/lib/utils";

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
  // Handle value change - convert "all" to empty string for the API
  const handleValueChange = (value: string) => {
    onTeamChange(value === "all" ? "" : value);
  };

  // Convert empty string back to "all" for the Select component
  const selectValue = selectedTeam === "" ? "all" : selectedTeam;

  return (
    <div className="mb-8 flex items-center gap-4">
      <label className="block text-sm font-medium">{label}</label>

      <Select value={selectValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[250px]">
          <SelectValue
            placeholder={showAllOption ? "All Teams" : "-- Select a team --"}
          />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {showAllOption && <SelectItem value="all">All Teams</SelectItem>}

            {teams.map((team) => (
              <SelectItem key={team} value={team}>
                {/* {team.replace("Olympic (Women) - ", "")} */}
                {cleanTeamName(team)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
// "use client";

// interface TeamFilterProps {
//   teams: string[];
//   selectedTeam: string;
//   onTeamChange: (team: string) => void;
//   label?: string;
//   showAllOption?: boolean;
// }

// export default function TeamFilter({
//   teams,
//   selectedTeam,
//   onTeamChange,
//   label = "Filter by Team",
//   showAllOption = true,
// }: TeamFilterProps) {
//   return (
//     <div className="mb-8">
//       <label className="block text-sm font-medium mb-2">{label}</label>
//       <select
//         value={selectedTeam}
//         onChange={(e) => onTeamChange(e.target.value)}
//         className="w-full max-w-md p-2 border rounded text-black"
//       >
//         {showAllOption && <option value="">All Teams</option>}
//         {!showAllOption && <option value="">-- Select a team --</option>}
//         {teams.map((team) => (
//           <option key={team} value={team}>
//             {team.replace("Olympic (Women) - ", "")}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }
