"use client";
import Gallery from "@/components/Gallery";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/product";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { MapPin, Minus, Plus, Ruler, Truck, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { toast } from "sonner";

export default function Page() {
  const params = useParams();
  const [iconSize, setIconSize] = useState<"medium" | "large">("medium");
  const [ratingGap, setRatingGap] = useState("6px");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectQuantity, setSelectedQuantity] = useState<number>(1);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const slug = params.product;
  const router = useRouter();
  const [products, setProducts] = React.useState<Product>({} as Product);
  const [buyNowLoading,setBuyNowLoading] = useState(false)

  const [loading, setLoading] = React.useState(true);
  const Shipping = [
    "Orders will be delivered within 5 to 7 business days.",
    "Returns and exchanges are available within 10 days from the delivery date.",
    "For non-serviceable areas, self-ship the product to our warehouse and refunds will be processed after QC inspection.",
    "For any queries, please contact our customer support team.",
    "All items bought using red tab points during sale will not be applicable for Returns/Exchange",
  ];
 

  
  useEffect(() => {
    const handleResize = () => {
      setIconSize(window.innerWidth < 768 ? "medium" : "large");
      setRatingGap(window.innerWidth < 768 ? "3px" : "8px");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    const fetchProducts = async () => {
      const { data: productData } = await supabase
        .from("product")
        .select("*")
        .eq("slug", slug)
        .single();
      setProducts(productData || []);
      const { data: similarProductsData } = await supabase
        .from("product")
        .select("*")
        .overlaps("tags", productData?.tags || [])
        .neq("slug", slug)
        .limit(4);
      setSimilarProducts(similarProductsData || []);

      setLoading(false);
      setSelectedColor(productData?.variants?.[0]?.color || null);
    };

    fetchProducts();
  }, [slug]);

    
      const handleBuyNow = () => {
        setBuyNowLoading(true)
        if(!selectedSize){
         toast.error("Please select a size before adding to cart.");
          setBuyNowLoading(false)
          return
        }
        const params = new URLSearchParams({
          size: selectedSize!,
          slug: products.slug,
          quantity: selectQuantity.toLocaleString(),
          color: selectedColor,
          mode:"buyNow"
        })
        setBuyNowLoading(false)
        router.push(`/checkout?${params.toString()}`)
      }
  const handleCart=()=>{
      if(!selectedSize){
        alert("select size");
        return
      }
      
    }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="w-full pt-[100px] no-scrollbar min-h-screen overflow-x-hidden relative py-10 px-3 md:px-10 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-screen-xl mx-auto">
        <div>
          <Gallery
            image={(products.images || []).map((image) => ({
              ...image,
              alt: image.alt || "",
              is_primary: image.is_primary ?? false,
            }))}
          />
        </div>
        <div className="flex flex-col  p-3 gap-6 ">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold w-full  md:text-3xl text-xl tracking-wider">
              {products.name}
            </h1>
            <div className="flex items-center -ml-2  gap-2">
              <Stack spacing={1}>
                <Rating
                  name="half-rating-read"
                  defaultValue={products.rating || 0}
                  precision={0.1}
                  value={products.rating || 0}
                  readOnly
                  size={iconSize}
                  sx={{
                    color: "#f3c600",

                    "& .MuiRating-iconFilled": {
                      color: "#f3c600", // Color for filled stars
                    },
                    "& .MuiRating-iconEmpty": {
                      color: "#e0e0e0", // Color for empty stars
                    },
                    display: "flex",
                    gap: ratingGap, // Add gap between stars
                    padding: "4px", // Optional padding inside border
                  }}
                />
              </Stack>
              <div className="text-gray-500 text-sm md:text-lg gap-2  flex items-center justify-start">
                <p className="">({products.reviews_count})</p>
                <button className="  underline cursor-pointer">
                  Write a review
                </button>
              </div>
            </div>

            <div className="text-md md:text-xl gap-3 font-semibold  flex">
              <div className=" text-gray-500 font-normal  line-through">
                ₹{products.original_price ?? 0}
              </div>{" "}
              <div>₹{products.price ?? 0}</div>{" "}
              <div className="bg-[#E68C8C] text-xs md:text-sm flex items-center justify-center px-2  ">
                {products.original_price
                  ? Math.round(
                      ((products.original_price - (products.price ?? 0)) /
                        products.original_price) *
                        100
                    )
                  : 0}
                % OFF
              </div>
            </div>
          </div>
          <div>
            <span className="bg-gray-300 text-black px-2 py-1">
              {" "}
              MRP inclusive of all taxes
            </span>
          </div>
          <div className="text-[#FFCF00] text-sm md:text-lg">
            Exclusive offers on new season
          </div>

          <div className="flex flex-col gap-5">
            <div className=" normal-case gap-2 flex items-center justify-start">
              Colour :{" "}
              <span className="font-semibold text-gray-500">
                {selectedColor || "Select a color"}
              </span>
            </div>
            <div className="flex gap-5">
              {products.variants?.map((variant, idx) => {
                const isOutOfStock = Object.values(variant.sizes || {}).every(
                  (qty) => qty === 0
                );

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!isOutOfStock) {
                        setSelectedColor(variant.color);
                      }
                    }}
                    className={`w-12 h-12 rounded-full cursor-pointer flex items-center justify-center
            ${
              selectedColor === variant.color
                ? "border-blue-500 border-4"
                : "border-white border-2"
            }
            ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}
          `}
                    style={{ backgroundColor: variant.hex || variant.color }}
                  >
                    {isOutOfStock && (
                      <span className="text-white text-xs font-bold">X</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-1 w-full bg-white rounded-2xl" />
          {selectedColor && (
            <div className="flex flex-col gap-5">
              <div className=" normal-case gap-2 flex items-center justify-between">
                <div>
                  Size :{" "}
                  <span className="font-semibold text-gray-500">
                    {selectedSize || "Select a size"}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-400 flex gap-1 items-center">
                    <Ruler color="#1f4bff" className="w-4 h-4" /> Size guide
                  </span>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                {products.variants?.find(
                  (variant) => variant.color === selectedColor
                )?.sizes &&
                  Object.entries(
                    products.variants.find(
                      (variant) => variant.color === selectedColor
                    )?.sizes || {}
                  ).map(([size, qty]) => {
                    const isOutOfStock = qty === 0;
                    return (
                      <button
                        key={size}
                        disabled={isOutOfStock}
                        onClick={() => {
                          if (!isOutOfStock) {
                            setSelectedSize(size);
                          }
                        }}
                        className={`md:px-4 px-2 md:py-2 py-1 border-2 flex items-center justify-center h-10 w-10 rounded-2xl text-sm
                ${
                  selectedSize === size
                    ? "border-blue-500 font-semibold"
                    : "border-gray-300"
                }
                ${
                  isOutOfStock
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
                      >
                        {size.toUpperCase()}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>Select Qunatity:</div>
            <div className="grid grid-cols-6  gap-2 items-cente md:font-bold md:text-2xl">
              <button
                onClick={() => setSelectedQuantity(selectQuantity - 1)}
                disabled={selectQuantity <= 1}
                className="cursor-pointer  bg-white h-12 w-12  rounded-2xl  flex items-center justify-center"
              >
                <Minus color="black" />
              </button>
              <div className="flex items-center text-xl font-bold col-span-4 justify-center">
                {selectQuantity}
              </div>
              <button
                onClick={() => setSelectedQuantity(selectQuantity + 1)}
                className="cursor-pointer bg-white h-12 w-12 rounded-2xl flex items-center justify-center"
              >
                <Plus color="black" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:gap-5 z-[1000] fixed md:relative bottom-0 left-0 right-0">
          
               <button onClick={()=> handleBuyNow()} className="bg-white text-black cursor-pointer  uppercase md:rounded-2xl py-3 font-bold tracking-wider text-xl">
            {buyNowLoading?"Loading....":"Buy Now"}
            </button>
           
           
            <button onClick={()=>handleCart()} className="bg-[#f6c330] cursor-pointer  uppercase md:rounded-2xl py-3 font-extrabold tracking-wide text-xl">
              Add to Bag
            </button>
          </div>
          {/* this bottom div is child i want to give negative margin */}
          <div className="bg-white text-black rounded-3xl -ml-6 text-xs md:px-3 w-[100vw] md:w-full md:m-0 py-5 grid grid-cols-3">
            <div className="flex flex-col items-center justify-center gap-2">
              <Truck color="#000000" className="" />
              <p>Cash on Delivery</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <Zap color="#000000" />
              <p>Ships in 24-48 hrs</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <MapPin color="#000000" />
              <p>Priority Shipping</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl flex items-start justify-start flex-col gap-5 mt-10 mx-auto">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg md:text-2xl">Description</h1>
          <p className=" text-sm md:text-md text-gray-400">
            {products.description ||
              "No description available for this product."}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-lg md:text-2xl">Fit and Sizing</h1>
          <ol className="list-decimal pl-5 text-sm md:text-md text-gray-400">
            {(products.fit?.length >= 1 &&
              products.fit.map((fit, index) => <li key={index}>{fit}</li>)) ||
              " No fit instructions available for this product."}
            <p className="text-white">
              --please use size guide for better fit--
            </p>
          </ol>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-lg md:text-2xl">Composition and Care</h1>
          <ol className="list-decimal pl-5 text-sm md:text-md text-gray-400">
            {(products.care?.length >= 1 &&
              products.care.map((care, index) => (
                <li key={index}>{care}</li>
              ))) ||
              " No care instructions available for this product."}
          </ol>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-lg md:text-2xl">Shipping and Return</h1>
          <div>
            <ol className="list-decimal pl-5 text-sm md:text-md text-gray-400">
              {Shipping.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="h-1 w-full max-w-screen-xl mx-auto bg-white my-10" />
      <div className="flex flex-col gap-10">
      <div className="w-full max-w-screen-xl mx-auto flex items-start justify-start flex-col gap-5 ">
        <h1 className="mx-auto md:text-2xl uppercase font-semibold tracking-wide">
          You may Also Like
        </h1>
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.length > 0 &&
              similarProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex flex-col items-start justify-start gap-4 rounded-3xl p-4 hover:bg-gray-50 text-white hover:text-black transition duration-300"
                >
                  {product.images && product.images.length > 0 && (
                    <div className="md:w-[220px] md:h-[180px] w-[140px] h-[100px] rounded-2xl overflow-hidden relative">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-col items-start justify-start gap-1 md:gap-0">
                    <h2 className="md:text-lg text-xs flex font-semibold">
                      {product.name}
                    </h2>
                    <p className="md:text-lg text-xs opacity-45 line-through ">
                      ₹{product.price * 2}
                    </p>
                    <p className="md:text-lg text-xs font-semibold">
                      ₹{product.price}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* dont forget to work on this :-) */}

      {/* <div className="w-full max-w-screen-xl  mx-auto flex items-center justify-center flex-col gap-5 ">
        <h1 className="mx-auto md:text-2xl font-semibold tracking-wide uppercase">
          Recently viewed 
        </h1>
        <div>
          <div className="flex items-center justify-center mx-auto gap-6">
            {similarProducts.length > 0 &&
              similarProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex flex-col items-start justify-start gap-4 rounded-3xl p-4 hover:bg-gray-50 text-white hover:text-black transition duration-300"
                >
                  {product.images && product.images.length > 0 && (
                    <div className="md:w-[220px] md:h-[180px] w-[140px] h-[100px] rounded-2xl overflow-hidden relative">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-col items-start justify-start gap-1 md:gap-0">
                    <h2 className="md:text-lg text-xs flex font-semibold">
                      {product.name}
                    </h2>
                    <p className="md:text-lg text-xs opacity-45 line-through ">
                      ₹{product.price * 2}
                    </p>
                    <p className="md:text-lg text-xs font-semibold">
                      ₹{product.price}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div> */}
      </div>
    </div>
  );
}
