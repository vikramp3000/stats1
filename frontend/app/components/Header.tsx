"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/alldata", label: "All Data" },
    { href: "/players", label: "Players" }, // NEW
  ];
  const futureLinks = ["Teams", "Analytics"];

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition"
          >
            <span className="text-2xl">🏒</span>
            <span className="text-xl font-bold">NHL Stats</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition font-medium ${
                  pathname === link.href
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "hover:text-blue-400"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Future links (disabled) */}
            {futureLinks.map((label) => (
              <span
                key={label}
                className="text-gray-500 cursor-not-allowed"
                title="Coming soon"
              >
                {label}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
