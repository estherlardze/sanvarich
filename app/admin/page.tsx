"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, Category, Order } from "../lib/schema";

export default function AdminDashboard() {
  const { data: products = [], isLoading: productsLoading } = useQuery<
    Product[]
  >({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  const isLoading = productsLoading || categoriesLoading || ordersLoading;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total_price || 0),
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your store</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-3xl font-bold">{products.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Categories</p>
            <p className="text-3xl font-bold">{categories.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-3xl font-bold">{orders.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h2 className="font-bold mb-4">Products</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your product catalog
          </p>
          <Link href="/admin/products">
            <Button className="w-full">Go to Products</Button>
          </Link>
        </Card>
        <Card className="p-6">
          <h2 className="font-bold mb-4">Categories</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Manage product categories
          </p>
          <Link href="/admin/categories">
            <Button className="w-full">Go to Categories</Button>
          </Link>
        </Card>
        <Card className="p-6">
          <h2 className="font-bold mb-4">Orders</h2>
          <p className="text-sm text-muted-foreground mb-4">
            View and manage orders
          </p>
          <Link href="/admin/orders">
            <Button className="w-full">Go to Orders</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
