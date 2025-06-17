import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabaseClient";



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      user_id,
      address,
      products,
  
      currency = "INR",
    } = body;
   

    if (!user_id || !address || !products || !Array.isArray(products)) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const subtotal = products.reduce(
      (acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity,
      0
    );
    const taxes= Math.round(subtotal*0.18);

    const totalAmount = subtotal + taxes + 100;

    const { data, error } = await supabase.from("orders").insert([
      {
        user_id,
        address,
        items: products,
        total_amount: totalAmount,
        currency,
        payment_method: "COD",
        payment_status: "PENDING",
        order_status: "PLACED",
        payment_id: "", 
      },
    ]).select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data[0] });
  } catch (err) {
    console.error("Unhandled error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
