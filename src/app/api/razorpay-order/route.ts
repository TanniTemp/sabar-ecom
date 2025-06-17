import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { products, taxes, shippingCost } = body;
  const subtotal = products.reduce((acc: number, item: any) => {
    return acc + item.price * item.quantity;
  }, 0);
  const total = (subtotal + taxes + shippingCost) * 100; // in paise

  const order = await razorpay.orders.create({
    amount: total,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
    payment_capture: true,
  });

  return NextResponse.json({ order, amount: total });
}
