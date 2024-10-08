"use client";

import React from "react";
import { Timeline } from "./ui/timeline";

export function TimelineDemo() {
  const data = [
    {
      title: "Q4 2024",
      content: (
        <div>
          <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">Official Launch</h2>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Officially launched LoopVault with a full feature set and enhanced user experience. Expanded marketing efforts globally.
          </p>
        </div>
      ),
    },
    {
      title: "Q1 2025",
      content: (
        <div>
          <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">Platform Expansion & User Growth</h2>
            <ul className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
              <li>Feature Development</li>
              <li>Partnerships & Integrations</li>
              <li>Marketing & Community Growth</li>
            </ul>
        </div>
      ),
    },
    {
      title: "Q2 2025",
      content: (
        <div>
          <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">Compliance & Platform Optimization</h2>
            <ul className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
              <li>Compliance & Security Enhancements</li>
              <li>Platform Optimization</li>
              <li>Growth Initiatives</li>
            </ul>
        </div>
      ),
    },
    {
      title: "Q3 2025",
      content: (
        <div>
          <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">Strategic Expansion & Ecosystem Development</h2>
            <ul className="text-neutral-800 dark:text-neutral-200 text-md md:text-sm font-normal mb-8">
              <li >Strategic Expansion</li>
              <li>Ecosystem Development</li>
              <li>Sustainability & Community Engagement</li>
            </ul>
        </div>
      ),
    },
  ];

  return (
    <div
      className="w-full bg-gradient-to-b from-black via-[#2d1b4b] to-black"
      id="roadmap"
    >
      <Timeline data={data} />
    </div>
  );
}
