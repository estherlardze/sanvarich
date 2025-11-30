"use client";

import { useQuery } from "@tanstack/react-query";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/context/auth-context";
import type { Order } from "../lib/schema";

export default function OrdersPage() {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: user ? ["/api/orders", { userId: user.id }] : [],
    queryFn: user
      ? async () => {
          const res = await fetch(`/api/orders?userId=${user.id}`);
          if (!res.ok) throw new Error("Failed to fetch orders");
          return res.json();
        }
      : undefined,
    enabled: !!user,
  });

  if (!user) {
    return (
      <CustomerLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Please log in to view your orders
          </p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={`order-skeleton-${i}`}
                className="h-24 rounded-lg"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No orders yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      Order #{order.id?.slice(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${order.total_price.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
