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
import { insertCategorySchema } from "../../../lib/schema";
import type { Category } from "../../../lib/schema";

export default function CategoryFormPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const categoryId = params?.categoryId as string | undefined;

  const { data: category, isLoading } = useQuery<Category>({
    queryKey: categoryId ? ["/api/categories", categoryId] : [],
    queryFn: categoryId
      ? async () => {
          const res = await fetch(`/api/categories/${categoryId}`);
          if (!res.ok) throw new Error("Failed to fetch category");
          return res.json();
        }
      : undefined,
    enabled: !!categoryId,
  });

  const form = useForm({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: category || { name: "" },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const method = categoryId ? "PUT" : "POST";
      const url = categoryId
        ? `/api/categories/${categoryId}`
        : "/api/categories";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save category");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Category saved successfully" });
      router.push("/admin/categories");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save category",
      });
    },
  });

  if (categoryId && isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">
          {categoryId ? "Edit Category" : "New Category"}
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
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
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
                onClick={() => router.push("/admin/categories")}
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
