"use client";
import { Link, useLocation } from "@/lib/wouter-compat";
import { Search, ShoppingCart, User, Menu, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/context/auth-context";
import { useCart } from "@/lib/context/cart-context";
import { useState } from "react";

interface CustomerHeaderProps {
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CustomerHeader({
  onCartClick,
  searchQuery,
  onSearchChange,
}: CustomerHeaderProps) {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <span className="flex items-center gap-2 text-lg font-medium hover-elevate p-2 rounded-md">
                      Home
                    </span>
                  </Link>
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2 text-lg font-medium hover-elevate p-2 rounded-md">
                      Products
                    </span>
                  </Link>
                  <Link
                    href="/categories"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2 text-lg font-medium hover-elevate p-2 rounded-md">
                      Categories
                    </span>
                  </Link>
                  <Link
                    href="/quick-add"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2 text-lg font-medium hover-elevate p-2 rounded-md">
                      Quick Add Request
                    </span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/">
              <span
                className="flex items-center gap-2 cursor-pointer"
                data-testid="link-home"
              >
                <Package className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold hidden sm:inline">
                  FreshMart
                </span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/products">
              <span
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                data-testid="link-products"
              >
                Products
              </span>
            </Link>
            <Link href="/categories">
              <span
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                data-testid="link-categories"
              >
                Categories
              </span>
            </Link>
            <Link href="/quick-add">
              <span
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                data-testid="link-quick-add"
              >
                Quick Add
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </Badge>
              )}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid="button-user-menu"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setLocation("/orders")}
                    data-testid="menu-orders"
                  >
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLocation("/requests")}
                    data-testid="menu-requests"
                  >
                    My Requests
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setLocation("/admin")}
                        data-testid="menu-admin"
                      >
                        Admin Dashboard
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    data-testid="menu-logout"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" data-testid="button-login">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" data-testid="button-register">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
