import React from 'react'
import Link from 'next/link';
import Image from "next/image";
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { IoEllipsisHorizontal } from "react-icons/io5"; 
import { FaEllipsisVertical } from "react-icons/fa6";

const navbar = () => {
    
    const router = useRouter();
    let [open, setOpen] = useState(false);
    
    const openNavbar = () => {
      if (open == false){
        setOpen(true)
      } else {
        setOpen(false)
      }
    }

    const handleLogout = () => {
        localStorage.clear()
        alert('Logout Berhasil!');
      
        setTimeout(() => { 
            router.push('/login');
        }, 2000)
    }

  return (
    <div
      className='shadow w-full fixed flex items-center justify-center z-50 h-[70px] md:h-[100px] lg:h-[80px] xl:h-[80px]'
      style={{
        backgroundColor: '#F9FEF6',
      }}
    >
      <div className='w-full xl:w-[1280px]'>
        <div className='w-full md:flex items-center justify-between py-4 md:px-10 px-7'>

          {/* Logo */}
          <div onClick={()=>openNavbar()} className='font-bold text-2xl cursor-pointer flex items-center gap-2 z-50'>
            <Link href="/">
                <Image
                    className="rounded-xl px-4"
                    src={'/logo-horizontal.png'}
                    width={500}
                    height={500}
                    style={{ height: '48px', width: 'auto' }}
                    alt="Book"
                />
            </Link>
          </div>

          {/* Menu icon */}
          <div onClick={()=>openNavbar()} className='absolute right-8 top-5 cursor-pointer md:hidden w-7 h-7 flex justify-center items-center hover:bg-[#003566] duration-300 rounded-3xl'>
            {
              open ? <IoEllipsisHorizontal/> : <FaEllipsisVertical/>
            }
          </div>

          {/* Linked items */}
          <div 
            className={`
              md:flex md:items-center md:pb-0 absolute md:static 
              left-0 w-full z-0
              md:w-auto md:pl-0
              ${open ? 'top-16' : 'top-[-490px]'}
              bg-[#F9FEF6]
            `}
          >
            <div className='text-xl mx-8 md:mx-0 mt-6 md:items-center md:text-center md:gap-4 flex flex-col md:flex-row md:ml-8 md:my-0 font-semibold'>
                <div onClick={handleLogout} className='hover:bg-gray-200 md:hover:bg-gray-200 rounded-full py-2 px-8 md:px-4 md:mb-0 text-[#003566] hover:text-[#26a9e1] duration-500 flex justify-center items-center gap-2'>
                  <div className='text-body1' >Logout</div>
                </div>
            </div>
            <hr/>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default navbar