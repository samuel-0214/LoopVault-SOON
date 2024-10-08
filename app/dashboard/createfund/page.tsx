"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function CreateFund() {
  const router = useRouter();
  const [fundName, setFundName] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");
  const [cycleDuration, setCycleDuration] = useState("");
  const [totalCycles, setTotalCycles] = useState<number | string>(6);
  const [collateralRequirement, setCollateralRequirement] = useState("");
  const [disbursementSchedule, setDisbursementSchedule] = useState<string[]>(
    Array(6).fill("")
  );
  const [maxParticipants, setMaxParticipants] = useState<number | string>(6);

  useEffect(() => {
    const cycles = typeof totalCycles === "number" ? totalCycles : parseInt(totalCycles);
    setDisbursementSchedule(Array(cycles).fill(""));
    setMaxParticipants(cycles > 0 ? cycles : "-");
  }, [totalCycles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFund = {
      id: Date.now(), // Unique ID based on timestamp
      name: fundName,
      contributionAmount,
      cycleDuration,
      totalCycles,
      collateralRequirement,
      disbursementSchedule,
      maxParticipants,
      currentParticipants: 0, // Placeholder for now
    };

    // Fetch existing funds from local storage
    const existingFunds = JSON.parse(localStorage.getItem("chitFunds") || "[]");
    const updatedFunds = [...existingFunds, newFund];

    // Save the updated list of funds in local storage
    localStorage.setItem("chitFunds", JSON.stringify(updatedFunds));

    // Redirect back to the dashboard
    router.push("/dashboard");
  };

  const handleDisbursementChange = (index: number, value: string) => {
    const newSchedule = [...disbursementSchedule];
    newSchedule[index] = value;
    setDisbursementSchedule(newSchedule);
  };

  const handleTotalCyclesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[1-9]\d*$/.test(value)) {
      setTotalCycles(Number(value));
    } else {
      setTotalCycles(value);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Fund</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fund_name">Fund Name</Label>
              <Input
                id="fund_name"
                type="text"
                placeholder="Enter fund name"
                value={fundName}
                onChange={(e) => setFundName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contribution_amount">Contribution Amount</Label>
              <Input
                id="contribution_amount"
                type="number"
                placeholder="Enter contribution amount"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycle_duration">Cycle Duration (in days)</Label>
              <Input
                id="cycle_duration"
                type="number"
                placeholder="Enter cycle duration"
                value={cycleDuration}
                onChange={(e) => setCycleDuration(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_cycles">Total Cycles</Label>
              <Input
                id="total_cycles"
                type="number"
                placeholder="Enter total cycles"
                value={totalCycles}
                onChange={handleTotalCyclesChange}
                required
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collateral_requirement">Collateral Requirement</Label>
              <Input
                id="collateral_requirement"
                type="number"
                placeholder="Enter collateral requirement"
                value={collateralRequirement}
                onChange={(e) => setCollateralRequirement(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Max Participants</Label>
              <div className="text-lg font-semibold">{maxParticipants}</div>
            </div>
            <div className="space-y-2">
              <Label>Disbursement Schedule</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {disbursementSchedule.map((schedule, index) => (
                  <Input
                    key={index}
                    value={schedule}
                    onChange={(e) => handleDisbursementChange(index, e.target.value)}
                    placeholder={`Month ${index + 1}`}
                    required
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Fund</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
