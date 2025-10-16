"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/alldata", label: "All Data" },
    { href: "/players", label: "Players" },
    { href: "/teams", label: "Teams" },
  ];
  const futureLinks = ["Game Flow"];

  return (
    <header className="bg-neutral-100 border-b-[1px] border-neutral-300 py-4">
      <div className="w-3/4 mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏒</span>
            <span className="text-xl font-bold">Rink Charts</span>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-light pb-[4px] ${
                  pathname === link.href
                    ? "border-b-[1px] text-blue-900 border-blue-900"
                    : "border-b-[1px] border-transparent hover:text-blue-900"
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
        </div>
      </div>
    </header>
  );
}
