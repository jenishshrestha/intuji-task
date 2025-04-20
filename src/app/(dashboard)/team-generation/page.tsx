"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { useGeneratedTeams, usePlayerData, useTeamData } from "@/store/hooks";
import { Button } from "@/components/ui/button";

export default function TeamGenerationPage() {
  const router = useRouter();

  /**
   * get global states
   */
  const { generateTeam } = useGeneratedTeams();

  const { teamsDatas } = useTeamData();

  const { playersData } = usePlayerData();

  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  /**
   * Generate Teams divided equally based on skills
   * @returns
   */
  const generateBalancedTeams = () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (playersData.length === 0 || teamsDatas.length === 0) {
      setError("You need players and teams to generate.");
      return;
    }

    const sortedPlayers = [...playersData].sort((a, b) => b.skill - a.skill);
    const teamCount = teamsDatas.length;

    const teamMap: Record<string, typeof playersData> = {};
    teamsDatas.forEach((team) => {
      teamMap[team.name] = [];
    });

    sortedPlayers.forEach((player, index) => {
      const teamIndex = index % teamCount;
      const teamName = teamsDatas[teamIndex].name;
      teamMap[teamName].push(player);
    });

    const teamId = nanoid(12);

    generateTeam({
      id: teamId,
      title,
      teams: teamMap,
    });

    router.push(`/team-${teamId}`);
  };

  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h2 className="mb-3">Generate Teams based on skills</h2>

            <div className="flex flex-col items-start gap-4">
              <input
                type="text"
                placeholder="Enter title (e.g., Friday Futsal)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />

              {error && <p className="text-red-500">{error}</p>}

              <Button onClick={generateBalancedTeams}>Generate Teams</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
