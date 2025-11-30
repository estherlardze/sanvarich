import { useState } from "react";
import { ShoppingCart, Package, Plus, Minus, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, ProductVariant } from "@shared/schema";
import { useCart } from "@/lib/context/cart-context";

interface ProductCardProps {
  product: Product;
  variants?: ProductVariant[];
}

export function ProductCard({ product, variants = [] }: ProductCardProps) {
  const { addItem, isWholesale, items } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    variants.length > 0 ? variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getDisplayPrice = () => {
    const basePrice = isWholesale && product.wholesale_available
      ? product.wholesale_price
      : product.retail_price;
    const adjustment = selectedVariant?.price_adjustment || 0;
    return basePrice + adjustment;
  };

  const isInCart = items.some(
    (item) =>
      item.product.id === product.id &&
      (item.variant?.id || null) === (selectedVariant?.id || null)
  );

  const getStockStatus = () => {
    const stock = selectedVariant?.stock ?? product.stock;
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock <= 5) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const stockStatus = getStockStatus();
  const isOutOfStock = (selectedVariant?.stock ?? product.stock) === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedVariant, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
    setQuantity(1);
  };

  return (
    <Card className="group overflow-hidden hover-elevate" data-testid={`product-card-${product.id}`}>
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground" />
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge variant={stockStatus.variant} className="text-xs">
            {stockStatus.label}
          </Badge>
          {isWholesale && product.wholesale_available && (
            <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
              Wholesale
            </Badge>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isOutOfStock}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(quantity + 1)}
                disabled={isOutOfStock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button
              className="flex-1"
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              data-testid={`button-add-to-cart-${product.id}`}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-medium truncate" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold" data-testid={`product-price-${product.id}`}>
            {formatPrice(getDisplayPrice())}
          </span>
          {isWholesale && product.wholesale_available && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.retail_price + (selectedVariant?.price_adjustment || 0))}
            </span>
          )}
          <span className="text-xs text-muted-foreground">/ {product.unit}</span>
        </div>

        {variants.length > 0 && (
          <div className="mt-3">
            <Select
              value={selectedVariant?.id}
              onValueChange={(id) => setSelectedVariant(variants.find((v) => v.id === id))}
            >
              <SelectTrigger className="h-9" data-testid={`select-variant-${product.id}`}>
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                {variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id}>
                    {variant.name}
                    {variant.price_adjustment !== 0 && (
                      <span className="ml-2 text-muted-foreground">
                        {variant.price_adjustment > 0 ? "+" : ""}
                        {formatPrice(variant.price_adjustment)}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          className="w-full mt-3 md:hidden"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
