"use client";
import { useAuth } from "@/components/AuthProvder";
import { supabase } from "@/lib/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function UserProfile() {
  const user = useAuth();
  const router = useRouter();
    const handleLogout = async () => {
   
      await supabase.auth.signOut()
  router.push( '/');
  
    }
  if (!user) {
    return (
      <div className="flex items-center pt-50 justify-center min-h-screen">
        <p className="text-lg">Please log in to view your profile.</p>
      </div>
    );
  }
  console.log(user);

  return (
    <div className="w-full pt-[100px] no-scrollbar min-h-screen overflow-x-hidden relative py-10 px-3 md:px-10 ">
     <div className=" max-w-screen-md mx-auto flex flex-col justify-between min-h-[60vh] ">
     <div className="text-xl ">
        {user.user?.email}
      </div>

   <div className="flex flex-col gap-4 mt-4">
   <Link href="/orders" className="text-lg text-blue-500 hover:underline">
        Orders
      </Link>
      <Link href="/cart" className="text-lg text-blue-500 hover:underline">
       Cart
      </Link>
      <Link href="/about" className="text-lg text-blue-500 hover:underline">
        About
      </Link>
      <Link href="/" className="text-lg text-blue-500 hover:underline">
        Home
      </Link>
      <Link href="/contact" className="text-lg text-blue-500 hover:underline">
        Contact Us
      </Link>
     

   </div>
      <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-[#F3C500] text-black font-extrabold tracking-wide text-2xl rounded">
        Logout

      </button>
    </div>
     </div>
  );
}

export default UserProfile;
