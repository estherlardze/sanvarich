"use client";

import { useQuery } from "@tanstack/react-query";

import type { Category, Product } from "../lib/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryCard } from "@/components/categories/category-card";
import { CustomerLayout } from "@/components/layout/customer-layout";

export default function CategoriesPage() {
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["/api/categories"],
    queryFn: async () => (await fetch("/api/categories")).json(),
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => (await fetch("/api/products")).json(),
  });

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Browse by category</p>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={`skeleton-${i}`}
                className="aspect-square rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                productCount={
                  products.filter((p) => p.category_id === category.id).length
                }
              />
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
