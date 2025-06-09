"use client"
import { supabase } from '@/lib/supabaseClient';
import React from 'react'

function Page() {
  const[text,setText] = React.useState("Dashboard")
  const saveFeatures = async () => {
    const featuresArray = text.split("\n").filter(Boolean); // remove empty lines
    const damn =["summer","bold"]
  
    const { data, error } = await supabase
      .from("product")
      .select("*")
      .overlaps("tags",damn)
      // Assuming you want to update the product with id 1
    console.log(data, error)
   console.log(featuresArray)
  };
  return (
    <div className='flex min-h-screen pt-[80px] md:pt-[150px]'>
      <textarea
       
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 w-full max-w-md"
        placeholder="Enter features, one per line..."
      />
      <button
        onClick={saveFeatures}
        className="bg-blue-500 text-white px-4 py-2 ml-2"
      >
        Save Features
      </button>
    </div>
  )
}

export default Page