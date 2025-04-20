"use client";

import { useTeamData } from "@/store/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounceFunction";
import { useEffect, useState } from "react";
import {
  useAddTeamDbMutation,
  useRemoveTeamDbMutation,
  useFetchAllTeamsQuery,
  useUpsertTeamsMutation,
} from "@/services/teamApi";

import ConfirmDelete from "../components/confirm-delete";

/**
 * =================================================
 * Main COmponent
 * @returns
 * =================================================
 */
export default function Page() {
  /**
   * Hook to access store
   */
  const { teamsDatas, updateTeam, removeTeam } = useTeamData();

  /**
   * Handle input field value
   */
  const [localNames, setLocalNames] = useState<Record<number, string>>({});

  // Keep local names in sync with playersData
  useEffect(() => {
    const names: Record<number, string> = {};
    teamsDatas.forEach((team) => {
      names[team.id] = team.name;
    });
    setLocalNames(names);
    console.log(teamsDatas);
  }, [teamsDatas]);

  // Debounced version of the update function
  const debouncedUpdate = useDebounce(
    ((id: number, value: string) => {
      const newTeamDatas = teamsDatas.map((p) =>
        p.id === id ? { ...p, name: value } : p,
      );
      updateTeam(newTeamDatas);
    }) as (...args: unknown[]) => void,
    500,
  );

  // Handler for name input change
  const handleNameChange = (id: number, value: string) => {
    setLocalNames((prev) => ({ ...prev, [id]: value }));
    debouncedUpdate(id, value);
  };

  /**
   * api service for team
   */
  const [removeTeamDb, { isLoading: isRemoving }] = useRemoveTeamDbMutation();

  const [addTeamDb, { isLoading: isAdding }] = useAddTeamDbMutation();

  const [upsertTeams, { isLoading: isUpserting }] = useUpsertTeamsMutation();

  const {
    data: allTeams,
    error,
    isLoading: isFetching,
    isError,
  } = useFetchAllTeamsQuery();

  // update global state after fetching
  useEffect(() => {
    if (allTeams) {
      updateTeam(allTeams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTeams]);

  // remove team
  const removeTeamFromDB = async (id: number) => {
    try {
      const removedId = await removeTeamDb(id).unwrap();

      // change local state
      removeTeam(removedId.id);
    } catch (error) {
      console.error("Failed to add player:", error);
    }
  };

  // add team
  const addNewTeamToDB = async () => {
    try {
      const addedNewTeam = await addTeamDb({
        name: `New Team`,
      }).unwrap();

      // change local state
      updateTeam([...teamsDatas, addedNewTeam]);
    } catch (error) {
      console.error("Failed to add player:", error);
    }
  };

  // bulk update
  const submitTeams = async () => {
    try {
      // Filter out invalid/empty players if needed
      const validPlayers = teamsDatas.filter((p) => p.name.trim());
      console.log("valid:", validPlayers);

      const updatedPlayers = await upsertTeams(validPlayers).unwrap();
      updateTeam(updatedPlayers);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  if (isFetching) return <p>Loading...</p>;

  if (isError) return <p>Error: {String(error)}</p>;

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h2 className="mb-3">Teams</h2>
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col gap-3">
              {teamsDatas.map((team) => {
                return (
                  <div key={team.id} className="flex items-center gap-2">
                    {/* Remove Button */}
                    <ConfirmDelete
                      id={team.id}
                      deleteFn={removeTeamFromDB}
                      loading={isRemoving}
                    />

                    {/* Name of the players */}
                    <input
                      type="text"
                      placeholder={`Player ${team.id}`}
                      value={localNames[team.id] ?? ""}
                      onChange={(e) =>
                        handleNameChange(team.id, e.target.value)
                      }
                      className="flex-1 rounded border px-2 py-1"
                    />
                  </div>
                );
              })}
            </div>

            {/* button to add teams */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={addNewTeamToDB}
                disabled={isAdding || isUpserting}
              >
                <Badge>{teamsDatas.length}</Badge>
                {isAdding ? "Adding..." : "Add Team"}
              </Button>
              <Button
                type="submit"
                onClick={submitTeams}
                disabled={isAdding || isUpserting}
              >
                {isUpserting ? "Updating..." : "Update All"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
