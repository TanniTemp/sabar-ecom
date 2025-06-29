"use client"
import { useAuth } from '@/components/AuthProvder';
import { supabase } from '@/lib/supabaseClient';
import type Orders from '@/types/Orders';
import React, { useEffect } from 'react'

function Orders() {
    const [orders, setOrders] = React.useState<Orders[]>([]);
    const user = useAuth() ;
    useEffect(() => {
     if(user.user?.id) {
     
        const fetchOrders = async () => {
            const { data, error } = await supabase
            .from('orders')
            .select('*')
           
            .in('payment_status', ['PAID', 'COD'])
            .eq('user_id', user?.user?.id);
            
          
          console.log({ data, error });
          
          
          
            if (error) {
                console.error('Error fetching orders:', error);
            } else {
                setOrders(data || []);
            }
        };
        fetchOrders();}
    }, [user?.user?.id]);
    console.log(orders);
  return (
        <div className='w-[100vw] flex flex-col pt-[100px] p-3 max-w-screen-md mx-auto  min-h-[60vh]'>
         <h1 className='text-2xl md:text-3xl font-bold mb-6 text-center'>
            Orders
         </h1>
            <div className='flex flex-col gap-4'>
            {orders.map((order) => (
                <div key={order.id} className='p-4  shadow rounded'>
                    <h2 className='text-lg font-bold'>Order ID: {order.id}</h2>
                    <p className='text-sm'>Total Amount: ${order.total_amount}</p>
                    <p className='text-sm'>Payment Method: {order.payment_method}</p>
                    <p className='text-sm'>Status: {order.payment_status}</p>
                    <p className='text-sm'>Created At: {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
            ))}
            </div>
            </div>
  )
}

export default Orders