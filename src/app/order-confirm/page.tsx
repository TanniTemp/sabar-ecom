"use client"


import Image from 'next/image';
import React, { useEffect, useState } from 'react'

function ThankyouPage() {
    const [searchParams, setSearchParams] = useState<URLSearchParams>();
      useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setSearchParams(params);
      }, []);
    const order_id = searchParams?.get("orderId") || "";
    useEffect(() => {
        if (!order_id) {
            console.error("No order ID found in URL parameters.");
        } else {
            console.log("Order ID:", order_id);
        }
    }, [order_id]);

  

return (
    <div className='w-[100vw] flex  pt-50 justify-center pb-50'>
      <div className='flex flex-col items-center justify-center gap-4 bg-white text-black p-6 rounded-3xl shadow-lg'>
      <Image
                        src={"/Group1.png"}
                        alt="logo"
                        width={110}
                        height={75}
                        className="md:w-[150px] md:h-[55px]"
                      />
        <h1 className='text-3xl font-bold'>Thank You!</h1>
        <p className="text-lg md:text-2xl text-center max-w-md mx-auto leading-relaxed">Your order has been placed successfully.</p>
        <p className='text-md md:text-xl gap-4'>Order ID: <span className='text-blue-400'> {order_id}</span></p>
            
        

      </div>
    </div>
  )
}

export default ThankyouPage