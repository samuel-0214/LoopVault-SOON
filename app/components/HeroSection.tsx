"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Spotlight } from "./ui/Spotlight";
import { Button } from "./ui/moving-border";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";
import { FlipWords } from "./ui/flip-words";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
};

const words = ["Chit Funds", "ROSCA"];

const staggerDelay = 0.2;

function HeroSection() {
  return (
    <HeroHighlight>
      <motion.div
        initial="initial"
        animate="animate"
        className="h-auto md:h-[57rem] w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden mx-auto md:py-0"
        id="hero_section"
      >
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20 position:fixed"
          fill="white"
        />
        <div className="p-4 relative z-10 w-full text-center">
          <motion.h1
            variants={fadeInUp}
            transition={{ delay: staggerDelay * 1 }}
            className="mt-20 md:mt-0 text-4xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 p-10"
          >
            <Highlight className="text-black dark:text-white"> LoopVault </Highlight>
          </motion.h1>
          <motion.h3
            variants={fadeInUp}
            transition={{ delay: staggerDelay * 2 }}
            className="mt-20 md:mt-0 text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 static p-3"
          >
            Decentralized Finance meets Traditional{" "}
            <div className="p-3">
              <FlipWords words={words} /> <br />
            </div>
          </motion.h3>
          <motion.div
            variants={fadeInUp}
            transition={{ delay: staggerDelay * 4 }}
            className="mt-8"
          >
            <Link href={"/dashboard"}>
              <Button
                borderRadius="1.75rem"
                className="bg-[#924ad8] text-white border-[#924ad8] hover:bg-[#7b3db2] hover:border-[#7b3db2] dark:bg-slate-900 dark:text-white"
              >
                JOIN US
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </HeroHighlight>
  );
}

export default HeroSection;
