"use client";
import React, { useEffect } from "react";

import { useParams } from "next/navigation";
import { useGeneratedTeams } from "@/store/hooks";
import Link from "next/link";

const Page = () => {
  const { id } = useParams() as { id: string };

  const { generatedTeamsDatas } = useGeneratedTeams();

  const teamSet = generatedTeamsDatas?.[id];
  const isTeamSetValid = teamSet && typeof teamSet === "object";
  const teamCount = isTeamSetValid ? Object.keys(teamSet.teams).length : 0;

  const playersCount = isTeamSetValid
    ? Object.values(teamSet.teams).flat().length
    : 0;

  useEffect(() => {
    console.log(generatedTeamsDatas);
  }, [generatedTeamsDatas]);

  return (
    <>
      <header className="bg-muted flex flex-col border-b-2 p-4">
        {/* Main heading with navigation link */}
        <h1 className="text-lg font-medium">
          <Link
            href="/"
            className="logo focus:ring-primary rounded font-bold focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-label="Title of the event"
          >
            {typeof teamSet === "object" && teamSet?.title
              ? teamSet.title
              : "Generated Team"}
          </Link>
        </h1>
        <p className="text-sm">
          {playersCount} participants in {teamCount} teams.
        </p>
      </header>

      {/* share link display */}

      {/* team display */}
      <div className="bg-background grid grid-cols-2 gap-10 p-6">
        {Object.entries(teamSet.teams).map(([teamName, players]) => {
          return (
            <div key={teamName}>
              <h2>{teamName}</h2>
              <ul className="flex flex-col gap-2">
                {players.map((player, index) => (
                  <li key={player.id} className="flex">
                    {/* index */}
                    <span className="flex h-10 w-10 items-center justify-center border-t border-b border-l">
                      {index + 1}
                    </span>

                    {/* player name */}
                    <div className="flex h-10 flex-grow items-center border px-4 py-1">
                      {player.name}
                    </div>

                    {/* player skill */}
                    <div className="ml-4 flex h-10 w-10 shrink-0 grow-0 items-center justify-center bg-orange-600 text-lg text-white">
                      {player.skill}
                    </div>
                  </li>
                ))}
                <li>
                  <div className="ml-4 flex h-10 w-10 shrink-0 grow-0 items-center justify-center bg-orange-600 text-lg text-white">
                    {players.reduce(
                      (sum: number, p: { skill: number }) => sum + p.skill,
                      0,
                    )}
                  </div>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Page;
