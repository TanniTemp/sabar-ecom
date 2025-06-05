"use client"
import { supabase } from '@/lib/supabaseClient'
import { Product } from '@/types/product'
import React, { useEffect, useState } from 'react'


function Page() {
    const [products, setProducts] = useState<Product[]>([])
 

  useEffect(() => {
    async function fetchProducts() {
        const { data, error } = await supabase
        .from('product')
        .select('*')
        .eq('status', 'active');
      
      if (error) {
        console.error('Fetch error:', error);
      } else {
        setProducts(data || []);
       
      }
      
    }
    fetchProducts()
  }, [])
 
console.log(products)
 

  return (
    <div className='flex items-center justify-center flex-col gap-10 p-10'>
        dalla
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>Price: ${product.price}</p>
          {/* Render images, variants, etc. */}
        </div>
      ))}
    </div>
  )
}

export default Page
