import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "@/lib/supabaseClient";
import { TMTypes } from "@/store/team-management/tmSlice";

const dbTable = "teams";

export const teamsApi = createApi({
  reducerPath: "teamsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Team"],
  endpoints: (builder) => ({
    // add a single team
    addTeamDb: builder.mutation<TMTypes, { name: string }>({
      async queryFn(team) {
        const { data, error } = await supabase
          .from(dbTable)
          .insert(team)
          .select("id, name")
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

    // remove team from db
    removeTeamDb: builder.mutation<{ id: number }, number>({
      async queryFn(teamId) {
        const { error } = await supabase
          .from(dbTable)
          .delete()
          .eq("id", teamId);

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return { data: { id: teamId } };
      },
      invalidatesTags: ["Team"],
    }),

    // fetch all team from db
    fetchAllTeams: builder.query<TMTypes[], void>({
      async queryFn() {
        const { data, error } = await supabase
          .from(dbTable)
          .select("*")
          .order("created_at", { ascending: true });

        return error ? { error } : { data };
      },
    }),

    // bulk update
    upsertTeams: builder.mutation<TMTypes[], TMTypes[]>({
      async queryFn(players) {
        try {
          const { data, error } = await supabase
            .from(dbTable)
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
      invalidatesTags: ["Team"],
    }),
  }),
});

// Export the auto-generated hook for the `addPlayer` mutation
export const {
  useAddTeamDbMutation,
  useRemoveTeamDbMutation,
  useFetchAllTeamsQuery,
  useUpsertTeamsMutation,
} = teamsApi;
