"use client";

import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Static mock global funds
const mockFunds = [
  {
    id: 1,
    name: "DeFi Yield Fund",
    description: "High-yield farming across multiple DeFi protocols",
    maxParticipants: 100,
    currentParticipants: 75,
  },
  {
    id: 2,
    name: "NFT Collector's Fund",
    description: "Curated collection of rare and valuable NFTs",
    maxParticipants: 50,
    currentParticipants: 32,
  },
  {
    id: 3,
    name: "Crypto Blue Chips",
    description: "Portfolio of top 10 cryptocurrencies by market cap",
    maxParticipants: 200,
    currentParticipants: 180,
  },
  {
    id: 4,
    name: "Web3 Startup Fund",
    description: "Investing in promising Web3 startups and protocols",
    maxParticipants: 150,
    currentParticipants: 60,
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [chitFunds, setChitFunds] = useState<any[]>([]);

  useEffect(() => {
    // Fetch chit funds from local storage
    const savedFunds = JSON.parse(localStorage.getItem("chitFunds") || "[]");
    setChitFunds(savedFunds);
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Global Funds Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-6">Global Funds</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFunds.map((fund) => (
            <motion.div
              key={fund.id}
              initial={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <Card
                className="cursor-pointer transition-transform transform hover:shadow-lg"
                onClick={() => {
                  router.push(`/dashboard/global-fund/${fund.id}`);
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-lg bg-neutral-200 dark:bg-neutral-800 opacity-0 hover:opacity-10 transition duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                />
                <CardHeader>
                  <CardTitle>{fund.name}</CardTitle>
                  <CardDescription>{fund.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={(fund.currentParticipants / fund.maxParticipants) * 100} />
                    <div className="text-sm text-muted-foreground">
                      {fund.currentParticipants} of {fund.maxParticipants} participants joined
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Your Funds Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Funds</h1>
          <Button
            onClick={() => {
              router.push("/dashboard/createfund");
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create Fund
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chitFunds.length > 0 ? (
            chitFunds.map((fund) => (
              <motion.div
                key={fund.id}
                initial={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <Card
                  className="cursor-pointer transition-transform transform hover:shadow-lg"
                  onClick={() => {
                    router.push(`/dashboard/fund/${fund.id}`);
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-neutral-200 dark:bg-neutral-800 opacity-0 hover:opacity-10 transition duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                  />
                  <CardHeader>
                    <CardTitle>{fund.name}</CardTitle>
                    <CardDescription>{fund.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress value={(fund.currentParticipants / fund.maxParticipants) * 100} />
                      <div className="text-sm text-muted-foreground">
                        {fund.currentParticipants} of {fund.maxParticipants} participants joined
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground">No funds created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
