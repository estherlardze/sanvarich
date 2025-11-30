import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import type { Order } from "../../lib/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data as Order[]);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, items, total, status, shipping_address } = body;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id,
          items,
          total,
          status: status || "pending",
          shipping_address,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data as Order, { status: 201 });
  } catch (err) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
