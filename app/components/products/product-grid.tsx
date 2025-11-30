import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";
import type { Product, ProductVariant } from "@shared/schema";

interface ProductGridProps {
  products: Product[];
  variants?: Record<string, ProductVariant[]>;
  isLoading?: boolean;
}

export function ProductGrid({ products, variants = {}, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">No products found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variants={variants[product.id]}
        />
      ))}
    </div>
  );
}
