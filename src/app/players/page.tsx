"use client";

import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { useState, useRef } from "react";
import Image from "next/image";

export default function PlayersPage() {
  const players = useQuery(api.players.get, {});
  const teams = useQuery(api.teams.get);
  const teamGroups = teams
  ? teams.reduce((acc, team) => {
      if (!acc[team.name]) {
        acc[team.name] = { count: 0 };
      }
      acc[team.name].count += 1;
      return acc;
    }, {} as Record<string, { count: number }>)
  : {};
  const addPlayer = useMutation(api.players.create);
  const addTeam = useMutation(api.teams.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [showTeamForm, setShowTeamForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  // Add new team
  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    try {
      await addTeam({ name: newTeamName });
      setNewTeamName("");
      setShowTeamForm(false);
    } catch (error) {
      console.error("Failed to create team:", error);
      alert("Team creation failed. Please try again.");
    }
  };

  // Add new player
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const playerName = formData.get("playerName") as string;
    const birthday = formData.get("birthday") as string;
    const teamId = formData.get("teamId") as string;

    let photoId;
    if (selectedFile) {
      try {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });
        const { storageId } = await result.json();
        photoId = storageId;
      } catch (error) {
        console.error("File upload failed:", error);
        return;
      }
    }

    try {
      await addPlayer({ 
        name: playerName,
        birthday,
        teamId: teamId as Id<"teams">, // <-- Cast here
        photo: photoId,
        userId: "currentUserId", // Replace with actual user ID logic
      });
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (error) {
      console.error("Failed to add player:", error);
      alert("Player creation failed. Please check your inputs.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Players Management</h1>

          <div>
            <h2>Teams</h2>
            <div className="space-y-2">
              {Object.entries(teamGroups).map(([name, { count }]) => (
                <div
                  key={name}
                  className="bg-blue-50 p-3 rounded-lg flex justify-between items-center border border-blue-100"
                >
                  <span className="font-medium">{name}</span>
                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                    {count} {count === 1 ? "player" : "players"}
                  </span>
                </div>
              ))}
            </div>
          </div>

        {/* Players List */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Players List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players?.map((player) => (
              <div
                key={player._id}
                className="bg-green-50 p-4 rounded-lg border border-green-100"
              >
                {player.photoUrl && (
                  <Image
                    src={player.photoUrl}
                    alt={player.name}
                    width={100}
                    height={100}
                    className="rounded-full mb-2 object-cover"
                    loader={({ src }) => src}
                    unoptimized // Add this to bypass Image Optimization
                  />
                )}
                <p className="font-medium text-center">{player.name}</p>
                <p className="text-sm text-gray-600 text-center">
                  🎂 {new Date(player.birthday).toLocaleDateString()}
                </p>
                {teams && (
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Team: {teams.find(t => t._id === player.teamId)?.name || "Unknown"}
                  </p>
                )}
              </div>
            ))}
          </div>
          {players?.length === 0 && (
            <p className="text-gray-600 text-center py-4">No players found</p>
          )}
        </div>

        {/* Add Player Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              {previewUrl && (
                <div className="mx-auto mb-4">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="rounded-full object-cover w-16 h-16"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            <input
              type="text"
              name="playerName"
              placeholder="Player name"
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
              required
              minLength={2}
            />

            <input
              type="date"
              name="birthday"
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
              required
            />

            <select
              name="teamId"
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
              required
            >
              <option value="">Select a team</option>
              {teams?.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-colors font-semibold"
            >
              Add Player
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}