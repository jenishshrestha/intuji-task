"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useFetchTeamBySlugQuery } from "@/services/generateTeamApi";
import { Card } from "@/components/ui/card";

import { Clipboard } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

const Page = () => {
  const pathname = usePathname();
  const { slug } = useParams() as { slug: string };

  const { copied, copyToClipboard } = useCopyToClipboard();
  const textToCopy = window.location.origin + pathname;

  /**
   * Fetching data
   */
  const { data, error, isLoading, isError } = useFetchTeamBySlugQuery(slug);

  const teams = data?.teams ?? {};

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    if (error instanceof Error) {
      return <p>Error: {error.message}</p>;
    } else {
      return "Error";
    }
  }

  return (
    <>
      <header className="bg-foreground text text-card flex flex-col border-b-2 p-4">
        {/* Main heading with navigation link */}
        <h1 className="text-lg font-medium">
          <Link
            href="/"
            className="logo focus:ring-primary rounded font-bold focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-label="Title of the event"
          >
            {data ? data.title : "Generated Team"}
          </Link>
        </h1>
        <p className="text-sm">
          {Object.values(teams).flat().length} participants in{" "}
          {Object.keys(teams).length} teams.
        </p>
      </header>

      {/* share link display */}
      <div className="container mx-auto p-6">
        <label>Share Link (Public Draw)</label>
        <div className="flex justify-start">
          <div className="flex h-10 items-center border px-4 py-1">
            {textToCopy}
          </div>
          <div className="relative flex h-10 w-10 shrink-0 grow-0 items-center justify-center border-t border-r border-b text-lg">
            <Clipboard onClick={() => copyToClipboard(textToCopy)} />
            <span
              className={`absolute top-full text-xs ${copied ? "" : "hidden"}`}
            >
              Copied!
            </span>
          </div>
        </div>
      </div>

      {/* team display */}
      <div className="bg-muted p-6">
        <div className="container mx-auto grid grid-cols-2 gap-10">
          {Object.entries(teams).map(([teamName, players]) => {
            return (
              <div key={teamName}>
                <h2 className="mb-3">{teamName}</h2>
                <Card className="p-6">
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
                    <li className="flex justify-end">
                      <div className="ml-4 flex h-10 w-10 shrink-0 grow-0 items-center justify-center bg-transparent text-lg text-[#878787]">
                        {players.reduce(
                          (sum: number, p: { skill: number }) => sum + p.skill,
                          0,
                        )}
                      </div>
                    </li>
                  </ul>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Page;
