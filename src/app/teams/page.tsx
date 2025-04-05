"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Id } from "convex/values";

const formSchema = z.object({
  teamname: z.string().min(2, "Team name must be at least 2 characters"),
});

export default function TeamsPage() {
  const teams = useQuery(api.teams.get);
  const addTeam = useMutation(api.teams.create);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { teamname: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addTeam({ name: values.teamname });
    form.reset();
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Teams</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Teams List</h2>
          {teams ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <li
                  key={team._id}
                  className="bg-blue-100 p-4 rounded-lg border border-gray-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{team.name}</span>
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {team.playerCount} {team.playerCount === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <PlayersList teamId={team._id} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">Loading teams...</p>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input
              placeholder="Team name"
              {...form.register("teamname")}
              className="text-lg p-3"
            />
            {form.formState.errors.teamname && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.teamname.message}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
            >
              Add Team
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PlayersList({ teamId }: { teamId: string }) {
  // Add proper type assertion for teamId
  const players = useQuery(api.players.get, { teamId: teamId as Id<"teams"> });

  if (!players) return <p className="text-gray-500 text-sm">Loading players...</p>;
  if (players.length === 0) return <p className="text-gray-500 text-sm">No players yet</p>;

  return (
    <ul className="space-y-1">
      {players.map((player) => (
        <li key={player._id} className="text-sm text-gray-700">
          {player.name} (🎂 {player.birthday})
        </li>
      ))}
    </ul>
  );
}