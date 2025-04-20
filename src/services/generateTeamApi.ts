import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "@/lib/supabaseClient";
import { GeneratedTeamSet } from "@/store/team-generation/generatedTeamsSlice";

const dbTable = "generated_teams";

export const generatedTeamsApi = createApi({
  reducerPath: "generatedTeamsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["GeneratedTeam"],
  endpoints: (builder) => ({
    // add generate team
    addGT: builder.mutation<
      Pick<GeneratedTeamSet, "title" | "slug">,
      GeneratedTeamSet
    >({
      async queryFn(team) {
        const { data, error } = await supabase
          .from(dbTable)
          .insert(team)
          .select("id, title, slug")
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
      invalidatesTags: ["GeneratedTeam"],
    }),

    // retrieve GT  by slug value
    fetchTeamBySlug: builder.query<GeneratedTeamSet | null, string>({
      async queryFn(slug) {
        try {
          const { data, error } = await supabase
            .from(dbTable)
            .select("*")
            .eq("slug", slug)
            .single();
          if (error) {
            return { error: { message: error.message } };
          }

          return { data: data || null };
        } catch (err) {
          return {
            error: {
              message: err instanceof Error ? err.message : "Unknown error",
            },
          };
        }
      },
      providesTags: (result, error, slug) =>
        result ? [{ type: "GeneratedTeam", id: slug }] : ["GeneratedTeam"],
    }),
  }),
});

// Export the auto-generated hook for the `addPlayer` mutation
export const { useAddGTMutation, useFetchTeamBySlugQuery } = generatedTeamsApi;
