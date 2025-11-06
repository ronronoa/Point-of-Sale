import axios from "axios";
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import EditUsers from "../../components/pos/users/EditUsers";
import RemoveUser from "./RemoveUser";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
      setTotalUsers(res.data.length);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Show
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            entries
          </span>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1} to {Math.min(endIndex, totalUsers)} of {totalUsers} entries
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
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
                  className="px-6 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentUsers.map((user, index) => (
              <tr key={index} className="divide-x divide-gray-700">
                <td className="px-6 py-4 text-sm dark:text-gray-100">
                  {user.first_name}
                </td>
                <td className="px-6 py-4 text-sm dark:text-gray-100">
                  {user.last_name}
                </td>
                <td className="px-6 py-4 text-sm dark:text-gray-100">
                  {user.address}
                </td>
                <td className="px-6 py-4 text-sm dark:text-gray-100">
                  {new Date(user.date_registered).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm dark:text-gray-100">
                  <div className="flex items-center justify-center gap-2">
                    <EditUsers user={user} onUpdated={fetchUsers} />
                    <RemoveUser userId={user.user_id} onUserRemoved={fetchUsers}/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4 p-2">
        {currentUsers.map((user, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {user.address}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <EditUsers user={user} onUpdated={fetchUsers} />
                  <RemoveUser userId={user.user_id} onUserRemoved={fetchUsers}/>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Date Registered:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {new Date(user.date_registered).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1} to {Math.min(endIndex, totalUsers)} of {totalUsers} entries
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronsLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`min-w-[2.5rem] px-3 py-2 text-sm rounded-md border ${
                currentPage === page
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronsRight size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            No users found
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            There are no users to display at the moment.
          </p>
        </div>
      )}
    </div>
  );
}