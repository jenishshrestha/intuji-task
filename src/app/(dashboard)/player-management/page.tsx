"use client";
import { usePlayerData } from "@/app/store/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounceFunction";
import { useEffect, useState } from "react";

export default function Page() {
  const { playersData, removePlayer, updatePlayer } = usePlayerData();

  // Local state for name inputs
  const [localNames, setLocalNames] = useState<Record<number, string>>({});

  // Keep local names in sync with playersData
  useEffect(() => {
    const names: Record<number, string> = {};
    playersData.forEach((player) => {
      names[player.id] = player.name;
    });
    setLocalNames(names);
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
  ); // adjust delay as needed

  // Handler for name input change
  const handleNameChange = (id: number, value: string) => {
    setLocalNames((prev) => ({ ...prev, [id]: value }));
    debouncedUpdate(id, value);
  };

  // update skill
  const updateSkill = (id: number, skill: number) => {
    const newPlayerDatas = playersData.map((p) =>
      p.id === id ? { ...p, skill } : p,
    );
    updatePlayer(newPlayerDatas);
  };

  // add new player
  const addNewPlayer = () => {
    const newId = playersData.length
      ? playersData[playersData.length - 1].id + 1
      : 1;
    updatePlayer([
      ...playersData,
      { id: newId, name: `Player ${newId}`, skill: 0 },
    ]);
  };

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h2 className="mb-3">Players</h2>
          <div className="flex flex-col items-start gap-4">
            <div className="flex w-full flex-col gap-3">
              {playersData.map((player) => (
                <div key={player.id} className="flex items-center gap-2">
                  {/* Remove Button */}
                  <Button
                    variant="outline"
                    onClick={() => removePlayer(player.id)}
                    className=""
                  >
                    ×
                  </Button>

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
              <Button type="submit" onClick={addNewPlayer} variant="outline">
                <Badge>{playersData.length}</Badge>
                Add Participant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
