"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useRef } from "react";
import Image from "next/image";

export default function PlayersPage() {
  const players = useQuery(api.players.get);
  const teams = useQuery(api.teams.get);
  const addPlayer = useMutation(api.players.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const playerName = formData.get("playerName") as string;
    const birthday = formData.get("birthday") as string;
    const teamId = formData.get("teamId") as string;

    let photoId;
    if (selectedFile) {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      const { storageId } = await result.json();
      photoId = storageId;
    }

    try {
      await addPlayer({ 
        name: playerName,
        birthday,
        teamId,
        photo: photoId 
      });
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Players</h1>

        {/* Players List */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Players List</h2>
          {players?.map((player) => (
            <div
              key={player._id}
              className="bg-green-100 p-4 rounded-lg mb-4"
            >
              {player.photoUrl && (
                <Image
                  src={player.photoUrl}
                  alt={player.name}
                  width={100}
                  height={100}
                  className="rounded-full mb-2 object-cover"
                  loader={({ src }) => src}
                />
              )}
              <p className="font-medium">{player.name}</p>
              <p className="text-sm text-gray-600">🎂 {player.birthday}</p>
            </div>
          ))}
        </div>

        {/* Add Player Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add a Player</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              {previewUrl && (
                <div className="mx-auto mb-4">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="rounded-full object-cover w-20 h-20"
                    loader={({ src }) => src}
                  />
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="border p-3 rounded-lg w-full"
              />
            </div>

            <input
              type="text"
              name="playerName"
              placeholder="Player name"
              className="border p-3 rounded-lg w-full"
              required
            />

            <input
              type="date"
              name="birthday"
              className="border p-3 rounded-lg w-full"
              required
            />

            <select
              name="teamId"
              className="border p-3 rounded-lg w-full"
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
            >
              Add Player
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}