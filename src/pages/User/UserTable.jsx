import React, { useEffect } from "react";

export default function UserTable() {
  return (
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
              className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
            >
              {header}
            </th>
          ))}

          <tbody>
            <td className="hidden md:table-cell px-6 py-4 text-sm font-medium dark:text-gray-100">
                
            </td>
          </tbody>
        </tr>
      </thead>
    </table>
  );
}
