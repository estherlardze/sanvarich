"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomRequest } from "../../lib/schema";

export default function AdminRequestsPage() {
  const { data: requests = [], isLoading } = useQuery<CustomRequest[]>({
    queryKey: ["/api/requests"],
    queryFn: async () => {
      const res = await fetch("/api/requests");
      if (!res.ok) throw new Error("Failed to fetch requests");
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Custom Requests</h1>

      <Card>
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={`req-skeleton-${String(i).padStart(2, "0")}`}
                className="h-12 rounded"
              />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>{request.user_id}</TableCell>
                  <TableCell>
                    <span className="capitalize text-sm px-2 py-1 bg-secondary rounded">
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(request.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
