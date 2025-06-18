"use client";

import { useAuth } from "@/components/AuthProvder";
import { supabase } from "@/lib/supabaseClient";

import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { Product } from "@/types/product"; // Adjust the import path based on your project structure

interface checkoutItems extends Product {
  quantity: number;
  size: string;
  color: string;
}

function CheckoutPage() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams(params);
  }, []);
  const slug = searchParams?.get("slug") || "";
  const size = searchParams?.get("size") || "";
  const quantity = searchParams?.get("quantity") || "";
  const color = searchParams?.get("color") || "";
  const mode = searchParams?.get("mode") || "";
  const [products, setProducts] = useState<checkoutItems[]>([]);

  const [paymentMethod, setPaymentMethod] = useState<string>("razorpay");

  const [name, setName] = useState("tanishk");
  const [email, setEmail] = useState("er.tanishkdhaka@gmail.com");
  const [phone, setPhone] = useState("9315484690");
  const [street, setStreet] = useState("d-58");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("gzb");
  const [state, setState] = useState("uttar");
  const [zip, setZip] = useState("201102");
  const { user } = useAuth();
  const router = useRouter();


  useEffect(() => {
    const fetchproduct = async () => {
      // const { data } = await supabase
      //   .from("addresses")
      //   .select("*")
      //   .eq("user_id", userId);
      // setAddress(data || []);
      //Address feature for some other day

      if (mode === "buyNow" && slug) {
        const { data } = await supabase
          .from("product")
          .select("*")
          .eq("slug", slug);

        if (data && data.length > 0) {
          setProducts([
            {
              ...data[0],
              size: size || "",
              color: color || "",
              quantity: Number(quantity) || 1,
            },
          ]);
        }
      } else if (mode === "cart") {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const slugs = cart.map((item: { slug: string }) => item.slug);
        if (slugs.length === 0) return;
        const { data } = await supabase
          .from("product")
          .select("*")
          .in("slug", slugs);
        if (!data) return;
        const enriched = cart.map(
          (cartItem: {
            slug: string;
            size: string;
            color: string;
            quantity: number;
          }) => {
            const product = data.find((p) => p.slug === cartItem.slug);
            return {
              ...product,
              size: cartItem.size,
              color: cartItem.color,
              quantity: cartItem.quantity,
            };
          }
        );
        setProducts(enriched);
      }
    };
    fetchproduct();
  }, [slug, size, quantity, color, mode]);

  const subtotal = products.reduce((acc, item) => {
    return acc + (item.price || 0) * (item.quantity || 1);
  }, 0);
  function isFormValid() {
    return (
      name.trim() &&
      email.trim() &&
      phone.trim().length === 10 &&
      street.trim() &&
      city.trim() &&
      state.trim() &&
      zip.trim()
    );
  }

  const shippingCost = paymentMethod === "razorpay" ? 0 : 100;
  const taxes = Math.round((subtotal / 100) * 18);
  async function loadRazorpayScript() {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
  const handlePlaceOrder = async () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields correctly.");
      return;
    }
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    const response = await fetch("/api/razorpay-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          name,
          email,
          phone,
          address: { street:street, landmark:landmark, city:city, state:state, zip:zip },
        },
        name,
        email,
        phone,
        address: {
          full_name: name,
          email: email,
          phone: phone,
          street: street,
          landmark: landmark,
          city: city,
          state: state,
          zip: zip,
        },
        user_id: user?.id,
        products,
        paymentMethod,
      }),
    });
    console.log(response);
    const data = await response.json();

    console.log(data);
    if (paymentMethod === "razorpay") {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: data.amount,
        currency: "INR",
        name: "Sabar",
        description: "Order Payment",
        order_id: data.order.id,
        prefill: { name, email, contact: phone },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          console.log(data);
          console.log("Payment successful:", response);

          router.push(`/order-confirm?orderId=${data.order.id}`);
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } else if (paymentMethod === "cod") {
      const codResponse = await fetch("/api/create-cod-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          address: {
            full_name: name,
            email: email,
            phone: phone,
            street: street,
            landmark: landmark,
            city: city,
            state: state,
            zip: zip,
          },
          products,
        }),
      });

      const codData = await codResponse.json();
      console.log(codData);
      if (codResponse.ok) {
        console.log("COD order placed:", codData.order);
        router.push(`order-confirm?orderId=${codData.order.id}`);
        // redirect to thank-you page or show confirmation
      } else {
        console.error("COD order failed:", codData.error);
        alert("Something went wrong while placing your COD order.");
      }
    }
  };

  return (
    <div className="flex md:flex-row flex-col md:p-10 gap-5 pt-[60px] w-full min-h-screen">
      <div className="flex flex-col  md:min-w-[60%]  p-10">
        <h1 className="text-2xl md:text-4xl">Shipping Address</h1>

        <div className="grid md:grid-cols-2 md:gap-3">
          <div className="flex flex-col pt-5">
            <div className="flex flex-col gap-1 md:gap-3 text-lg">
              <label htmlFor="fullName" className="px-3">
                Name*
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                className="bg-white focus:outline-none rounded-2xl p-2 md:p-3 px-5 text-black max-w-[400px]"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 md:gap-3">
          <div className="flex flex-col pt-2 md:pt-5 gap-6">
            <div className="flex flex-col md:gap-3 gap-1 text-lg">
              <label htmlFor="email" className="px-3">
                Email*
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                placeholder="johndoe@example.com"
                className="bg-white outline-none rounded-2xl md:p-3 px-5 p-2 text-black max-w-[400px]"
                required
              />
            </div>
          </div>
          <div className="flex flex-col pt-2 md:pt-5 gap-6">
            <div className="flex flex-col gap-1 md:gap-3 text-lg ">
              <label htmlFor="number" className="px-3">
                Phone Number*
              </label>
              <div className="flex max-w-[400px] rounded-2xl  bg-white text-black ">
                <span className=" border-r-2 border-black pr-2  flex items-center md:p-3 px-5 p-2  justify-center text-black h-full">
                  +91
                </span>
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="XXXXXXXXXX"
                  type="number"
                  id="number"
                  name="number"
                  maxLength={10}
                  className=" outline-none md:p-3 px-5 p-2 "
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col pt-2 md:pt-5 gap-6">
            <div className="flex flex-col gap-1 md:gap-3 text-lg">
              <label htmlFor="Street" className="px-3">
                Street*
              </label>
              <input
                onChange={(e) => setStreet(e.target.value)}
                type="text"
                id="Street"
                name="Street"
                placeholder="street 1"
                className="bg-white rounded-2xl md:p-3 px-5 p-2 text-black max-w-[700px]"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 md:gap-3">
          <div className="flex flex-col pt-2 md:pt-5 gap-6">
            <div className="flex flex-col gap-1 md:gap-3 text-lg">
              <label htmlFor="City" className="px-3">
                City*
              </label>
              <input
                onChange={(e) => setCity(e.target.value)}
                type="text"
                id="City"
                name="City"
                placeholder="City"
                className="bg-white rounded-2xl md:p-3 px-5 p-2 text-black max-w-[400px]"
                required
              />
            </div>
          </div>{" "}
          <div className="flex flex-col pt-2 md:pt-5 gap-6">
            <div className="flex flex-col gap-1 md:gap-3 text-lg">
              <label htmlFor="City" className="px-3">
                Landmark (Optional)
              </label>
              <input
                onChange={(e) => setLandmark(e.target.value)}
                type="text"
                id="City"
                name="City"
                placeholder="City"
                className="bg-white rounded-2xl md:p-3 px-5 p-2 text-black max-w-[400px]"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 md:gap-3">
          <div className="flex flex-col md:pt-5 gap-6 pt-2 ">
            <div className="flex flex-col md:gap-3 text-lg">
              <label htmlFor="City" className="px-3">
                State*
              </label>
              <input
                onChange={(e) => setState(e.target.value)}
                type="State"
                id="City"
                name="State"
                placeholder="State"
                className="bg-white rounded-2xl md:p-3 px-5 p-2 text-black max-w-[400px]"
                required
              />
            </div>
          </div>{" "}
          <div className="flex flex-col pt-2 md:pt-5 gap-6">
            <div className="flex flex-col md:gap-3 text-lg">
              <label htmlFor="City" className="px-3">
                Zip Code*
              </label>
              <input
                onChange={(e) => setZip(e.target.value)}
                type="State"
                id="City"
                name="State"
                placeholder="State"
                className="bg-white rounded-2xl md:p-3 px-5 p-2 text-black max-w-[400px]"
                required
              />
            </div>
          </div>
        </div>

        <div className="h-2 w-full bg-white my-6" />

        {/* select payment methoda */}
        <div className="flex flex-col gap-4 ">
          <label className="text-xl font-semibold">Select Payment Method</label>
          <div className="flex md:flex-row flex-col gap-6">
            <label className="flex items-center gap-4 cursor-pointer bg-white p-4 rounded-2xl flex-1 relative">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-black"
              />
              <Image
                src="/razorpay.svg"
                alt="Razorpay"
                height={40}
                width={120}
                className="object-contain"
              />
              <div className="absolute   bg-[#E68C8C] right-4 px-2 py-1 rounded-xl md:text-lg my-auto">
                ₹100 OFF
              </div>
            </label>

            <label className="flex items-center gap-4 cursor-pointer bg-white p-3 md:p-4 rounded-2xl flex-1">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-black"
              />
              <span className="text-black text-2xl lg:text-3xl font-semibold">
                Cash on Delivery
              </span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:border-2 w-full rounded-2xl  md:m-10 p-4">
        <h1 className="text-xl md:text-2xl">Your Cart</h1>
        <div className="flex flex-col gap-3 pt-10 w-full">
          {products.map((item, idx) => (
            <div key={idx} className="flex  w-full">
              <div className="flex gap-4 w-full">
                <div className="relative">
                  <Image
                    src={item.images?.[0]?.url || "/placeholder.png"}
                    alt={item.images?.[0]?.alt || "Product Image"}
                    height={90}
                    width={90}
                    className="rounded-2xl h-[60px] md:h-[90px] md:w-[90px] w-[60px]"
                  />
                  <div className="absolute bottom-[80%] right-0 bg-white text-black w-5 h-5 flex items-center justify-center text-sm rounded-full ">
                    {" "}
                    {item.quantity}
                  </div>
                </div>
                <div className="flex flex-col text-sm md:text-lg">
                  <div className=" md:text-xl ">{item.name}</div>
                  <div className="flex gap-3">
                    <div className="opacity-60">color:{color}</div>
                    <div className="opacity-60">size:{size}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                ₹{item.price}.00
              </div>
            </div>
          ))}
          <div className="h-2 w-full bg-white my-6" />

          {/* total price */}
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 text-xl md:text-2xl">
              <div>Subtotal</div>
              <div className="flex items-end justify-end">₹{subtotal}</div>
            </div>
            <div className="grid grid-cols-2 text-sm md:text-lg">
              <div>Shipping</div>
              <div className="flex items-end justify-end">₹{shippingCost}</div>
            </div>
            <div className="grid grid-cols-2 text-sm md:text-lg ">
              <div>Estimated Taxes</div>
              <div className="flex items-end justify-end">₹{taxes}</div>
            </div>
          </div>
          <div className="h-2 w-full bg-white my-6" />
          <div className="grid grid-cols-2 text-xl md:text-2xl">
            <div>Total</div>
            <div className="flex items-end justify-end">
              ₹{subtotal + shippingCost + taxes}
            </div>
          </div>

        {user?
            <button
            onClick={() => handlePlaceOrder()}
            className="w-full cursor-pointer  flex items-center justify-center bg-[#FFCF00] text-white py-3 rounded-2xl mt-3 text-2xl font-bold"
          >
            PAY NOW
          </button>
          :  <button
          onClick={() =>router.push("/login")}
          className="w-full cursor-pointer  flex items-center justify-center bg-[#FFCF00] text-white py-3 rounded-2xl mt-3 text-2xl font-bold"
        >
          PAY NOW
        </button>
        }
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
