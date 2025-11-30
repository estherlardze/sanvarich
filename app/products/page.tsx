"use client";

import { useQuery } from "@tanstack/react-query";

import { CustomerLayout } from "@/components/layout/customer-layout";
import { ProductGrid } from "@/components/products/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, ProductVariant } from "../lib/schema";

export default function ProductsPage() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => (await fetch("/api/products")).json(),
  });

  const { data: variants = {} } = useQuery<Record<string, ProductVariant[]>>({
    queryKey: ["/api/variants"],
    queryFn: async () => (await fetch("/api/variants")).json(),
  });

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Browse all available products</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={`skeleton-${i}`} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <ProductGrid
            products={products}
            variants={variants}
            isLoading={isLoading}
          />
        )}
      </div>
    </CustomerLayout>
  );
}
