import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { items, customer, totalAmount, isSelf } = await req.json();

    if (!items || !customer || !Array.isArray(items)) {
      console.error("❌ Invalid request body:", { items, customer });
      return NextResponse.json(
        { error: "Invalid order request" },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials missing in environment");
    }

    // 🧠 Create Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const client = await clientPromise;
    const db = client.db("devrang");

    // ✅ FLOW 1: Self-booking
    if (isSelf) {
      const order = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: { type: "self-booking" },
      });

      await db.collection("orders").insertOne({
        order_id: order.id,
        items,
        customer,
        amount: totalAmount,
        currency: "INR",
        status: "created",
        createdAt: new Date(),
      });

      console.log("✅ Self order created:", order.id);
      return NextResponse.json({ order });
    }

    // ✅ FLOW 2: Generate Razorpay Payment Link for Customer
    console.log("🧾 Creating payment link for customer:", customer.name);

    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      accept_partial: false,
      description: `Payment for ${items.length} item(s)`,
      customer: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      notify: { sms: true, email: true },
      reminder_enable: true,
      notes: {
        items: JSON.stringify(items),
        createdBy: "AstroGems Dashboard",
      },
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/orders`,
      callback_method: "get",
    });

    // ✅ Save order to MongoDB
    const orderDoc = {
      order_id: paymentLink.id,
      items,
      customer,
      amount: totalAmount,
      currency: "INR",
      status: "link_created",
      paymentLink: paymentLink.short_url,
      createdAt: new Date(),
    };

    await db.collection("orders").insertOne(orderDoc);

    console.log("✅ Payment link created:", paymentLink.short_url);

    // ✅ Return the link to frontend
    return NextResponse.json({
      orderId: paymentLink.id,
      paymentLink: paymentLink.short_url,
    });
  } catch (err: any) {
    console.error("❌ Error creating Razorpay order/link:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
