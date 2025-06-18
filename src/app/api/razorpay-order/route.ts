
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! )
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { products ,user_id,address} = body;
  
  const subtotal = products.reduce((acc: number, item: { price: number; quantity: number }) => {
    return acc + item.price * item.quantity;
  }, 0);
  const taxes = Math.round(subtotal*0.18)
  const total = (subtotal  + taxes) * 100; // in paise

  const order = await razorpay.orders.create({
    amount: total,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
    payment_capture: true,
  });

  const { error } = await supabase
  .from("orders")
  .insert([{
    id:order.id,
    user_id: user_id,
    address:address,
    items: products.map((product: { name: string; price: number; quantity: number ,size:string,color:string,slug:string}) => ({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      size:product.size,
      slug:product.slug,
      color:product.color,
      

    })),
    total_amount: total / 100,
    currency: "INR",
    payment_method: "Razorpay",
    payment_status: "PENDING",
    order_status: "PLACED",
    payment_id: "", 
    
  }]);
      if (error) {
              console.error("Supabase insert error:", JSON.stringify(error, null, 2));

              return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
            }
  return NextResponse.json({ order, amount: total});
}
