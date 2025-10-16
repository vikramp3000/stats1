import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanTeamName(teamName: string): string {
  return teamName
    .replace("Olympic (Women) - ", "")
    .replace("Olympic Athletes from ", "");
}
