"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/hooks/use-toast";
import { insertProductSchema } from "../../../lib/schema";
import type { Product } from "../../../lib/schema";

export default function ProductFormPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const productId = params?.productId as string | undefined;

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: productId ? ["/api/products", productId] : [],
    queryFn: productId
      ? async () => {
          const res = await fetch(`/api/products/${productId}`);
          if (!res.ok) throw new Error("Failed to fetch product");
          return res.json();
        }
      : undefined,
    enabled: !!productId,
  });

  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: product || {
      name: "",
      category_id: "",
      retail_price: 0,
      wholesale_price: 0,
      stock: 0,
      unit: "piece",
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const method = productId ? "PUT" : "POST";
      const url = productId ? `/api/products/${productId}` : "/api/products";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save product");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Product saved successfully" });
      router.push("/admin/products");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save product",
      });
    },
  });

  if (productId && isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">
          {productId ? "Edit Product" : "New Product"}
        </h1>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Category UUID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="retail_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retail Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wholesale_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wholesale Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/products")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
