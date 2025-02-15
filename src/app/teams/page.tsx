"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";



export default function Contacts() {
  const teams = useQuery(api.teams.get);
  return (
    <div className="p-4">
    <h1 className="text-xl font-bold">Teams List</h1>
    {teams ? (
      <ul>
        {teams.map((teams) => (
          <li key={teams._id} className="border p-2 my-2">
            {teams.name}
          </li>
        ))}
      </ul>
    ) : (
      <p>Loading...</p>
    )}
  </div>
  );
}
