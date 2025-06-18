import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! )

export async function POST(req: NextRequest) {
  try {
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
    const payment = payload.payload.payment.entity;
    const paymentId = payment.id;
    const orderId = payment.order_id;
    
    console.log("Received order_id from Razorpay:", orderId); // 🔍 Debug log
    
    if (!orderId) {
      console.error("❌ order_id is undefined or null in Razorpay payload", payload);
      return new NextResponse("order_id missing", { status: 400 });
    }
    

    if (event === "payment.captured") {
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: "PAID",
          order_status: "CONFIRMED",
          payment_id: paymentId,
        })
        .eq("order_id", orderId);
    

      if (error) {
        console.error("Supabase update failed:", error);
        return new NextResponse("DB update failed", { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (event === "payment.failed") {
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: "FAILED",
          order_status: "CANCELLED",
        })
        .eq("razorpay_order_id", orderId);

      if (error) {
        console.error("Supabase update failed on failure:", error);
        return new NextResponse("DB update failed", { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true }); // for unsupported events
  } catch (err) {
    console.error("Unhandled error in webhook:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
