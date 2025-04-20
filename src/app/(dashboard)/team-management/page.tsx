"use client";

import { useTeamData } from "@/store/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounceFunction";
import { lazy, Suspense, useEffect, useState } from "react";

// Lazy load the component
const LazyConfirmDelete = lazy(() => import("../components/confirm-delete"));

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
  const { teamsDatas, updateTeam } = useTeamData();

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
   * Add new team
   */
  const addNewTeam = () => {
    const newId = teamsDatas.length
      ? teamsDatas[teamsDatas.length - 1].id + 1
      : 1;
    updateTeam([...teamsDatas, { id: newId, name: `Team ${newId}` }]);
  };

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
                    <Suspense fallback={null}>
                      <LazyConfirmDelete id={team.id} deleteType="team" />
                    </Suspense>

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
              <Button type="button" variant="outline" onClick={addNewTeam}>
                <Badge>{teamsDatas.length}</Badge>
                Add Team
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
