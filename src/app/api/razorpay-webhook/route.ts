import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event;

  if (event === "payment.captured") {
    const paymentId = payload.payload.payment.entity.id;
    const orderId = payload.payload.payment.entity.order_id;

    // 🔄 Match Razorpay order ID in your DB and update the record
    const { error } = await supabase
      .from("orders")
      .update({ status: "paid", payment_id: paymentId })
      .eq("razorpay_order_id", orderId); // or match however you're storing it

    if (error) {
      console.error("Supabase update failed:", error);
      return new NextResponse("DB update failed", { status: 500 });
    }
  }

  if (event === "payment.failed") {
    const orderId = payload.payload.payment.entity.order_id;

    await supabase
      .from("orders")
      .update({ status: "failed" })
      .eq("razorpay_order_id", orderId);
  }

  return NextResponse.json({ success: true });
}
