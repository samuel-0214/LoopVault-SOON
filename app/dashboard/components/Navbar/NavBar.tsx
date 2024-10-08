"use client";
import Link from "next/link";

import { ThemeToggle } from "./ToggleMode";
import { useRouter } from "next/navigation";
import { WalletMultiButtonFix } from "../../walletbutton/WalletButton";
import React from "react";

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <svg
          className="h-6 w-6 text-primary"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 5v14" />
          <path d="M18 13a6 6 0 0 0-6-6h-1.5" />
          <path d="M6 11a6 6 0 0 0 6 6h1.5" />
        </svg>
        <span
          className="text-xl font-bold"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          LoopVault
        </span>
      </Link>
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="text-lg font-medium relative group"
        >
          Home
          <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
        </Link>
        <WalletMultiButtonFix />
        <ThemeToggle />
      </div>
    </nav>
  );
}
