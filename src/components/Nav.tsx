"use client";
import {

  ChevronDown,
 
  Mail,
  Menu,
  Plus,
  ShoppingBag,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import Categories from "@/types/Categories";

import { supabase } from "@/lib/client";


function Nav() {
  const [nav, setnav] = React.useState(false);


  const handleLogout = async () => {
 
    await supabase.auth.signOut()
    window.location.href = '/'

  }
  return (
    <div>
      <div className="w-full  z-[9999] absolute top-0 over  text-white bg-black flex items-center justify-between md:px-6 md:py-2 py-1 ">
        {/* logo */}
        <div className=" flex">
          <Link href={"/"}>
            <Image
              src={"/Group1.png"}
              alt="logo"
              width={110}
              height={75}
              className="md:w-[150px] md:h-[55px]"
            />
          </Link>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded">
      Logout
    </button>
        </div>
        {/* menu */}
        <div className=" flex items-center gap-6  font-semibold ">
          <div className="md:flex hidden  items-center gap-6">
            <Link href={"/"} className="cursor-pointer">
              Home
            </Link>
            <div className="cursor-pointer group    relative select-none flex gap-1 items-bottom justify-bottom ">
              Shop <ChevronDown />
              <div className="absolute top-[100%] py-6 hidden w-50 group-hover:block z-10 left-0 border-x-1 border-b-1 border-white bg-black text-white px-4 pt-4 rounded shadow-lg transition-all duration-900 ease-in-out ">
               
              {Object.entries(Categories).map(([key, label]) => (
                <Link
                  key={key}
                  href={`/category/${key}`}
                className="block  border-b-2 mb-2 border-gray-300"
                >
                  {label}
                </Link>
              ))}
              
              </div>
            </div>
            <Link href={""} className="cursor-pointer">
              About
            </Link>
            <Link href={"/contact"} className="cursor-pointer">
              Contact
            </Link>
          </div>
          {/* icons */}
          <div className="flex items-center gap-6 pr-3 md:pr-0">
            <Link href={"/"} className="">
              <ShoppingBag className="md:h-6 md:w-6 h-6 w-6" />
            </Link>
            <Link href={"/"} className=" md:flex hidden ">
              <User className="h-5 w-5 md:h-6 md:w-6" />
            </Link>
            <button
              onClick={() => setnav(!nav)}
              className="cursor-pointer flex md:hidden"
            >
              {nav ? (
                <Plus className="h-6 rotate-45 w-6 rounded-full bg-gray-500 flex items-center justify-center " />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* mobile menu */}
      {nav && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={nav ? { y: 0 } : { y: "-100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 text-2xl left-0 w-full h-screen bg-black text-white px-5 flex justify-center font-extrabold flex-col z-[9997]"
        >
         <div className="flex gap-2 flex-col items-start justify-start">
         <Link onClick={() => setnav(false)} href={"/"} className="cursor-pointer mb-4">
            Home
          </Link>
          <div className="mb-4 flex flex-col items-start justify-start gap-3">
            <div>
              Shop 
            </div>
          <ul  className="flex flex-col items-start text-xl justify-start gap-2 p-2 px-6 rounded-xl list-disc  w-[50vw]"> 
      
              {
                Object.entries(Categories).map(([key, label]) => (
                  <li key={key} className="cursor-pointer hover:text-gray-400">
                    <Link onClick={() => setnav(false)} href={`/category/${key}`}>
                      {label}
                    </Link>
                  </li>
                ))
              }
      
          </ul>
          </div>
          <Link onClick={() => setnav(false)} href={""} className="cursor-pointer mb-4">
            About
          </Link>
          <Link href={"/contact"} onClick={() => setnav(false)} className="cursor-pointer mb-4">
            Contact
          </Link>
         </div>
         <div className="w-full h-[3px] bg-white my-3"/>
         <div onClick={() => setnav(false)} className="flex items-center gap-4 ">Profile
          <User className="h-5 w-5 rounded-full bg-gray-400 p-[2px]" /> 
         </div>
         <div className="flex flex-col w-full items-end pt-4">  
            <div className='pr-4 text-lg'>
                <Link href={"/"} className='flex items-center gap-3 font-semibold'>
                    <Image src={"/insta.png"} alt="logo" width={20} height={20} /> @Sabar
                </Link>
            </div>
            <Link href="mailto:info@sabar.store" className="flex gap-2 items-center justify-center text-lg">
              <Mail className="h-5 w-5" />info@sabar.store
            </Link>
           </div>
        </motion.div>
      )}
    </div>
  );
}

export default Nav;
