"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/context/auth-context";
import { useToast } from "@/lib/hooks/use-toast";
import type { CustomRequest } from "../lib/schema";

const requestSchema = z.object({
  name: z.string().min(1, "Item name required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

type RequestForm = z.infer<typeof requestSchema>;

export default function RequestsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const form = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: { name: "", quantity: 1, notes: "" },
  });

  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useQuery<CustomRequest[]>({
    queryKey: user ? ["/api/requests", { userId: user.id }] : [],
    queryFn: user
      ? async () => {
          const res = await fetch(`/api/requests?userId=${user.id}`);
          if (!res.ok) throw new Error("Failed to fetch requests");
          return res.json();
        }
      : undefined,
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (data: RequestForm) => {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id, ...data }),
      });
      if (!res.ok) throw new Error("Failed to create request");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request submitted!",
        description: "We'll get back to you soon.",
      });
      form.reset();
      refetch();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit request",
      });
    },
  });

  if (!user) {
    return (
      <CustomerLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Please log in to submit requests
          </p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Item Requests</h1>

        <Card className="p-6">
          <h2 className="font-bold mb-4">Request an Item</h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                createMutation.mutate(data)
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What item are you looking for?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Any additional details?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={createMutation.isPending}>
                Submit Request
              </Button>
            </form>
          </Form>
        </Card>

        <div className="space-y-4">
          <h2 className="font-bold">Your Requests</h2>
          {isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={`request-skeleton-${String(i).padStart(2, "0")}`}
                  className="h-24 rounded-lg"
                />
              ))}
            </>
          ) : requests.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No requests yet</p>
            </Card>
          ) : (
            requests.map((req) => (
              <Card key={req.id} className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{req.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {req.quantity}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {req.status}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
