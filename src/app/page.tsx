"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "convex/react";
import { v } from "convex/values";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const router = useRouter();
  const createTeamPlayer = useMutation(api.teamsPlayers.createTeamAndPlayer);

  const [form, setForm] = useState({
    teamName: "",
    playerName: "",
    playerBirthday: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createTeamPlayer({
        teamName: form.teamName,
        playerName: form.playerName,
        playerBirthday: form.playerBirthday,
      });
      router.push("/players"); // Redirect after creation
      setSuccess("Team and player created!");
      setForm({ teamName: "", playerName: "", playerBirthday: "" });
    } catch (err: any) {
      setError(err.message || "Failed to create team and player.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Sign Up: Create Team & Player</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-4"
      >
        <Input
          name="teamName"
          placeholder="Team Name"
          value={form.teamName}
          onChange={handleChange}
          required
          minLength={2}
        />
        <Input
          name="playerName"
          placeholder="Player Name"
          value={form.playerName}
          onChange={handleChange}
          required
          minLength={2}
        />
        <Input
          name="playerBirthday"
          type="date"
          placeholder="Birthday"
          value={form.playerBirthday}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Sign Up"}
        </Button>
        {success && <div className="text-green-600 text-center">{success}</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}
      </form>
    </div>
  );
}