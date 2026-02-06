import { NextResponse } from "next/server";
import { getClientPromise } from "@/lib/mongodb";
import { cors } from "@/lib/cors";

export async function GET() {
  try {
    const client = await getClientPromise();
    const db = client.db("sample_mflix");

    const users = await db
      .collection("users")
      .find({})
      .project({ password: 0 })
      .toArray();

    return cors(NextResponse.json(users));
  } catch (err) {
    return cors(
      NextResponse.json({ error: err.message }, { status: 500 })
    );
  }
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}
