
"use client"
import Map from '@/components/Map';
import Link from 'next/link'
import React from 'react'

function Page() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const sumbitform = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = {
            firstName,
            lastName,
            phone,
            email,
            message
        };
       console.log(formData);

       setFirstName('');
         setLastName('');
         setPhone('');
            setEmail('');
            setMessage('');
            setLoading(false);
        alert('Form submitted successfully!');

    };

  return (
    <div className="w-full pt-[100px] no-scrollbar min-h-screen overflow-x-hidden relative p-10">

        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:px-15 md:py-4 '>
            {/* contact details */}
            <div className='flex flex-col items-start justify-start p-3  md:gap-15 gap-8'>
            <h1 className='md:text-6xl text-3xl font-semibold'>Contact Us</h1>
            <p className='md:text-xl'>Email, Call or complete the form to learn how we at <span className='font-semibold'>Sabar</span> can solve your queries</p>
            <div className='md:text-lg  flex flex-col items-start justify-start gap-2'>
                <Link href="mailto:" >info@sabar.store</Link>
                <a href="tel:+918766224039">Call/Whatsapp: +91 8766224039</a>
            </div>
            <div className='grid md:grid-cols-2 gap-10 md:gap-20 mt-10'>
                <div className='flex flex-col items-start justify-start gap-2'>
                    <h1 className='md:text-xl font-semibold'>Costumer Support</h1>
                    <p>Our support team is available around the clock to address any concern or queries you may have.</p>
                </div>
                <div className='flex flex-col items-start justify-start gap-2'  >
                    <h1  className='md:text-xl font-semibold'>Feedback and Sugggestions</h1>
                    <p>We value your Feedback and are continously working to improve Sabar. Your input is crucial in shaping the future of sabar</p>
                </div>
            </div>
            </div>
            {/* contact form */}
            <div >
                <form className='flex flex-col items-start bg-white text-black justify-start gap-4 md:p-15 p-6 rounded-4xl shadow-md'>
                    <h1 className='md:text-4xl text-lg font-semibold'>Get in Touch</h1>
                    <h2 className='md:text-2xl opacity-50 font-semibold'>You can reach us anytime</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'> 
                        <input onChange={(e)=>setFirstName(e.target.value)} type="text" placeholder='First Name' className='border-2 border-gray-300 pl-3 py-1 rounded-3xl text-lg' />
                        <input onChange={(e)=>setLastName(e.target.value)} type="text" placeholder='Last Name' className='border-2 border-gray-300 pl-3 py-1 rounded-3xl text-lg' />
                    </div>
                    <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='@Your mail' className='border-2 border-gray-300 pl-3 py-1 rounded-3xl text-lg w-full' />
                    <input onChange={(e)=>setPhone(e.target.value)} type="tel" placeholder='+91 | Phone number' name="number" id="number" className='border-2 border-gray-300 pl-3 py-1 rounded-3xl text-lg w-full' />
                    <textarea onChange={(e)=>setMessage(e.target.value)}  placeholder='How can we help you?' rows={5} maxLength={250} className='border-2 border-gray-300  rounded-3xl resize-none text-lg w-full p-3 ' />
                    <button onClick={sumbitform} type="submit" className='mx-auto cursor-pointer text-lg p-2 w-[90%] rounded-3xl mt-3  bg-blue-500 text-white rounde-3xl' >{loading? <div>loading</div> : <div>submit</div>}</button>
                </form>
            </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:px-15 md:py-4 pt-[80px] md:pt-[150px] '>
            <div>
               <Map/>
            </div>
            <div className=' flex flex-col gap-8'>
                <h2 className='flex md:text-3xl text-lg font-light '>Our Location</h2>
                <h1 className='flex md:text-5xl text-2xl font-semibold'>Operational Address</h1>
                <div className='md:text-xl'>
                    <p>Sabar Store</p>
                    <p>7th street 181,</p>
                    <p>Brijpuri,</p>
                    <p>Delhi-110094,</p>
                    <p>INDIA</p>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default Page