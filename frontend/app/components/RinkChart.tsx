"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cleanTeamName } from "@/lib/utils";

interface RinkEvent {
  x_coord: number;
  y_coord: number;
  event: string;
  event_successful: boolean;
  period?: number;
  clock_seconds?: number;
  player_name?: string | null;
  opp_team_name?: string | null;
  situation_type?: string | null;
  player_name_2?: string | null;
  x_coord_2?: number | null;
  y_coord_2?: number | null;
  event_type?: string | null;
}

interface RinkChartProps {
  events: RinkEvent[];
  title?: string;
}

export default function RinkChart({
  events,
  title = "Shot Chart",
}: RinkChartProps) {
  // Filter state
  const [showGoals, setShowGoals] = useState(true);
  const [showShots, setShowShots] = useState(true);
  const [showPasses, setShowPasses] = useState(false); // Passes off by default

  // Scale: Rink is 200x85, we'll scale to 600x255 (multiply by 3)
  const scale = 3;
  const width = 200 * scale; // 600px
  const height = 85 * scale; // 255px

  const getEventColor = (event: RinkEvent) => {
    if (event.event === "Shot" && event.event_successful) {
      return "#ef4444"; // Red - Goal
    }
    if (event.event === "Shot") {
      return "#3b82f6"; // Blue - Shot
    }
    if (event.event === "Play") {
      return "#10b981"; // Green - Pass
    }
    return "#6b7280"; // Gray - Other
  };

  const getEventLabel = (event: RinkEvent) => {
    if (event.event === "Shot" && event.event_successful) return "🥅 Goal";
    if (event.event === "Shot") return "🏒 Shot";
    if (event.event === "Play") return "🎯 Pass";
    return event.event;
  };

  // Filter events that have coordinates AND match selected types
  const validEvents = events.filter((e) => {
    if (!e.x_coord || !e.y_coord) return false;

    // Check if event matches selected filters
    if (e.event === "Shot" && e.event_successful && showGoals) return true;
    if (e.event === "Shot" && !e.event_successful && showShots) return true;
    if (e.event === "Play" && showPasses) return true;

    return false;
  });

  // Count by type (from all events, not just filtered)
  const allValidEvents = events.filter((e) => e.x_coord && e.y_coord);
  const goals = allValidEvents.filter(
    (e) => e.event === "Shot" && e.event_successful
  ).length;
  const shots = allValidEvents.filter(
    (e) => e.event === "Shot" && !e.event_successful
  ).length;
  const passes = allValidEvents.filter((e) => e.event === "Play").length;

  return (
    <div className="border-[3px] border-neutral-800 rounded-sm p-6 bg-neutral-300">
      <h3 className="text-xl font-bold mb-4">{title}</h3>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-4">
        <Button
          onClick={() => setShowGoals(!showGoals)}
          variant={showGoals ? "default" : "neutral"}
          size="lg"
          className={`border-[3px] rounded-sm font-bold ${
            showGoals
              ? "bg-red-500 border-neutral-800"
              : "bg-neutral-50 border-neutral-800"
          }`}
        >
          🥅 Goals ({goals})
        </Button>

        <Button
          onClick={() => setShowShots(!showShots)}
          variant={showShots ? "default" : "neutral"}
          size="lg"
          className={`border-[3px] rounded-sm font-bold ${
            showShots
              ? "bg-blue-500 border-neutral-800"
              : "bg-neutral-50 border-neutral-800"
          }`}
        >
          🏒 Shots ({shots})
        </Button>

        <Button
          onClick={() => setShowPasses(!showPasses)}
          variant={showPasses ? "default" : "neutral"}
          size="lg"
          className={`border-[3px] rounded-sm font-bold ${
            showPasses
              ? "bg-green-500 text-neutral-800 border-neutral-800"
              : "bg-neutral-50 border-neutral-800"
          }`}
        >
          🎯 Passes ({passes})
        </Button>
      </div>

      {/* SVG Rink */}
      <div
        className="border-[3px] border-neutral-800 rounded-sm overflow-hidden bg-neutral-100 flex justify-center items-center"
        style={{ minHeight: "600px" }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{
            maxWidth: "800px",
            transform: "rotate(-90deg)",
            transformOrigin: "center center",
          }}
        >
          {/* Ice surface */}
          <rect x="0" y="0" width={width} height={height} fill="#e0f2fe" />

          {/* Outer rink border */}
          <rect
            x="5"
            y="5"
            width={width - 10}
            height={height - 10}
            fill="none"
            stroke="#000"
            strokeWidth="4"
            rx="20"
          />

          {/* Center red line */}
          <line
            x1={width / 2}
            y1="10"
            x2={width / 2}
            y2={height - 10}
            stroke="#ef4444"
            strokeWidth="4"
          />

          {/* Blue lines */}
          <line
            x1={width * 0.25}
            y1="10"
            x2={width * 0.25}
            y2={height - 10}
            stroke="#2563eb"
            strokeWidth="3"
          />
          <line
            x1={width * 0.75}
            y1="10"
            x2={width * 0.75}
            y2={height - 10}
            stroke="#2563eb"
            strokeWidth="3"
          />

          {/* Center circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={30}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
          />
          <circle cx={width / 2} cy={height / 2} r={3} fill="#2563eb" />

          {/* Faceoff circles (left zone) */}
          <circle
            cx={width * 0.15}
            cy={height * 0.3}
            r={25}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />
          <circle
            cx={width * 0.15}
            cy={height * 0.7}
            r={25}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />

          {/* Faceoff circles (right zone) */}
          <circle
            cx={width * 0.85}
            cy={height * 0.3}
            r={25}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />
          <circle
            cx={width * 0.85}
            cy={height * 0.7}
            r={25}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />

          {/* Goal creases */}
          <path
            d={`M 20,${height / 2 - 15} L 35,${height / 2 - 15} L 35,${
              height / 2 + 15
            } L 20,${height / 2 + 15}`}
            fill="#dbeafe"
            stroke="#2563eb"
            strokeWidth="2"
          />
          <path
            d={`M ${width - 20},${height / 2 - 15} L ${width - 35},${
              height / 2 - 15
            } L ${width - 35},${height / 2 + 15} L ${width - 20},${
              height / 2 + 15
            }`}
            fill="#dbeafe"
            stroke="#2563eb"
            strokeWidth="2"
          />

          {/* Pass Lines - drawn before dots so dots appear on top */}
          {showPasses &&
            validEvents
              .filter(
                (event) =>
                  event.event === "Play" && event.x_coord_2 && event.y_coord_2
              )
              .map((event, index) => (
                <g key={`pass-${index}`}>
                  {/* Pass line */}
                  <line
                    x1={event.x_coord * scale}
                    y1={event.y_coord * scale}
                    x2={event.x_coord_2! * scale}
                    y2={event.y_coord_2! * scale}
                    stroke={"#10b981"}
                    strokeWidth="2"
                    opacity="0.6"
                    strokeDasharray={"5,5"}
                  />
                  {/* Small circle at receiving end */}
                  <circle
                    cx={event.x_coord_2! * scale}
                    cy={event.y_coord_2! * scale}
                    r="3"
                    fill={"#10b981"}
                  />
                </g>
              ))}

          {/* Event dots (only filtered events) */}
          {validEvents.map((event, index) => (
            <g key={index}>
              <circle
                cx={event.x_coord * scale}
                cy={event.y_coord * scale}
                r="6"
                fill={getEventColor(event)}
                opacity="0.85"
                stroke="#000"
                strokeWidth="1.5"
                className="hover:opacity-100 transition-opacity cursor-pointer"
              >
                <title>
                  {getEventLabel(event)}
                  {event.player_name && ` - ${event.player_name}`}
                  {event.event_type && ` - ${event.event_type}`}
                  {event.player_name_2 &&
                    event.player_name_2 !== "NaN" &&
                    ` (to ${event.player_name_2})`}
                  {event.opp_team_name &&
                    ` vs ${cleanTeamName(event.opp_team_name)}`}
                  {event.period && ` - Period ${event.period}`}
                  {event.clock_seconds &&
                    ` - ${Math.floor(event.clock_seconds / 60)}:${(
                      event.clock_seconds % 60
                    )
                      .toString()
                      .padStart(2, "0")}`}
                </title>
              </circle>
            </g>
          ))}
        </svg>
      </div>

      <p className="text-sm text-foreground/60 mt-3">
        Showing {validEvents.length} of {allValidEvents.length} events with
        coordinates
      </p>
    </div>
  );
}
