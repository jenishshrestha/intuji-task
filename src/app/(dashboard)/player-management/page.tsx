"use client";

import { usePlayerData } from "@/store/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounceFunction";
import { useEffect, useState } from "react";
import ConfirmDelete from "../components/confirm-delete";

import {
  useAddPlayerMutation,
  useUpsertPlayersMutation,
  useFetchAllPlayersQuery,
  useRemovePlayerDbMutation,
} from "@/services/playersApi";

export default function Page() {
  const { playersData, removePlayer, updatePlayer } = usePlayerData();

  /**
   * Handling input field for name
   */
  const [localNames, setLocalNames] = useState<Record<number, string>>({});

  // Keep local names in sync with playersData
  useEffect(() => {
    const names: Record<number, string> = {};
    playersData.forEach((player) => {
      names[player.id] = player.name;
    });
    setLocalNames(names);

    console.log("playersData", playersData);
  }, [playersData]);

  // Debounced version of the update function
  const debouncedUpdate = useDebounce(
    ((id: number, value: string) => {
      const newPlayerDatas = playersData.map((p) =>
        p.id === id ? { ...p, name: value } : p,
      );
      updatePlayer(newPlayerDatas);
    }) as (...args: unknown[]) => void,
    500,
  );

  // Handler for name input change
  const handleNameChange = (id: number, value: string) => {
    setLocalNames((prev) => ({ ...prev, [id]: value }));
    debouncedUpdate(id, value);
  };

  /**
   * update skill of player in playersData state
   * @param id
   * @param skill
   */
  const updateSkill = (id: number, skill: number) => {
    const newPlayerDatas = playersData.map((p) =>
      p.id === id ? { ...p, skill } : p,
    );
    updatePlayer(newPlayerDatas);
  };

  /**
   * api service for player
   */
  const [upsertPlayers, { isLoading: isUpserting }] =
    useUpsertPlayersMutation();

  // add player
  const [addPlayer, { isLoading: isAdding }] = useAddPlayerMutation();

  // remove player
  const [removePlayerDb, { isLoading: isRemoving }] =
    useRemovePlayerDbMutation();

  const {
    data: allPlayers,
    error,
    isLoading: isFetching,
    isError,
  } = useFetchAllPlayersQuery();

  // update state
  useEffect(() => {
    if (allPlayers) {
      updatePlayer(allPlayers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPlayers]);

  // submit players to supabase
  const submitPlayers = async () => {
    try {
      // Filter out invalid/empty players if needed
      const validPlayers = playersData.filter(
        (p) => p.name.trim() && p.skill > 0,
      );
      console.log("valid:", validPlayers);

      const updatedPlayers = await upsertPlayers(validPlayers).unwrap();
      updatePlayer(updatedPlayers);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  // add new player
  const addNewPlayerToDB = async () => {
    try {
      const addedNewPlayer = await addPlayer({
        name: `New Player Name`,
        skill: 1,
      }).unwrap();

      // change local state
      updatePlayer([...playersData, addedNewPlayer]);
    } catch (error) {
      console.error("Failed to add player:", error);
    }
  };

  // remove player
  const removePlayerFromDB = async (id: number) => {
    try {
      const removedId = await removePlayerDb(id).unwrap();

      // change local state
      removePlayer(removedId.id);
    } catch (error) {
      console.error("Failed to add player:", error);
    }
  };

  if (isFetching) return <p>Loading...</p>;

  if (isError) return <p>Error: {String(error)}</p>;

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h2 className="mb-3">Players</h2>
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col gap-3">
              {playersData.map((player) => (
                <div key={player.id} className="flex items-center gap-2">
                  {/* Remove Button */}
                  <ConfirmDelete
                    id={player.id}
                    deleteFn={removePlayerFromDB}
                    loading={isRemoving}
                  />

                  {/* Name of the players */}
                  <input
                    type="text"
                    placeholder={`Player ${player.id}`}
                    value={localNames[player.id] ?? ""}
                    onChange={(e) =>
                      handleNameChange(player.id, e.target.value)
                    }
                    className="flex-1 rounded border px-2 py-1"
                  />

                  {/* rating field */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => updateSkill(player.id, num)}
                        className={`h-8 w-8 rounded border text-sm ${
                          player.skill >= num
                            ? "bg-orange-600 text-white"
                            : "bg-white"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={addNewPlayerToDB}
                variant="outline"
                disabled={isAdding || isUpserting}
              >
                <Badge>{playersData.length}</Badge>
                {isAdding ? "Adding..." : "Add Participant"}
              </Button>
              <Button
                type="button"
                onClick={submitPlayers}
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
