import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EditUsers from '../../components/pos/users/EditUsers'
import RemoveUser from './RemoveUser'

export default function ArchivedUser() {
    const [users, setUsers] = useState([])

    const fetchArchivedUser = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users/archived')
            setUsers(res.data)
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    }

    useEffect(() => {
        fetchArchivedUser()
    }, [])

  return (
    <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead>
              <tr>
                {[
                  "First Name",
                  "Last Name",
                  "Address",
                  "Date Registered",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-3 md:px-6 py-2 md:py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
    
            <tbody className="divide-y divide-gray-700">
              {users.map((user, index) => (
                <tr key={index} className="divide-x divide-gray-700">
                  <td className="px-3 md:px-6 py-2 text-xs dark:text-gray-100 hidden md:table-cell">
                    {user.first_name}
                  </td>
                  <td className="px-3 md:px-6 py-2 text-xs dark:text-gray-100 hidden md:table-cell">
                    {user.last_name}
                  </td>
                  <td className="px-3 md:px-6 py-2 text-xs dark:text-gray-100 hidden md:table-cell">
                    {user.address}
                  </td>
                  <td className="px-3 md:px-6 py-2 text-xs dark:text-gray-100 hidden md:table-cell">
                    {new Date(user.date_registered).toLocaleDateString()}
                  </td>
                  <td className="px-3 md:px-6 py-2 text-xs dark:text-gray-100 hidden md:table-cell">
                    <div className="flex items-center justify-center gap-2">
                      <EditUsers user={user} onUpdated={fetchArchivedUser} />
                      <RemoveUser userId={user.user_id} onUserRemoved={fetchArchivedUser}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  )
}
