import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import type { ProductVariant } from "../../lib/schema";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("product_variants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return variants grouped by product_id for easier client consumption
    const variantsByProduct: Record<string, ProductVariant[]> = {};
    for (const variant of data as ProductVariant[]) {
      if (!variantsByProduct[variant.product_id]) {
        variantsByProduct[variant.product_id] = [];
      }
      variantsByProduct[variant.product_id].push(variant);
    }

    return NextResponse.json(variantsByProduct);
  } catch (err) {
    console.error("Error fetching variants:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
