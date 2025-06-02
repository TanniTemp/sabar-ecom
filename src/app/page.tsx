
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative ">

      <div className="min-h-screen  bg-cover bg-center   bg-[url('/hero.png')] grid grid-rows-2">
      <div></div>
      <div className="flex flex-col items-center  gap-10"><Link href={""} className="md:text-8xl text-4xl font-semibold text-white px-14 py-4 md:border-10 border-5 rounded-full border-white">
        Fresh Drops
      </Link>
      <Link href={""} className="md:text-4xl text-2xl text-black font-semibold bg-[#ffffff] md:px-14 md:py-4 px-4 py-2 mt-4 border-10 rounded-full border-white">
        SHOP NOW
      </Link></div>
      </div>
      <div className="min-h-screen bg-cover bg-center bg-[url('/home-about.png')] grid grid-rows-2 text-center p-10 gap-10">
        <h1 className="md:text-7xl text-5xl font-bold mx-auto my-auto">About सबर</h1>
        <p className="max-w-xl md:text-xl font-semibold mx-auto my-auto">“Welcome to Sabar, where timeless elegance meets modern sophistication. Each garment embodies impeccable craftsmanship and a commitment to quality and sustainability. Elevate your style with Sabar and embrace a legacy of excellence in every thread.”</p>
      </div>
      <div className=" min-h-screen  bg-cover bg-center bg-[url('/sabar-bg-image.png')] grid grid-rows-2 text-center p-10 gap-10">
      <div className="flex flex-col items-center gap-10 justify-center"> 
        <h1 className="text-5xl md:text-7xl  font-bold text-[#F3C500]">सबर: एक पहल🌻</h1>
        <h2 className=" text-sm md:text-lg font-semibold">“WE BELIVE IN GOOD CAUSE NOT CHARITY”</h2>
      </div>
      <div>
        <p className="flex flex-wrap max-w-xl md:text-xl  mx-auto items-center justify-center">Sabar-Ek Pehel is a initiative where we put 5% of our profit’s aside for free meals for those people who can’t even afford one meal a day.

        <span className="font-semibold">“Make a difference with every purchase” </span> You’re not just getting a great product you’re also helping to provide free meals for people who can’t even afford one meal a day. It’s a small way to make a big impact!”

</p>
      </div>
      </div>
    </div>
  );
}
