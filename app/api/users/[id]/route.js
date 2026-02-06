import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getClientPromise } from "@/lib/mongodb";
import { cors } from "@/lib/cors";

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const client = await getClientPromise();
    const db = client.db("sample_mflix");

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    );

    return cors(NextResponse.json(result));
  } catch (err) {
    return cors(
      NextResponse.json({ error: err.message }, { status: 500 })
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const client = await getClientPromise();
    const db = client.db("sample_mflix");

    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(params.id),
    });

    return cors(NextResponse.json(result));
  } catch (err) {
    return cors(
      NextResponse.json({ error: err.message }, { status: 500 })
    );
  }
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}
