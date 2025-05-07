import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogOut, Plus, User } from "lucide-react";
import CallList from "@/components/calls/CallList";
import CallForm from "@/components/calls/CallForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isNewCallDialogOpen, setIsNewCallDialogOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [isViewCallDialogOpen, setIsViewCallDialogOpen] = useState(false);

  // Mock user data
  const user = {
    name: "John Doe",
    role: "Help Desk Agent",
  };

  // Mock calls data
  const mockCalls = [
    {
      id: "1001",
      callerName: "Alice Smith",
      issueDescription: "Unable to access email after password reset",
      priority: "high",
      status: "open",
      dateCreated: "2023-05-15T10:30:00Z",
    },
    {
      id: "1002",
      callerName: "Bob Johnson",
      issueDescription: "Printer not connecting to network",
      priority: "medium",
      status: "in-progress",
      dateCreated: "2023-05-14T14:45:00Z",
    },
    {
      id: "1003",
      callerName: "Carol Williams",
      issueDescription: "New software installation request",
      priority: "low",
      status: "closed",
      dateCreated: "2023-05-13T09:15:00Z",
    },
    {
      id: "1004",
      callerName: "David Brown",
      issueDescription: "VPN connection issues when working remotely",
      priority: "high",
      status: "open",
      dateCreated: "2023-05-15T11:20:00Z",
    },
    {
      id: "1005",
      callerName: "Eva Davis",
      issueDescription: "Request for additional monitor",
      priority: "low",
      status: "in-progress",
      dateCreated: "2023-05-14T16:30:00Z",
    },
  ];

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/");
  };

  const handleNewCall = () => {
    setIsNewCallDialogOpen(true);
  };

  const handleCallSubmit = (callData: any) => {
    // Handle call submission logic here
    console.log("Call submitted:", callData);
    setIsNewCallDialogOpen(false);
    // In a real app, you would add the new call to the list
  };

  const handleViewCall = (call: any) => {
    setSelectedCall(call);
    setIsViewCallDialogOpen(true);
  };

  const handleEditCallSubmit = (callData: any) => {
    // Handle edit call submission logic here
    console.log("Call edited:", callData);
    setIsViewCallDialogOpen(false);
    // In a real app, you would update the call in the list
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Help Desk Call Management</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User size={18} />
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs opacity-80">{user.role}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Support Calls</h2>
          <Button onClick={handleNewCall}>
            <Plus size={16} className="mr-2" />
            New Call
          </Button>
        </div>

        <Card className="bg-card">
          <CardContent className="p-6">
            <CallList calls={mockCalls} onViewCall={handleViewCall} />
          </CardContent>
        </Card>
      </main>

      {/* New Call Dialog */}
      <Dialog open={isNewCallDialogOpen} onOpenChange={setIsNewCallDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>New Support Call</DialogTitle>
          </DialogHeader>
          <CallForm onSubmit={handleCallSubmit} />
        </DialogContent>
      </Dialog>

      {/* View/Edit Call Dialog */}
      <Dialog
        open={isViewCallDialogOpen}
        onOpenChange={setIsViewCallDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Call Details</DialogTitle>
          </DialogHeader>
          <CallForm call={selectedCall} onSubmit={handleEditCallSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
