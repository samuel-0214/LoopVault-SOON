"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Modal from "../../components/ui/Modal";

export default function FundDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [fund, setFund] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Fetch chit funds from local storage
    const savedFunds = JSON.parse(localStorage.getItem("chitFunds") || "[]");
    const selectedFund = savedFunds.find((f: any) => f.id === Number(id));
    setFund(selectedFund);
  }, [id]);

  if (!fund) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  const handleJoinFund = () => {
    setShowModal(true);
  };

  const handlePay = () => {
    // Ensure the fund isn't full before joining
    if (fund.currentParticipants >= fund.maxParticipants) {
      alert("This fund is already full.");
      setShowModal(false);
      return;
    }

    // Update the fund's current participants count
    const updatedFund = {
      ...fund,
      currentParticipants: fund.currentParticipants + 1,
    };

    // Update local storage
    const savedFunds = JSON.parse(localStorage.getItem("chitFunds") || "[]");
    const updatedFunds = savedFunds.map((f: any) =>
      f.id === updatedFund.id ? updatedFund : f
    );
    localStorage.setItem("chitFunds", JSON.stringify(updatedFunds));

    // Update the state
    setFund(updatedFund);
    setShowModal(false);
    setIsJoined(true);

    alert(`You have successfully joined the fund and paid $${fund.collateralRequirement} as collateral!`);
  };

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

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button
              onClick={handleJoinFund}
              disabled={fund.currentParticipants >= fund.maxParticipants || isJoined}
            >
              {fund.currentParticipants >= fund.maxParticipants
                ? "Fund Full"
                : isJoined
                ? "Already Joined"
                : "Join Fund"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal for joining fund */}
      {showModal && (
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <h2 className="text-lg font-bold mb-4">Deposit Collateral</h2>
          <p>Collateral Amount: ${fund.collateralRequirement}</p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handlePay}>Pay</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
