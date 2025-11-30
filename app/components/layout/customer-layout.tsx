"use client";
import { useState } from "react";
import { CustomerHeader } from "./customer-header";
import { CartDrawer } from "@/components/cart/cart-drawer";

interface CustomerLayoutProps {
  children: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function CustomerLayout({ children, searchQuery = "", onSearchChange }: CustomerLayoutProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");

  const handleSearchChange = onSearchChange || setInternalSearch;
  const currentSearch = onSearchChange ? searchQuery : internalSearch;

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader
        onCartClick={() => setCartOpen(true)}
        searchQuery={currentSearch}
        onSearchChange={handleSearchChange}
      />
      <main className="container mx-auto px-4 md:px-6 py-6">
        {children}
      </main>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">FreshMart</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted grocery supermarket for fresh produce and quality products.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Contact</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Customer Service</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Shipping Info</li>
                <li>Returns</li>
                <li>Track Order</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@freshmart.com</li>
                <li>1-800-FRESH</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            2024 FreshMart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
