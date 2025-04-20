import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "@/lib/supabaseClient";
import { DataTypes } from "@/store/player-management/pmSlice";

export const playersApi = createApi({
  reducerPath: "playersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Player"],
  endpoints: (builder) => ({
    // bulk update
    upsertPlayers: builder.mutation<DataTypes[], DataTypes[]>({
      async queryFn(players) {
        try {
          const { data, error } = await supabase
            .from("players")
            .upsert(players, { onConflict: "id" })
            .select();

          if (error) {
            return { error: { message: error.message } };
          }

          return { data: data ?? [] };
        } catch (err) {
          return {
            error: {
              message: err instanceof Error ? err.message : "Unknown error",
            },
          };
        }
      },
      invalidatesTags: ["Player"], // Refreshes all player data
    }),

    // fetching all players
    fetchAllPlayers: builder.query<DataTypes[], void>({
      async queryFn() {
        const { data, error } = await supabase
          .from("players")
          .select("*")
          .order("created_at", { ascending: true });

        return error ? { error } : { data };
      },
    }),

    // add a single player
    addPlayer: builder.mutation<DataTypes, { name: string; skill: number }>({
      async queryFn(player) {
        const { data, error } = await supabase
          .from("players")
          .insert(player)
          .select("id, name, skill")
          .single();

        if (error) {
          return { error };
        }

        if (!data) {
          return {
            error: {
              message: "No data returned after insert",
            },
          };
        }

        return { data };
      },
    }),

    // remove a single player
    removePlayerDb: builder.mutation<{ id: number }, number>({
      async queryFn(playerId) {
        const { error } = await supabase
          .from("players")
          .delete()
          .eq("id", playerId);

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return { data: { id: playerId } };
      },
      invalidatesTags: ["Player"],
    }),
  }),
});

// Export the auto-generated hook for the `addPlayer` mutation
export const {
  useUpsertPlayersMutation,
  useFetchAllPlayersQuery,
  useAddPlayerMutation,
  useRemovePlayerDbMutation,
} = playersApi;
