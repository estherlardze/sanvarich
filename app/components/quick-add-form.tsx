import { useState, useCallback } from "react";
import { Loader2, Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/lib/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useCart } from "@/lib/context/cart-context";
import type { Product } from "@shared/schema";

interface QuickAddRow {
  id: string;
  name: string;
  quantity: number;
  brand: string;
}

interface MatchResult {
  name: string;
  quantity: number;
  brand?: string;
  matches: Array<{ type: string; score: number; product: Product }>;
  status: "matched" | "suggested" | "not_found";
}

export function QuickAddForm() {
  const { toast } = useToast();
  const { addItem } = useCart();
  const [rows, setRows] = useState<QuickAddRow[]>([
    { id: "1", name: "", quantity: 1, brand: "" },
  ]);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const addRow = () => {
    const newId = String(Math.max(...rows.map((r) => parseInt(r.id) || 0)) + 1);
    setRows([...rows, { id: newId, name: "", quantity: 1, brand: "" }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((r) => r.id !== id));
    }
  };

  const updateRow = (
    id: string,
    field: keyof QuickAddRow,
    value: string | number
  ) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const processRows = async () => {
    const filledRows = rows.filter((r) => r.name.trim());
    if (filledRows.length === 0) {
      toast({
        variant: "destructive",
        title: "No items to process",
        description: "Add at least one product name",
      });
      return;
    }

    setSearching(true);
    try {
      const response = await apiRequest("POST", "/api/quick-add/search", {
        items: filledRows.map((r) => ({
          name: r.name,
          quantity: r.quantity,
          brand: r.brand || undefined,
        })),
      });

      // Ensure response is an array
      const resultsArray = Array.isArray(response)
        ? response
        : response?.results || [];
      setResults(resultsArray);
      setShowResults(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search failed",
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setSearching(false);
    }
  };

  const addToCart = (result: MatchResult) => {
    if (result.status === "not_found") {
      toast({
        variant: "destructive",
        title: "No match found",
        description: `"${result.name}" could not be matched to any product`,
      });
      return;
    }

    const match = result.matches[0];
    if (!match) return;

    // addItem expects (product, variant?, quantity?)
    addItem(match.product, undefined, result.quantity);

    toast({
      title: "Added to cart",
      description: `${match.product.name} x${result.quantity}`,
    });
  };

  const addAllMatched = () => {
    let added = 0;
    results.forEach((result) => {
      if (result.status !== "not_found" && result.matches.length > 0) {
        addToCart(result);
        added++;
      }
    });

    if (added > 0) {
      toast({
        title: `Added ${added} items to cart`,
      });
      setShowResults(false);
      setRows([{ id: "1", name: "", quantity: 1, brand: "" }]);
    }
  };

  if (showResults) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Matching Results</h3>
          <Button variant="outline" onClick={() => setShowResults(false)}>
            Back to Edit
          </Button>
        </div>

        <div className="space-y-3">
          {results.map((result, idx) => {
            const statusColor =
              result.status === "matched"
                ? "bg-green-50 dark:bg-green-950"
                : result.status === "suggested"
                ? "bg-yellow-50 dark:bg-yellow-950"
                : "bg-red-50 dark:bg-red-950";

            return (
              <Card key={idx} className={statusColor}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{result.name}</h4>
                        <Badge
                          variant={
                            result.status === "matched"
                              ? "default"
                              : result.status === "suggested"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {result.status === "matched"
                            ? "✓ Matched"
                            : result.status === "suggested"
                            ? "? Suggested"
                            : "✗ Not Found"}
                        </Badge>
                      </div>

                      {result.matches.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium mb-2">
                            {result.matches[0].product.name}
                          </p>
                          <p>
                            Price: $
                            {result.matches[0].product.retail_price.toFixed(2)}
                            {result.matches[0].product.wholesale_available && (
                              <span className="ml-2">
                                (Wholesale: $
                                {result.matches[0].product.wholesale_price.toFixed(
                                  2
                                )}
                                )
                              </span>
                            )}
                          </p>
                          <p>Qty Requested: {result.quantity}</p>
                        </div>
                      )}
                    </div>

                    {result.status !== "not_found" &&
                      result.matches.length > 0 && (
                        <Button size="sm" onClick={() => addToCart(result)}>
                          Add to Cart
                        </Button>
                      )}
                  </div>

                  {result.matches.length > 1 && (
                    <>
                      <Separator className="my-3" />
                      <p className="text-xs text-muted-foreground mb-2">
                        Other suggestions:
                      </p>
                      <div className="space-y-1">
                        {result.matches.slice(1, 3).map((match, i) => (
                          <p
                            key={i}
                            className="text-xs text-muted-foreground truncate"
                          >
                            • {match.product.name} ($
                            {match.product.retail_price.toFixed(2)})
                          </p>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowResults(false)}>
            Back to Edit
          </Button>
          <Button onClick={addAllMatched}>Add All Matched Items</Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Add Multiple Items</CardTitle>
        <CardDescription>
          Enter product names and quantities. We'll search our catalog and
          suggest matches.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {rows.map((row) => (
            <div key={row.id} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input
                  placeholder="Product name"
                  value={row.name}
                  onChange={(e) => updateRow(row.id, "name", e.target.value)}
                  data-testid={`input-item-name-${row.id}`}
                />
                <Input
                  type="number"
                  min={1}
                  placeholder="Qty"
                  value={row.quantity}
                  onChange={(e) =>
                    updateRow(row.id, "quantity", parseInt(e.target.value) || 1)
                  }
                  data-testid={`input-item-qty-${row.id}`}
                />
                <Input
                  placeholder="Brand (optional)"
                  value={row.brand}
                  onChange={(e) => updateRow(row.id, "brand", e.target.value)}
                  data-testid={`input-item-brand-${row.id}`}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
                data-testid={`button-remove-row-${row.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addRow}
          className="w-full"
          data-testid="button-add-row"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Row
        </Button>

        <Separator />

        <Button
          onClick={processRows}
          disabled={searching || rows.every((r) => !r.name.trim())}
          className="w-full"
          data-testid="button-process-rows"
        >
          {searching ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          {searching ? "Searching..." : "Search & Match"}
        </Button>
      </CardContent>
    </Card>
  );
}
