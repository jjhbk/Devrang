import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      customer,
    } = body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { status: "invalid-signature" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("devrang");

    await db.collection("orders").updateOne(
      { order_id: razorpay_order_id },
      {
        $set: {
          payment_id: razorpay_payment_id,
          status: "paid",
          items,
          customer,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Payment verification failed:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
