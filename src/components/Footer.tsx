
import { Copyright } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <div className='flex w-full bg-black text-white flex-col md:py-4 md:px-10 gap-6 py-2'>
        <div className='flex justify-between items-center'>
            {/* logo */}
                <div className='-ml-4'>
                    <Image src={"/Group1.png"} alt="logo" 
                    height={180} width={180} 
                     className="w-[180px] h-[60px] md:w-[280px] md:h-[82px]" />
                </div>
            {/* instaHandle */}
            <div className='pr-4 md:text-xl'>
                <Link href={"/"} className='flex items-center gap-3 font-semibold'>
                    <Image src={"/insta.png"} alt="logo" width={20} height={20} /> @Sabar
                </Link>
            </div>


        </div>
           {/* second section */}
        <div className='grid md:grid-cols-2 px-4 md:text-lg text-sm gap-6' >
                {/* menu */}
                <div className='grid grid-cols-2'>
                    {/* navigation */}
                    <div className='flex flex-col gap-1 '>
                        <Link href={""} className=' '>Shop</Link>
                        <Link href={""} className=' '>Home</Link>
                        <Link href={""} className=' '>About</Link>
                        <Link href={""} className=' '>Contact</Link>
                    </div>

                    {/* policies */}
                    <div className='flex flex-col gap-1 mt-1 md:mt-0 '>
                        <Link href={""} className=''>Privacy Policy </Link>
                        <Link href={""} className=''>Terms and Conditions</Link>
                        <Link href={""} className=''>Return Policy</Link>
                        <Link href={""} className=''>Shipping Policy</Link>
                    </div>

                </div>

                {/* payment trust */}

                <div className='flex flex-col items-center md:items-start gap-4'>
                <h1 className='md:text-lg tracking-wide '>Pay Using <span className='md:font-semibold font-bold'>Razorpay </span>100% secure payments</h1>
                <Image src={"/razorpay.svg"} alt="logo" width={200} height={50} className='w-[200px] h-[50px]' />

                </div>
        </div>
        <div className='h-1 w-full bg-white' />

        <div>
            <p className='text-sm flex items-center justify-center gap-2 tracking-wide mx-auto opacity-65'>
                All Rights reserved <Copyright className='h-4 w-4 ' /> 2025 <span className='font-semibold'>Sabar</span>
            </p>
        </div>
        
    </div>
 
  )
}

export default Footer