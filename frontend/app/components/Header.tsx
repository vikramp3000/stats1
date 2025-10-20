"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Game Flow" },
    { href: "/players", label: "Players" },
    { href: "/teams", label: "Teams" },
  ];

  return (
    <header className="bg-neutral-300 border-b-[3px] border-neutral-800 py-4">
      <div className="w-[60%] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            {/* <span className="text-2xl">🏒</span>
            <span className="text-xl font-bold">Rink Charts</span> */}
            <Image src="/logo.png" alt="Logo" width={300} height={300} />
          </Link>

          {/* Center: Navigation Links */}
          <nav className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-bold pb-[4px] ${
                  pathname === link.href
                    ? "border-b-[1px] border-neutral-800"
                    : "border-b-[1px] border-transparent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
