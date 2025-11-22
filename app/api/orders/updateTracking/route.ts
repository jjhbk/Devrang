import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req: Request) {
  try {
    const { id, trackingNumber } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("devrang");

    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          trackingNumber: trackingNumber || "",
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating tracking number:", error);
    return NextResponse.json(
      { error: "Failed to update tracking number" },
      { status: 500 }
    );
  }
}
