import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  return NextResponse.json(
    { message: "hello world" },
    { headers: corsHeaders }
  );
}

