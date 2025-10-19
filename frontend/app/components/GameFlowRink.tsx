"use client";

import { useState, useMemo } from "react";
import { PlayByPlayEvent } from "@/lib/types";
import { cleanTeamName } from "@/lib/utils";

interface GameFlowRinkProps {
  events: PlayByPlayEvent[];
  homeTeam: string;
  awayTeam: string;
}

export default function GameFlowRink({
  events,
  homeTeam,
  awayTeam,
}: GameFlowRinkProps) {
  // Filter events that have coordinates (shots and plays)
  const eventsWithCoords = useMemo(
    () =>
      events.filter(
        (e) =>
          e.x_coord && e.y_coord && (e.event === "Shot" || e.event === "Play")
      ),
    [events]
  );

  // State for the slider - shows events up to this index
  const [currentEventIndex, setCurrentEventIndex] = useState(
    eventsWithCoords.length - 1
  ); // Start at the end (all events)

  // Get events up to current index
  const visibleEvents = eventsWithCoords.slice(0, currentEventIndex + 1);
  const currentEvent = eventsWithCoords[currentEventIndex];

  // Rink dimensions
  const scale = 3;
  const width = 200 * scale; // 600px
  const height = 85 * scale; // 255px

  // Helper function to flip coordinates for away team
  const getDisplayCoords = (event: PlayByPlayEvent) => {
    const x = event.x_coord!;
    const y = event.y_coord!;

    // If away team, flip x-coordinate so they attack the left side
    if (event.team_name === awayTeam) {
      return {
        x: 200 - x,
        y: y,
      };
    }

    // Home team attacks right side (no flip)
    return { x, y };
  };

  // Helper for secondary coordinates (for passes)
  const getDisplayCoords2 = (event: PlayByPlayEvent) => {
    if (!event.x_coord_2 || !event.y_coord_2) return null;

    const x2 = event.x_coord_2;
    const y2 = event.y_coord_2;

    // If away team, flip x-coordinate
    if (event.team_name === awayTeam) {
      return {
        x: 200 - x2,
        y: y2,
      };
    }

    return { x: x2, y: y2 };
  };

  const getEventColor = (event: PlayByPlayEvent) => {
    if (event.event === "Shot" && event.event_successful) {
      return "#ef4444"; // Red - Goal
    }
    if (event.event === "Shot") {
      return "#3b82f6"; // Blue - Shot
    }
    if (event.event === "Play") {
      return "#10b981"; // Green - Pass
    }
    return "#6b7280"; // Gray
  };

  const getEventLabel = (event: PlayByPlayEvent) => {
    if (event.event === "Shot" && event.event_successful) return "🥅 Goal";
    if (event.event === "Shot") return "🏒 Shot";
    if (event.event === "Play") return "🎯 Pass";
    return event.event;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Count stats up to current event
  const stats = useMemo(() => {
    const goals = visibleEvents.filter(
      (e) => e.event === "Shot" && e.event_successful
    ).length;
    const shots = visibleEvents.filter(
      (e) => e.event === "Shot" && !e.event_successful
    ).length;
    const passes = visibleEvents.filter((e) => e.event === "Play").length;
    return { goals, shots, passes };
  }, [visibleEvents]);

  return (
    <div className="border-[3px] border-neutral-800 rounded-sm p-6 bg-neutral-300">
      <h3 className="text-2xl font-bold mb-4">Game Flow - Interactive Rink</h3>

      {/* Current Event Info */}
      {currentEvent && (
        <div className="mb-4 p-4 bg-neutral-100 border-[3px] border-neutral-800 rounded-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-bold">
                {getEventLabel(currentEvent)}{" "}
                {currentEvent.player_name && `- ${currentEvent.player_name}`}
              </p>
              <p className="text-sm text-foreground/70">
                Period {currentEvent.period} •{" "}
                {formatTime(currentEvent.clock_seconds)} •{" "}
                {cleanTeamName(currentEvent.team_name)}
                {currentEvent.event_type && ` • ${currentEvent.event_type}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {currentEvent.goals_for} - {currentEvent.goals_against}
              </p>
              <p className="text-xs text-foreground/60">Score</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Display */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-red-200 border-[3px] border-neutral-800 rounded-sm p-3 text-center">
          <p className="text-2xl font-bold">{stats.goals}</p>
          <p className="text-sm">🥅 Goals</p>
        </div>
        <div className="flex-1 bg-blue-200 border-[3px] border-neutral-800 rounded-sm p-3 text-center">
          <p className="text-2xl font-bold">{stats.shots}</p>
          <p className="text-sm">🏒 Shots</p>
        </div>
        <div className="flex-1 bg-green-200 border-[3px] border-neutral-800 rounded-sm p-3 text-center">
          <p className="text-2xl font-bold">{stats.passes}</p>
          <p className="text-sm">🎯 Passes</p>
        </div>
      </div>

      {/* SVG Rink */}
      <div
        className="border-[3px] border-neutral-800 rounded-sm overflow-hidden bg-neutral-100 flex justify-center items-center"
        style={{ minHeight: "450px" }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{
            maxWidth: "800px",
            // transform: "rotate(-90deg)",
            // transformOrigin: "center center",
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

          {/* Pass Lines - for visible events only */}
          {visibleEvents
            .filter(
              (event) =>
                event.event === "Play" && event.x_coord_2 && event.y_coord_2
            )
            .map((event, index) => {
              const coords1 = getDisplayCoords(event);
              const coords2 = getDisplayCoords2(event);

              if (!coords2) return null;

              return (
                <g key={`pass-${index}`}>
                  <line
                    x1={coords1.x * scale}
                    y1={coords1.y * scale}
                    x2={coords2.x * scale}
                    y2={coords2.y * scale}
                    stroke="#10b981"
                    strokeWidth="2"
                    opacity="0.4"
                    strokeDasharray="5,5"
                  />
                  <circle
                    cx={coords2.x * scale}
                    cy={coords2.y * scale}
                    r="3"
                    fill="#10b981"
                    opacity="0.6"
                  />
                </g>
              );
            })}

          {/* Event dots - visible events */}
          {visibleEvents.map((event, index) => {
            const coords = getDisplayCoords(event);
            const isCurrentEvent = index === currentEventIndex;

            return (
              <g key={index}>
                <circle
                  cx={coords.x * scale}
                  cy={coords.y * scale}
                  r={isCurrentEvent ? 10 : 6}
                  fill={getEventColor(event)}
                  opacity={isCurrentEvent ? 1 : 0.7}
                  stroke={isCurrentEvent ? "#000" : "#000"}
                  strokeWidth={isCurrentEvent ? 3 : 1.5}
                  className="transition-all"
                >
                  <title>
                    {getEventLabel(event)}
                    {event.player_name && ` - ${event.player_name}`}
                    {event.event_type && ` - ${event.event_type}`}
                    {` - Period ${event.period}`}
                    {` - ${formatTime(event.clock_seconds)}`}
                  </title>
                </circle>
                {/* Pulse animation for current event */}
                {isCurrentEvent && (
                  <circle
                    cx={coords.x * scale}
                    cy={coords.y * scale}
                    r="10"
                    fill="none"
                    stroke={getEventColor(event)}
                    strokeWidth="2"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from="10"
                      to="20"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Slider Controls */}
      <div className="mt-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setCurrentEventIndex(Math.max(0, currentEventIndex - 1))
            }
            disabled={currentEventIndex === 0}
            className="px-4 py-2 bg-neutral-200 border-[3px] border-neutral-800 rounded-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-300"
          >
            ← Prev
          </button>

          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={eventsWithCoords.length - 1}
              value={currentEventIndex}
              onChange={(e) => setCurrentEventIndex(Number(e.target.value))}
              className="w-full h-3 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-800"
            />
            <div className="flex justify-between text-xs text-foreground/60 mt-1">
              <span>Start</span>
              <span>
                Event {currentEventIndex + 1} of {eventsWithCoords.length}
              </span>
              <span>End</span>
            </div>
          </div>

          <button
            onClick={() =>
              setCurrentEventIndex(
                Math.min(eventsWithCoords.length - 1, currentEventIndex + 1)
              )
            }
            disabled={currentEventIndex === eventsWithCoords.length - 1}
            className="px-4 py-2 bg-neutral-200 border-[3px] border-neutral-800 rounded-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-300"
          >
            Next →
          </button>
        </div>
      </div>

      <p className="text-sm text-foreground/60 mt-3 text-center">
        Use the slider to replay the game event by event •{" "}
        {cleanTeamName(homeTeam)} attacks right →, {cleanTeamName(awayTeam)}{" "}
        attacks ← left
      </p>
    </div>
  );
}
