"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Progress } from "../../components/ui/progress";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

// Dummy data
const globalFundDetails = [
  {
    id: "1",
    name: "DeFi Yield Fund",
    contributionAmount: 2000,
    cycleDuration: 30,
    totalCycles: 6,
    collateralRequirement: 800,
    maxParticipants: 100,
    currentParticipants: 45,
    disbursementSchedule: ["500", "800", "1000", "1200", "1500", "1800"],
  },
  {
    id: "2",
    name: "NFT Collector's Fund",
    contributionAmount: 1500,
    cycleDuration: 45,
    totalCycles: 5,
    collateralRequirement: 1000,
    maxParticipants: 50,
    currentParticipants: 30,
    disbursementSchedule: ["300", "600", "900", "1200", "1500"],
  },
  {
    id: "3",
    name: "Crypto Blue Chips",
    contributionAmount: 2500,
    cycleDuration: 60,
    totalCycles: 4,
    collateralRequirement: 1500,
    maxParticipants: 150,
    currentParticipants: 75,
    disbursementSchedule: ["1000", "2000", "2500", "3000"],
  },
];

export default function GlobalFundDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [fund, setFund] = useState<any>(null);

  useEffect(() => {
    // Find the global fund by id
    const selectedFund = globalFundDetails.find((f) => f.id === id);
    setFund(selectedFund);
  }, [id]);

  if (!fund) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{fund.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Contribution Amount</h3>
              <p>${fund.contributionAmount}</p>
            </div>
            <div>
              <h3 className="font-semibold">Cycle Duration</h3>
              <p>{fund.cycleDuration} days</p>
            </div>
            <div>
              <h3 className="font-semibold">Total Cycles</h3>
              <p>{fund.totalCycles}</p>
            </div>
            <div>
              <h3 className="font-semibold">Collateral Requirement</h3>
              <p>${fund.collateralRequirement}</p>
            </div>
            <div>
              <h3 className="font-semibold">Max Participants</h3>
              <p>{fund.maxParticipants}</p>
            </div>
            <div>
              <h3 className="font-semibold">Current Participants</h3>
              <p>{fund.currentParticipants}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Participants Progress</h3>
            <Progress
              value={(fund.currentParticipants / fund.maxParticipants) * 100}
              className="w-full"
            />
            <p className="text-sm mt-1">
              {fund.currentParticipants} / {fund.maxParticipants} participants
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Disbursement Schedule</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {fund.disbursementSchedule.map((amount, index) => (
                <div key={index} className="bg-secondary p-2 rounded">
                  <p className="text-sm font-medium">Month {index + 1}</p>
                  <p>${amount}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button onClick={() => alert("Join Fund functionality not yet implemented")}>
              Join Fund
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
