import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center flex-col gap-2">
        <img src="/undraw_page-eaten_b2rt.svg" alt="Not Found" className='w-64 object-cover'/>
        <h2 className="text-lg md:text-3xl font-bold">
          Not Found
        </h2>
        <NavLink
        to='/'
        className="px-4 py-2 rounded-full bg-[#032f30] cursor-pointer text-white hover:scale-105 transition duration-200 group flex"
        >
          <span className='opacity-0 group-hover:opacity-100 transition duration-200'><ChevronLeft /></span>
          <span className='-translate-x-2 group-hover:translate-x-0 transition duration-200'>Back to Landing Page</span>
        </NavLink>
      </div>
    </div>
  )
}
