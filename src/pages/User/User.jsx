import React, { useEffect } from 'react'
import AddUser from './AddUser'
import UserTable from './UserTable'

export default function User() {
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center border rounded-md p-2 md:p-4">
            <h2 className="text-lg md:text-3xl font-bold">Users</h2>
            <AddUser />
        </div>

        <div className='overflow-x-auto'>
           <UserTable />
        </div>
    </div>
  )
}
