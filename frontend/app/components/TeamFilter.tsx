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
  label = "Filter by Team:",
  showAllOption = true,
}: TeamFilterProps) {
  // Handle value change - convert "all" to empty string for the API
  const handleValueChange = (value: string) => {
    onTeamChange(value === "all" ? "" : value);
  };

  // Convert empty string back to "all" for the Select component
  // //this is to prevent an error when no team is selected for shadcn
  const selectValue = selectedTeam === "" ? "all" : selectedTeam;

  return (
    <div className="mb-8 flex items-center gap-4">
      <label className="block text-sm font-medium">{label}</label>

      <Select value={selectValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[250px] bg-neutral-200 rounded-sm">
          <SelectValue
            placeholder={showAllOption ? "All Teams" : "-- Select a team --"}
          />
        </SelectTrigger>

        <SelectContent className="bg-neutral-200">
          <SelectGroup>
            {showAllOption && <SelectItem value="all">All Teams</SelectItem>}

            {teams.map((team) => (
              <SelectItem key={team} value={team}>
                {cleanTeamName(team)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
