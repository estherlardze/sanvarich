"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Truck, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { ProductGrid } from "@/components/products/product-grid";
import { CategoryCard } from "@/components/categories/category-card";
import type { Product, Category, ProductVariant } from "./lib/schema";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [], isLoading: productsLoading } = useQuery<
    Product[]
  >({
    queryKey: ["/api/products"],
    queryFn: async () => (await fetch("/api/products")).json(),
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["/api/categories"],
    queryFn: async () => (await fetch("/api/categories")).json(),
  });

  const { data: variants = {} } = useQuery<Record<string, ProductVariant[]>>({
    queryKey: ["/api/variants"],
    queryFn: async () => (await fetch("/api/variants")).json(),
  });

  const featuredProducts = products.slice(0, 8);
  const featuredCategories = categories.slice(0, 6);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <CustomerLayout searchQuery={searchQuery} onSearchChange={handleSearch}>
      <section className="relative -mx-4 md:-mx-6 -mt-6 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Fresh Groceries Delivered
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Your Favorite <span className="text-primary">Grocery Store</span>,
              Online
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Shop fresh produce, pantry essentials, and everyday items. Enjoy
              wholesale prices and fast delivery right to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" data-testid="button-shop-now">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  variant="outline"
                  size="lg"
                  data-testid="button-browse-categories"
                >
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
            <div className="rounded-full bg-primary/10 p-3">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Free Delivery</h3>
              <p className="text-sm text-muted-foreground">
                On orders over $50
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
            <div className="rounded-full bg-primary/10 p-3">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Quality Guaranteed</h3>
              <p className="text-sm text-muted-foreground">
                Fresh products always
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
            <div className="rounded-full bg-primary/10 p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Fast Checkout</h3>
              <p className="text-sm text-muted-foreground">
                Quick & easy ordering
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground">
              Browse our product categories
            </p>
          </div>
          <Link href="/categories">
            <Button variant="ghost" data-testid="link-view-all-categories">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map((category) => (
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
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground">Our best-selling items</p>
          </div>
          <Link href="/products">
            <Button variant="ghost" data-testid="link-view-all-products">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <ProductGrid
          products={featuredProducts}
          variants={variants}
          isLoading={productsLoading}
        />
      </section>

      <section className="mb-12 p-8 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">
            Wholesale Pricing Available
          </h2>
          <p className="text-muted-foreground mb-6">
            Toggle wholesale mode in your cart to access bulk pricing on
            eligible products. Perfect for businesses and large families.
          </p>
          <Link href="/products">
            <Button data-testid="button-explore-wholesale">
              Explore Wholesale Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </CustomerLayout>
  );
}
