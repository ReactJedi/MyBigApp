"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";



export default function Contacts() {
  const players = useQuery(api.players.get);
  return (
    <div className="p-4">
    <h1 className="text-xl font-bold">Players List</h1>
    {players ? (
      <ul>
        {players.map((player) => (
          <li key={player._id} className="border p-2 my-2">
            {player.name}
          </li>
        ))}
      </ul>
    ) : (
      <p>Loading...</p>
    )}
  </div>
  );
}
