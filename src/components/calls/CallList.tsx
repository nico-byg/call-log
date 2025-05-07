import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Call {
  id: string;
  callerName: string;
  issueDescription: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved" | "closed";
  dateCreated: string;
}

interface CallListProps {
  calls?: Call[];
  onViewCall?: (id: string) => void;
  onEditCall?: (id: string) => void;
  onDeleteCall?: (id: string) => void;
}

const CallList: React.FC<CallListProps> = ({
  calls = mockCalls,
  onViewCall,
  onEditCall,
  onDeleteCall,
}) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof Call>("dateCreated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle sorting
  const handleSort = (field: keyof Call) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort calls
  const sortedCalls = [...calls].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate calls
  const indexOfLastCall = currentPage * itemsPerPage;
  const indexOfFirstCall = indexOfLastCall - itemsPerPage;
  const currentCalls = sortedCalls.slice(indexOfFirstCall, indexOfLastCall);
  const totalPages = Math.ceil(calls.length / itemsPerPage);

  // Handle row click
  const handleRowClick = (id: string) => {
    if (onViewCall) {
      onViewCall(id);
    } else {
      navigate(`/calls/${id}`);
    }
  };

  // Render sort icon
  const renderSortIcon = (field: keyof Call) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  // Render priority badge
  const renderPriorityBadge = (priority: Call["priority"]) => {
    const variants = {
      low: { variant: "outline" as const, label: "Low" },
      medium: { variant: "secondary" as const, label: "Medium" },
      high: { variant: "default" as const, label: "High" },
      critical: { variant: "destructive" as const, label: "Critical" },
    };

    const { variant, label } = variants[priority];
    return <Badge variant={variant}>{label}</Badge>;
  };

  // Render status badge
  const renderStatusBadge = (status: Call["status"]) => {
    const variants = {
      open: { variant: "outline" as const, label: "Open" },
      "in-progress": { variant: "secondary" as const, label: "In Progress" },
      resolved: { variant: "default" as const, label: "Resolved" },
      closed: { variant: "destructive" as const, label: "Closed" },
    };

    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="bg-background rounded-md border shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[80px] cursor-pointer"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center">
                  ID {renderSortIcon("id")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("callerName")}
              >
                <div className="flex items-center">
                  Caller Name {renderSortIcon("callerName")}
                </div>
              </TableHead>
              <TableHead className="max-w-[300px]">Issue Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("priority")}
              >
                <div className="flex items-center">
                  Priority {renderSortIcon("priority")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status {renderSortIcon("status")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("dateCreated")}
              >
                <div className="flex items-center">
                  Date Created {renderSortIcon("dateCreated")}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCalls.length > 0 ? (
              currentCalls.map((call) => (
                <TableRow
                  key={call.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(call.id)}
                >
                  <TableCell className="font-medium">{call.id}</TableCell>
                  <TableCell>{call.callerName}</TableCell>
                  <TableCell className="max-w-[300px]">
                    {truncateText(call.issueDescription, 100)}
                  </TableCell>
                  <TableCell>{renderPriorityBadge(call.priority)}</TableCell>
                  <TableCell>{renderStatusBadge(call.status)}</TableCell>
                  <TableCell>{formatDate(call.dateCreated)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onViewCall) onViewCall(call.id);
                            else navigate(`/calls/${call.id}`);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEditCall) onEditCall(call.id);
                            else navigate(`/calls/${call.id}/edit`);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteCall) onDeleteCall(call.id);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No calls found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {calls.length > 0 && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstCall + 1} to{" "}
            {Math.min(indexOfLastCall, calls.length)} of {calls.length} entries
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic to show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

// Mock data for development
const mockCalls: Call[] = [
  {
    id: "CALL-001",
    callerName: "John Smith",
    issueDescription:
      'Unable to access email account. Getting "invalid credentials" error despite using correct password.',
    priority: "high",
    status: "open",
    dateCreated: "2023-06-15T09:30:00Z",
  },
  {
    id: "CALL-002",
    callerName: "Sarah Johnson",
    issueDescription:
      "Printer not connecting to network. Was working yesterday but now shows offline status.",
    priority: "medium",
    status: "in-progress",
    dateCreated: "2023-06-14T14:45:00Z",
  },
  {
    id: "CALL-003",
    callerName: "Michael Brown",
    issueDescription:
      "New employee needs software installation and account setup.",
    priority: "low",
    status: "open",
    dateCreated: "2023-06-14T11:20:00Z",
  },
  {
    id: "CALL-004",
    callerName: "Emily Davis",
    issueDescription:
      "Server down affecting entire accounting department. Urgent assistance required.",
    priority: "critical",
    status: "in-progress",
    dateCreated: "2023-06-15T08:15:00Z",
  },
  {
    id: "CALL-005",
    callerName: "Robert Wilson",
    issueDescription:
      "Monitor displaying distorted colors after recent office move.",
    priority: "low",
    status: "resolved",
    dateCreated: "2023-06-13T16:30:00Z",
  },
  {
    id: "CALL-006",
    callerName: "Jennifer Taylor",
    issueDescription:
      "Need assistance with Excel formula for quarterly report.",
    priority: "medium",
    status: "closed",
    dateCreated: "2023-06-12T13:45:00Z",
  },
  {
    id: "CALL-007",
    callerName: "David Martinez",
    issueDescription:
      "VPN connection issues when working remotely. Cannot access internal resources.",
    priority: "high",
    status: "open",
    dateCreated: "2023-06-15T10:05:00Z",
  },
  {
    id: "CALL-008",
    callerName: "Lisa Anderson",
    issueDescription:
      "Need to restore files accidentally deleted from shared drive.",
    priority: "high",
    status: "resolved",
    dateCreated: "2023-06-14T09:20:00Z",
  },
  {
    id: "CALL-009",
    callerName: "James Thompson",
    issueDescription: "Laptop battery not charging, needs replacement.",
    priority: "medium",
    status: "in-progress",
    dateCreated: "2023-06-13T11:50:00Z",
  },
  {
    id: "CALL-010",
    callerName: "Patricia Garcia",
    issueDescription:
      "Cannot access shared calendar after recent password change.",
    priority: "low",
    status: "open",
    dateCreated: "2023-06-14T15:30:00Z",
  },
  {
    id: "CALL-011",
    callerName: "Thomas Wright",
    issueDescription:
      "Need to set up video conferencing for board meeting tomorrow.",
    priority: "high",
    status: "resolved",
    dateCreated: "2023-06-13T14:15:00Z",
  },
  {
    id: "CALL-012",
    callerName: "Nancy Lee",
    issueDescription: "Outlook calendar not syncing with mobile device.",
    priority: "medium",
    status: "open",
    dateCreated: "2023-06-15T11:40:00Z",
  },
];

export default CallList;
