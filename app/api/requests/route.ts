import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import type { CustomRequest } from "../../lib/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("custom_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data as CustomRequest[]);
  } catch (err) {
    console.error("Error fetching requests:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, item_name, quantity, notes } = body;

    const { data, error } = await supabase
      .from("custom_requests")
      .insert([
        {
          user_id,
          item_name,
          quantity,
          notes,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data as CustomRequest, { status: 201 });
  } catch (err) {
    console.error("Error creating request:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
