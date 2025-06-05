"use client"
import { Menu, ShoppingBag, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


function Nav() {
  const[shop ,setShop] = React.useState(false);
  console.log(shop);
  return (
    <div className='w-full  z-10 absolute top-0 over  text-white bg-black flex items-center justify-between md:px-6 md:py-2 py-1 '>
        {/* logo */}
       <div className=' '>
      <Link href={"/"}><Image  src={"/Group1.png"} alt="logo" width={110} height={75} className='md:w-[150px] md:h-[55px]' /></Link>
       </div>
         {/* menu */}
       <div className=' flex items-center gap-6 font-semibold '>
        
            <div className='md:flex hidden items-center gap-6'>
                <Link href={'/'} className='cursor-pointer'>Home</Link>
                <div onClick={()=>setShop(true)} className='cursor-pointer'>shop</div>
                <Link href={""} className='cursor-pointer'>About</Link>
                <Link  href={"/contact"} className='cursor-pointer'>Contact</Link>
            
        </div>
        {/* icons */}
        <div className='flex items-center gap-6 pr-3 md:pr-0'>
            <Link href={"/"}  className=''><ShoppingBag  className='md:h-6 md:w-6 h-6 w-6' /></Link>
            <Link href={"/"}  className=' md:flex hidden '><User className='h-5 w-5 md:h-6 md:w-6'/></Link>
            <Link href={"/"}  className='cursor-pointer flex md:hidden'>
                <Menu className='h-6 w-6' />
            </Link>
        </div>

       </div>
    </div>
  )
}

export default Nav