"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import Modal from "../../components/ui/Modal";

export default function FundDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [fund, setFund] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Fetch chit funds from local storage
    const savedFunds = JSON.parse(localStorage.getItem("chitFunds") || "[]");
    const selectedFund = savedFunds.find((f: any) => f.id === Number(id));
    setFund(selectedFund);
  }, [id]);

  const handleJoinFund = () => {
    setShowModal(true);
  };

  const handleDeleteFund = () => {
    // Only allow deletion if no participants have joined
    if (fund.currentParticipants > 0) {
      alert("You cannot delete a fund that has already started.");
      setShowDeleteModal(false);
      return;
    }

    // Confirm the deletion
    const savedFunds = JSON.parse(localStorage.getItem("chitFunds") || "[]");
    const updatedFunds = savedFunds.filter((f: any) => f.id !== fund.id);
    localStorage.setItem("chitFunds", JSON.stringify(updatedFunds));

    alert("The fund has been successfully deleted.");
    setShowDeleteModal(false);
    router.push("/dashboard");
  };

  const handlePay = () => {
    // Check if the fund is already full
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

  if (!fund) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{fund.name}</CardTitle>
          <CardDescription>{fund.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <strong>Max Participants:</strong> {fund.maxParticipants}
            </div>
            <div>
              <strong>Current Participants:</strong> {fund.currentParticipants || 0}
            </div>
            <div>
              <strong>Collateral Requirement:</strong> ${fund.collateralRequirement}
            </div>
          </div>
          <div className="mb-4">
            <strong>Participants Progress:</strong>
            <Progress
              value={(fund.currentParticipants / fund.maxParticipants) * 100}
            />
            <div className="text-sm mt-2">
              {fund.currentParticipants || 0} / {fund.maxParticipants} participants
            </div>
          </div>
          <div className="mt-4">
            <strong>Disbursement Schedule:</strong>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {fund.disbursementSchedule.map((amount: string, index: number) => (
                <div
                  key={index}
                  className="bg-gray-200 dark:bg-gray-800 p-2 rounded text-center"
                >
                  Month {index + 1}: ${amount}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <div className="flex justify-end mt-4 space-x-4">
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
          <Button
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Fund
          </Button>
        </div>
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

      {/* Modal for deleting fund */}
      {showDeleteModal && (
        <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete this fund? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteFund}
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
