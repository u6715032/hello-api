import { NextResponse } from "next/server";
import { getClientPromise } from "@/lib/mongodb";

export async function GET() {
  const client = await getClientPromise();
  const db = client.db("sample_mflix");

  const data = await db
    .collection("comments")
    .find({})
    .limit(5)
    .toArray();

  return NextResponse.json(data);
}
