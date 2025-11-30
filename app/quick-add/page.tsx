"use client";

import { useCart } from "@/lib/context/cart-context";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { QuickAddForm } from "@/components/quick-add-form";

export default function QuickAddPage() {
  const { items } = useCart();

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Quick Add to Cart</h1>
          <p className="text-muted-foreground">
            Quickly add items to your cart
          </p>
        </div>

        <QuickAddForm />

        {items.length > 0 && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm">
              Cart: {items.length} item{items.length === 1 ? "" : "s"} selected
            </p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
