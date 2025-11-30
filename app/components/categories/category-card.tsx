import { Link } from "@/lib/wouter-compat";
import { Folder } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
  productCount?: number;
}

export function CategoryCard({
  category,
  productCount = 0,
}: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.id}`}>
      <Card
        className="group overflow-hidden hover-elevate cursor-pointer"
        data-testid={`category-card-${category.id}`}
      >
        <div className="relative aspect-square bg-muted overflow-hidden">
          {category.image_url ? (
            <img
              src={category.image_url}
              alt={category.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <Folder className="h-16 w-16 text-primary/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3
              className="font-semibold text-white text-lg"
              data-testid={`category-name-${category.id}`}
            >
              {category.name}
            </h3>
            <p className="text-white/80 text-sm">
              {productCount} {productCount === 1 ? "product" : "products"}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
