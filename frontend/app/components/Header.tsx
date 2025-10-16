"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/alldata", label: "All Data" },
    { href: "/players", label: "Players" },
  ];
  const futureLinks = ["Teams", "Game Flow"];

  return (
    <header className="bg-secondary-background border-b-[4px]">
      <div className="w-3/4 mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo/Brand */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition"
          >
            <span className="text-2xl">🏒</span>
            <span className="text-xl font-bold text-foreground">
              Rink Charts
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition font-base pb-[4px] ${
                  pathname === link.href
                    ? "text-main border-b-[3px] border-main"
                    : "text-foreground hover:text-main"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Future links (disabled) */}
            {futureLinks.map((label) => (
              <span
                key={label}
                className="text-foreground/40 cursor-not-allowed"
                title="Coming soon"
              >
                {label}
              </span>
            ))}
          </nav>

          {/* Right: Dark Mode Toggle */}
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
