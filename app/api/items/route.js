import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getClientPromise } from "@/lib/mongodb";

export async function GET(req) {
  const client = await getClientPromise();
  const db = client.db("itemdb");

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 5;
  const skip = (page - 1) * limit;

  const items = await db
    .collection("items")
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await db.collection("items").countDocuments();

  return NextResponse.json({ items, total });
}

export async function POST(req) {
  const body = await req.json();
  const client = await getClientPromise();
  const db = client.db("itemdb");

  const result = await db.collection("items").insertOne(body);
  return NextResponse.json(result);
}

export async function PUT(req) {
  const body = await req.json();
  const client = await getClientPromise();
  const db = client.db("itemdb");

  const { _id, ...data } = body;

  const result = await db.collection("items").updateOne(
    { _id: new ObjectId(_id) },
    { $set: data }
  );

  return NextResponse.json(result);
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const client = await getClientPromise();
  const db = client.db("itemdb");

  const result = await db.collection("items").deleteOne({
    _id: new ObjectId(id),
  });

  return NextResponse.json(result);
}
