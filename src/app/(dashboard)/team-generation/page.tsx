"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { useAddGTMutation } from "@/services/generateTeamApi";
import { useFetchAllPlayersQuery } from "@/services/playersApi";
import { useFetchAllTeamsQuery } from "@/services/teamApi";

export default function TeamGenerationPage() {
  const router = useRouter();

  // local states
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");

  /**
   * Api service
   */
  // fetch players
  const {
    data: allPlayers,
    error: playersError,
    isLoading: isFetchingPlayers,
    isError: isPlayersError,
  } = useFetchAllPlayersQuery();

  // fetch teams
  const {
    data: allTeams,
    error: teamsError,
    isLoading: isFetchingTeams,
    isError: isTeamsError,
  } = useFetchAllTeamsQuery();

  // add generated team distribution
  const [addGT, { isLoading: isAdding }] = useAddGTMutation();

  /**
   * Generate Teams divided equally based on skills
   * Greedy Team Assignment Algorithm
   * - Sort players descending by skill
   * - Initialize empty teams
   * - Assign each player to the team with the current lowest total skill
   * - O(n log n)
   */

  const generateBalancedTeams = async () => {
    setTitleError("");
    if (!title.trim()) {
      setTitleError("Please enter a title");
      return;
    }

    if (!allPlayers?.length || !allTeams?.length) {
      setTitleError("You need players and teams to generate.");
      return;
    }

    // step 1 - Sort players from highest skill to lowest
    const sortedPlayers = [...allPlayers].sort((a, b) => b.skill - a.skill);

    // Step 2 - Initialize empty teams
    const teamMap: Record<string, typeof allPlayers> = {};
    const teamSkillTotals: Record<string, number> = {};

    allTeams.forEach((team) => {
      teamMap[team.name] = [];
      teamSkillTotals[team.name] = 0;
    });

    // Step 3 - Assign players to the team with the lowest current total skill
    for (const player of sortedPlayers) {
      const targetTeam = Object.entries(teamSkillTotals).sort(
        (a, b) => a[1] - b[1],
      )[0][0];
      teamMap[targetTeam].push(player);
      teamSkillTotals[targetTeam] += player.skill;
    }

    // update database
    const teamSlug = nanoid(12);

    try {
      await addGT({
        title: title,
        slug: teamSlug,
        teams: teamMap,
      }).unwrap();

      router.push(`/team-${teamSlug}`);
    } catch (error) {
      console.error("Failed to add player:", error);
    }
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

              {/* Error handling */}
              {isPlayersError && (
                <p className="text-red-500">
                  Failed to load players:{" "}
                  {(playersError as RTKQueryError)?.message}
                </p>
              )}
              {isTeamsError && (
                <p className="text-red-500">
                  Failed to load teams: {(teamsError as RTKQueryError)?.message}
                </p>
              )}

              {titleError && <p className="text-red-500">{titleError}</p>}

              {/* Loading state */}
              {isFetchingPlayers || isFetchingTeams ? (
                <p className="text-gray-500">Retrieving players and teams...</p>
              ) : (
                <Button onClick={generateBalancedTeams} disabled={isAdding}>
                  {isAdding ? "Generating..." : "Generate Teams"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type RTKQueryError = {
  status?: number | string;
  data?: {
    message?: string;
  };
  message?: string;
};
