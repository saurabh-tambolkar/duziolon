'use client'
import { usePathname } from 'next/navigation';
import React from 'react'

function Footer() {

    let url = usePathname();


  return (
   <div className={`bg-white ${ url.includes('admin') ? "hidden" : "block" } border-t-2 border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.15)] mt-12 pt-6`}>
    <div className="grid grid-cols-1 md:grid-cols-4 place-items-center">
      <div>Duziolon</div>
      <div>Drip</div>
      <div>Bottoms</div>
      <div>Footwear</div>
    </div>
    <p className='text-center text-gray-500 text-sm mt-4'>Duziolon @ copyright 2025</p>
   </div>
  );
}

export default Footer;
