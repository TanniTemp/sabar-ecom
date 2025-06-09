"use client";
import { supabase } from "@/lib/supabaseClient";
import Categories from "@/types/Categories";
import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<Record<string, Product[]>>({});
const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
const scroll = (category: string, direction: "left" | "right") => {
  const ref = scrollRefs.current[category];
  if (ref) {
    ref.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  }
};

  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    const categories = Object.keys(Categories);
  
    const fetchProducts = async () => {
      const results = await Promise.all(
        categories.map(async (cat) => {
          const { data } = await supabase
            .from("product")
            .select("*")
            .eq("category", cat)
            .order("ordered_count", { ascending: false })
            .limit(10);
          return { category: cat, data: data || [] };
        })
      );
  
      const categorizedProducts: Record<string, Product[]> = {};
      results.forEach(({ category, data }) => {
        categorizedProducts[category] = data;
      });
  
      setProducts(categorizedProducts);
      console.log("Fetched Products:", categorizedProducts); 
      setLoading(false);
    };
  
    fetchProducts();
  }, []);
  

 


  return (
    <div className="w-full min-h-screen overflow-x-hidden relative ">
      <div className="min-h-screen  bg-cover bg-center   bg-[url('/hero.png')] grid grid-rows-2">
        <div></div>
        <div className="flex flex-col items-center  gap-10">
          <div
            className="md:text-8xl text-4xl font-semibold text-white px-14 py-4 md:border-10 border-5 rounded-full border-white"
          >
            Fresh Drops
          </div>
          <Link
            href={"/category/tshirt"}
            className="md:text-4xl text-2xl text-black font-semibold bg-[#ffffff] md:px-14 md:py-4 px-4 py-2 mt-4 border-10 rounded-full border-white"
          >
            SHOP NOW
          </Link>
        </div>
      </div>

      {/* product list */}
      <div className="w-full min-h-[80vh] justify-center py-4 gap-10 flex flex-col">
{/* trying scaleable approach */}
<div>
{Object.entries(Categories).map(([key, label]) => (
  <div key={key}>
    {/* Header with title and scroll buttons */}
    <div className="bg-white md:p-4 p-2 md:px-7 shadow-md flex items-center justify-between text-black">
      <h1 className="tracking-wider md:text-2xl font-semibold">{label}</h1>
      <div className="flex items-center justify-center gap-1 md:gap-3">
        <button onClick={() => scroll(key, "left")} className="cursor-pointer">
          <ChevronLeft className="md:h-10 md:w-10" />
        </button>
        <button onClick={() => scroll(key, "right")} className="cursor-pointer">
          <ChevronRight className="md:h-10 md:w-10" />
        </button>
      </div>
    </div>

    {/* Product list */}
    {loading ? (
      <div className="w-full h-60 flex items-center justify-center">
        <span className="animate-spin rounded-full border-4 border-t-transparent border-white w-10 h-10"></span>
      </div>
    ) : (
      <div
        ref={(el) => {
          scrollRefs.current[key] = el;
        }}
        className="flex overflow-x-auto no-scrollbar gap-4 p-4"
      >
        {products[key]?.map((product: Product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="flex flex-col items-start justify-start gap-4 text-white hover:text-black rounded-3xl p-4 hover:bg-gray-50 transition duration-300"
          >
            {(product.images?.length ?? 0) > 0 && (
              <div className="md:w-[220px] md:h-[180px] w-[140px] h-[100px] rounded-2xl overflow-hidden relative">
                <Image
                  src={(product.images ?? [])[0]?.url || ""}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col items-start justify-start gap-1 md:gap-0">
              <h2 className="md:text-lg text-xs font-semibold">{product.name}</h2>
              <p className="md:text-lg text-xs opacity-45 line-through">
                ₹{product.price * 2}
              </p>
              <p className="md:text-lg text-xs font-semibold">
                ₹{product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
))}

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
