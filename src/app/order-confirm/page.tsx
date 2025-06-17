"use client"

import React, { useEffect, useState } from 'react'

function ThankyouPage() {
    const [searchParams, setSearchParams] = useState<URLSearchParams>();
      useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setSearchParams(params);
      }, []);
    const order_id = searchParams?.get("orderId") || "";

return (
    <div className='w-[100vw] min-h-screen flex items-center justify-center'>
        thanks you brother
        {order_id}
    </div>
  )
}

export default ThankyouPage