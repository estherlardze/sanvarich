"use client";

import { Card } from "@/components/ui/card";
import { useCart } from "@/lib/context/cart-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomerLayout } from "@/components/layout/customer-layout";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    // TODO: Implement checkout logic with Stripe/payment processor
    alert("Checkout logic coming soon!");
    clearCart();
  };

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Checkout</h1>

        {items.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6">
                <h2 className="font-bold mb-4">Order Summary</h2>
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between py-2 border-b"
                  >
                    <span>{item.product.name}</span>
                    <span>
                      ${(item.product.retail_price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </Card>
            </div>

            <Card className="p-6 h-fit">
              <h2 className="font-bold mb-4">Order Total</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button onClick={handleCheckout} className="w-full">
                Proceed to Payment
              </Button>
            </Card>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
