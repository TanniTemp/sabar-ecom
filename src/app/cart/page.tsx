"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { CircleCheck, Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItem {
  slug: string;
  size: string;
  color: string;
  quantity: number;
  price?: number;
  image?: string;
  name?: string;
}

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter()
   

  useEffect(() => {
    const loadCart = async () => {
      const rawCart = JSON.parse(localStorage.getItem("Sabarcart") || "[]");
      const slugs = rawCart.map((item: CartItem) => item.slug);

      if (slugs.length === 0) return;

      const { data: products } = await supabase
        .from("product")
        .select("slug, name, price, images")
        .in("slug", slugs);

      const enrichedCart = rawCart.map((item: CartItem) => {
        const product = products?.find((p) => p.slug === item.slug);
        return {
          ...item,
          price: product?.price,
          name: product?.name,
          image: product?.images?.[0]?.url || "/fallback.jpg",
        };
      });

      setCartItems(enrichedCart);
    };

    loadCart();
  }, []);
  function updateCartQuantity(
    slug: string,
    size: string,
    color: string,
    change: number
  ) {
    const updated = cartItems
      .map((item) => {
        if (item.slug === slug && item.size === size && item.color === color) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[]; // remove nulls (i.e., deleted items)

    setCartItems(updated);

    const minimalCart = updated.map(({ slug, size, color, quantity }) => ({
      slug,
      size,
      color,
      quantity,
    }));
    localStorage.setItem("Sabarcart", JSON.stringify(minimalCart));
  }
  function deleteFromCart(slug: string, size: string, color: string) {
    const updated = cartItems.filter(
      (item) =>
        !(item.slug === slug && item.size === size && item.color === color)
    );

    setCartItems(updated);

    const minimalCart = updated.map(({ slug, size, color, quantity }) => ({
      slug,
      size,
      color,
      quantity,
    }));

    localStorage.setItem("Sabarcart", JSON.stringify(minimalCart));
  }

  return (
    <div className="w-full pt-[100px] no-scrollbar min-h-[90vh] overflow-x-hidden relative py-10 md:px-10">
      <div className="flex gap-5 md:flex-row max-w-screen-lg mx-auto flex-col-reverse ">
        <div className=" lg:w-[50vw] md:w-[50vw] pt-10 md:pt-0 flex gap-3 flex-col  px-3 ">
          {cartItems.map((item, index) => (
            <div key={index} className="flex flex-col   w-full  mb-4">
              <div className="flex gap-6 ">
                <Image
                  height={80}
                  width={80}
                  src={item.image!}
                  alt={item.slug}
                  className="w-25 h-25 object-cover md:h-35 md:w-34 rounded-2xl"
                />

                <div className="flex flex-col">
                  <div className="grid w-full">
                    <div className="font-bold text-lg flex flex-wrap">
                      {item.name}
                    </div>
                    <div className="md:text-lg md:font-bold flex ">
                      ₹{item.price!*item.quantity}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>Size: {item.size}</div>
                    <div>Color: {item.color}</div>
                  </div>
                  <div className="flex pt-3   gap-3  ">
                    <div className=" flex gap-3 bg-white  px-2 py-1 rounded-2xl">
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.slug,
                            item.size,
                            item.color,
                            -1
                          )
                        }
                        className="cursor-pointer  bg-white h-6 w-6 rounded-[10%]  border-r-2 border-black  flex items-center justify-center"
                      >
                        {item.quantity == 1 ? (
                          <Trash2 color="black" className="h-4 w-4 m" />
                        ) : (
                          <Minus color="black" />
                        )}
                      </button>
                      <span className=" flex text-black items-center justify-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.slug,
                            item.size,
                            item.color,
                            1
                          )
                        }
                        className="cursor-pointer border-l-2 border-black  bg-white h-6 w-6 rounded-[10%]  flex items-center justify-center"
                      >
                        <Plus color="black" className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        deleteFromCart(item.slug, item.size, item.color)
                      }
                      className="text-blue-400 cursor-pointer font-semibold tracking-wide text-lg items-end justify-start flex"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-1/3 flex flex-col gap-8 px-4 rounded-xl shadow  h-fit">
          <div className="flex flex-col gap-4">
            <div className="text-lg flex flex-wrap  justify-between px-6 font-bold">
              <div>SubTotal ({cartItems.length} items):</div>
              <div className="">
                ₹
                {cartItems.reduce(
                  (acc, item) => acc + (item.price || 0) * item.quantity,
                  0
                )}
              </div>
            </div>
            <div className="flex px-6 text-[#08ae00] gap-3">
              <CircleCheck color="#08ae00" className="h-6 w-5" /> Free Shipping
              on prepaid orders
            </div>
          </div>
          <button onClick={()=>{
             const params = new URLSearchParams({
               
                mode:"cart"
              })
              router.push(`/checkout?${params.toString()}`);}} className="bg-[#FFCF00] font-semibold cursor-pointer w-full py-3 px-3 rounded-3xl text-2xl ">
            Prodceed to Buy
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
