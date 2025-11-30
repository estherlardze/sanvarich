import { NextResponse } from "next/server";

export async function GET() {
  // Return only public supabase config values safe for client consumption
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
  });
}
