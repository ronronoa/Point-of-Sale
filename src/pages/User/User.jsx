import React, { useEffect } from 'react'
import AddUser from './AddUser'
import UserTable from './UserTable'
import { NavLink } from 'react-router'
import { Archive } from 'lucide-react'

export default function User() {
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center border rounded-md p-2 md:p-4">
            <h2 className="text-lg md:text-3xl font-bold">Users</h2>
            <div className='flex gap-2 items-center'>
              <AddUser />
              <NavLink
              to='/archived'
              className='p-2 border rounded-md bg-[#034c4e]'
              >
                <Archive size={18} className='text-white'/>
              </NavLink>
            </div>
        </div>

        <div className='overflow-x-auto'>
           <UserTable />
        </div>
    </div>
  )
}
