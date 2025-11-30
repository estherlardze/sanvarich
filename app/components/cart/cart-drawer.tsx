import { Link } from "@/lib/wouter-compat";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/context/cart-context";
import { useAuth } from "@/lib/context/auth-context";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const {
    items,
    total,
    isWholesale,
    setIsWholesale,
    updateQuantity,
    removeItem,
    getItemPrice,
  } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="space-y-2.5 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart
            </SheetTitle>
          </div>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="wholesale-toggle"
              className="text-sm text-muted-foreground"
            >
              Wholesale Pricing
            </Label>
            <Switch
              id="wholesale-toggle"
              checked={isWholesale}
              onCheckedChange={setIsWholesale}
              data-testid="switch-wholesale"
            />
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <div className="rounded-full bg-muted p-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add some products to get started
              </p>
            </div>
            <Button
              onClick={() => onOpenChange(false)}
              data-testid="button-continue-shopping"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => {
                  const itemKey = `${item.product.id}-${
                    item.variant?.id || "no-variant"
                  }`;
                  const price = getItemPrice(item);
                  const lineTotal = price * item.quantity;

                  return (
                    <div
                      key={itemKey}
                      className="flex gap-4"
                      data-testid={`cart-item-${item.product.id}`}
                    >
                      <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.product.name}
                        </h4>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground">
                            {item.variant.name}
                          </p>
                        )}
                        <p className="text-sm font-semibold mt-1">
                          {formatPrice(price)}
                          {isWholesale && item.product.wholesale_available && (
                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                              (wholesale)
                            </span>
                          )}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.variant?.id,
                                  item.quantity - 1
                                )
                              }
                              data-testid={`button-decrease-${item.product.id}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.variant?.id,
                                  item.quantity + 1
                                )
                              }
                              data-testid={`button-increase-${item.product.id}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() =>
                              removeItem(item.product.id, item.variant?.id)
                            }
                            data-testid={`button-remove-${item.product.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-semibold text-sm">
                          {formatPrice(lineTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">
                    Calculated at checkout
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {isAuthenticated ? (
                <Link href="/checkout" onClick={() => onOpenChange(false)}>
                  <Button
                    className="w-full"
                    size="lg"
                    data-testid="button-checkout"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => onOpenChange(false)}>
                    <Button
                      className="w-full"
                      size="lg"
                      data-testid="button-login-checkout"
                    >
                      Login to Checkout
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" onClick={() => onOpenChange(false)}>
                      <span className="text-primary underline cursor-pointer">
                        Sign up
                      </span>
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
