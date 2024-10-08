"use client";

import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "../libs/utils";
import Link from "next/link";

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 dark", className)}>
      <Menu setActive={setActive}>
        <ul className="flex space-x-8 text-lg"> {/* Increased spacing and font size */}
          <li>
            <Link href="/">
              <MenuItem setActive={setActive} active={active} item="Home" />
            </Link>
          </li>
          <li>
            <Link href="/">
              <MenuItem setActive={setActive} active={active} item="Explore">
                <div className="flex flex-col space-y-4 text-lg"> {/* Increased font size here */}
                  <HoveredLink href="#about_section">About Us</HoveredLink>
                  <HoveredLink href="#features">Features</HoveredLink>
                  <HoveredLink href="#roadmap">Roadmap</HoveredLink>
                  <HoveredLink href="#faqsection">FAQ</HoveredLink>
                  <HoveredLink href="#our_team">Our Team</HoveredLink>
                </div>
              </MenuItem>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <MenuItem setActive={setActive} active={active} item="Contact Us" />
            </Link>
          </li>
        </ul>
      </Menu>
    </div>
  );
}

export default Navbar;
