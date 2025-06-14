"use client"; // Required for Next.js App Router if using hooks

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand */}
        <Link href="/" className="text-xl font-bold">
          MyApp
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
          <Link href="/players" className="hover:text-gray-300">
            Players
          </Link>
          <Link href="/teams" className="hover:text-gray-300">
            Teams
          </Link>
          <Link href="/contact" className="hover:text-gray-300">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
