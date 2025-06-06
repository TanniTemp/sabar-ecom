"use client";
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { BreadcrumbWithDropdown } from '@/components/BreadcrumbWithDropdown';
import Link from 'next/link';
import Image from 'next/image';
import { DropdownMenuRadioGroupDemo } from '@/components/DropdownMenuRadioGroupDemo';

export default function Page() {
  const { category } = useParams() as { category: string };
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [filter, setFilter] = useState<string>('Popularity'); // Filter state

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
  
      let query = supabase
        .from("product")
        .select("*")
        .eq("category", category);
  
      if (filter === "Popularity") {
        query = query.order("ordered_count", { ascending: false });
      } else if (filter === "Price: Low to High") {
        query = query.order("price", { ascending: true });
      } else if (filter === "Price: High to Low") {
        query = query.order("price", { ascending: false });
      } else if (filter === "Newest") {
        query = query.order("created_at", { ascending: false });
      }
  
      const { data: productData } = await query.limit(20);
      setData(productData || []);
      setLoading(false);
    };
  
    if (category) fetchProducts();
  }, [category, filter]);

  console.log(filter)

  return (
    <div className="w-full pt-[100px] no-scrollbar min-h-screen overflow-x-hidden relative p-10">
      <BreadcrumbWithDropdown category={category} />
    <div className='flex justify-between items-center'>
    <h1 className="md:text-3xl text-xl mt-3 font-bold mb-6">
        {category.charAt(0).toUpperCase() + category.slice(1)}s
      </h1>
      <div>
       <DropdownMenuRadioGroupDemo selectedFilter={filter} setSelectedFilter={setFilter} />
      </div>
    </div>

      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <span className="animate-spin rounded-full border-4 border-t-transparent border-white w-10 h-10"></span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {data.map((product) => (
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
      )}
    </div>
  );
}
