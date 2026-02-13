import { cors } from "@/lib/cors";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getClientPromise } from "@/lib/mongodb";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";


// ======================
// GET PROFILE
// ======================
export async function GET(request, context) {
  const { id } = await context.params;

  const client = await getClientPromise();
  const db = client.db("sample_mflix");

  const user = await db.collection("users").findOne({
    _id: new ObjectId(id),
  });

  return cors(NextResponse.json(user));
}


// ======================
// UPDATE PROFILE + IMAGE
// ======================
export async function PUT(request, context) {
  const { id } = await context.params;

  const client = await getClientPromise();
  const db = client.db("sample_mflix");

  const formData = await request.formData();

  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const email = formData.get("email");
  const file = formData.get("image");

  let imagePath = null;

  // If image uploaded
  if (file && file.size > 0) {

    // Allow ONLY image types
    if (!file.type.startsWith("image/")) {
      return cors(
        NextResponse.json(
          { error: "Only image files allowed" },
          { status: 400 }
        )
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = file.name.split(".").pop();
    const randomName = crypto.randomUUID() + "." + extension;

    const uploadPath = path.join(
      process.cwd(),
      "public/uploads",
      randomName
    );

    await writeFile(uploadPath, buffer);

    imagePath = "/uploads/" + randomName;
  }

  const updateData = {
    firstname,
    lastname,
    email,
  };

  if (imagePath) {
    updateData.profileImage = imagePath;
  }

  await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  return cors(NextResponse.json({ message: "Profile updated" }));
}
