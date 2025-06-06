"use client";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const scrollRefTee = useRef<HTMLDivElement>(null);
  const scrollRefHoodie = useRef<HTMLDivElement>(null);
  const [tshirts, setTshirts] = useState<Product[]>([]);
  const [hoodies, setHoodies] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollTee = (direction: "left" | "right") => {
    if (scrollRefTee.current) {
      scrollRefTee.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };
  const scrollHoodies = (direction: "left" | "right") => {
    if (scrollRefHoodie.current) {
      scrollRefHoodie.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      const { data: tshirtData } = await supabase
        .from("product")
        .select("*")
        .eq("category", "tshirt")
        .order("ordered_count", { ascending: false })
        .limit(10);

      const { data: hoodieData } = await supabase
        .from("product")
        .select("*")
        .eq("category", "hoodie")
        .order("ordered_count", { ascending: false })
        .limit(10);

      setTshirts(tshirtData || []);
      setHoodies(hoodieData || []);
      setLoading(false);
    };

    fetchProducts();
  }, []);
  console.log(tshirts, hoodies);

  return (
    <div className="w-full min-h-screen overflow-x-hidden relative ">
      <div className="min-h-screen  bg-cover bg-center   bg-[url('/hero.png')] grid grid-rows-2">
        <div></div>
        <div className="flex flex-col items-center  gap-10">
          <Link
            href={""}
            className="md:text-8xl text-4xl font-semibold text-white px-14 py-4 md:border-10 border-5 rounded-full border-white"
          >
            Fresh Drops
          </Link>
          <Link
            href={""}
            className="md:text-4xl text-2xl text-black font-semibold bg-[#ffffff] md:px-14 md:py-4 px-4 py-2 mt-4 border-10 rounded-full border-white"
          >
            SHOP NOW
          </Link>
        </div>
      </div>

      {/* product list */}
      <div className="w-full min-h-[80vh] justify-center py-4 gap-10 flex flex-col">
        {/* tshirt */}
        <div>
          <div className="bg-white md:p-4 p-2 md:px-7 shadow-md flex items-center justify-between text-black">
            <h1 className="tracking-wider md:text-2xl font-semibold">
              T-shirts
            </h1>
            <div className="flex items-center justify-center gap-1 md:gap-3">
              <button
                onClick={() => scrollTee("left")}
                className="cursor-pointer"
              >
                {" "}
                <ChevronLeft className="  md:h-10 md:w-10" />{" "}
              </button>
              <button
                onClick={() => scrollTee("right")}
                className="cursor-pointer"
              >
                <ChevronRight className="  md:h-10 md:w-10" />
              </button>
            </div>
          </div>
          {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <span className="animate-spin rounded-full border-4 border-t-transparent border-white w-10 h-10"></span>
        </div>
      ) :(
          <div
            ref={scrollRefTee}
            className="flex overflow-x-auto no-scrollbar gap-4 p-4"
          >
            {tshirts &&
              tshirts.length > 0 &&
              tshirts!.map((tshirt: Product) => (
                <Link
                  key={tshirt.id}
                  href={`/product/${tshirt.slug}`}
                  className="flex  flex-col items-start justify-start gap-4 text-white hover:text-black rounded-3xl p-4 hover:bg-gray-50 transition duration-300"
                >
                  {tshirt.images && tshirt.images.length > 0 && (
                    <div className="md:w-[220px] md:h-[180px] w-[140px] h-[100px] rounded-2xl overflow-hidden relative">
                      <Image
                        src={tshirt.images[0].url}
                        alt={tshirt.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-col items-start justify-start gap-1 md:gap-0 ">
                    <h2 className="md:text-lg text-xs flex   font-semibold">
                      {tshirt.name}
                    </h2>
                    <p className="md:text-lg text-xs  opacity-45 line-through ">
                      ₹{tshirt.price * 2}
                    </p>
                    <p className="md:text-lg text-xs font-semibold  ">
                      ₹{tshirt.price}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
      )}
        </div>
        

        {/* hoodies */}
        <div>
          <div className="bg-white md:p-4 p-2 md:px-7 shadow-md flex items-center justify-between text-black">
            <h1 className="tracking-wider md:text-2xl font-semibold">
              Hoodies
            </h1>
            <div className="flex items-center justify-center gap-1 md:gap-3">
              <button
                onClick={() => scrollHoodies("left")}
                className="cursor-pointer"
              >
                {" "}
                <ChevronLeft className="  md:h-10 md:w-10" />{" "}
              </button>
              <button
                onClick={() => scrollHoodies("right")}
                className="cursor-pointer"
              >
                <ChevronRight className="  md:h-10 md:w-10" />
              </button>
            </div>
          </div>
          {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <span className="animate-spin rounded-full border-4 border-t-transparent border-white w-10 h-10"></span>
        </div>
      ) :(
          <div
            ref={scrollRefHoodie}
            className="flex overflow-x-auto no-scrollbar gap-4 p-4"
          >
            {hoodies &&
              hoodies.length > 0 &&
              hoodies!.map((hoodie: Product) => (
                <Link
                  key={hoodie.id}
                  href={`/product/${hoodie.slug}`}
                  className="flex  flex-col items-start justify-start gap-4 rounded-3xl p-4 hover:bg-gray-50 text-white hover:text-black transition duration-300"
                >
                  {hoodie.images && hoodie.images.length > 0 && (
                    <div className="md:w-[220px] md:h-[180px] w-[140px] h-[100px] rounded-2xl overflow-hidden relative">
                      <Image
                        src={hoodie.images[0].url}
                        alt={hoodie.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-col items-start justify-start gap-1 md:gap-0 ">
                    <h2 className="md:text-lg text-xs flex   font-semibold">
                      {hoodie.name}
                    </h2>
                    <p className="md:text-lg text-xs opacity-45 line-through ">
                      ₹{hoodie.price * 2}
                    </p>
                    <p className="md:text-lg text-xs font-semibold  ">
                      ₹{hoodie.price}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
      )}
        </div>
      </div>
      <div className="min-h-screen bg-cover bg-center bg-[url('/home-about.png')] grid grid-rows-2 text-center p-10 gap-10">
        <h1 className="md:text-7xl text-5xl font-bold mx-auto my-auto">
          About सबर
        </h1>
        <p className="max-w-xl md:text-xl font-semibold mx-auto my-auto">
          “Welcome to Sabar, where timeless elegance meets modern
          sophistication. Each garment embodies impeccable craftsmanship and a
          commitment to quality and sustainability. Elevate your style with
          Sabar and embrace a legacy of excellence in every thread.”
        </p>
      </div>
      <div className=" min-h-screen  bg-cover bg-center bg-[url('/sabar-bg-image.png')] grid grid-rows-2 text-center p-10 gap-10">
        <div className="flex flex-col items-center gap-10 justify-center">
          <h1 className="text-5xl md:text-7xl  font-bold text-[#F3C500]">
            सबर: एक पहल🌻
          </h1>
          <h2 className=" text-sm md:text-lg font-semibold">
            “WE BELIVE IN GOOD CAUSE NOT CHARITY”
          </h2>
        </div>
        <div>
          <p className="flex flex-wrap max-w-xl md:text-xl  mx-auto items-center justify-center">
            Sabar-Ek Pehel is a initiative where we put 5% of our profit’s aside
            for free meals for those people who can’t even afford one meal a
            day.
            <span className="font-semibold">
              “Make a difference with every purchase”{" "}
            </span>{" "}
            You’re not just getting a great product you’re also helping to
            provide free meals for people who can’t even afford one meal a day.
            It’s a small way to make a big impact!”
          </p>
        </div>
      </div>
    </div>
  );
}
