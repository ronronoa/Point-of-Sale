import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

export default function StatCard({ children }) {

  return (
    <div className="flex-1 overflow-hidden relative">
      <main className="py-4 px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8 gap-5">
          {children}
        </div>
      </main>
    </div>
  );
}

// export function StatCardItem({ text, icon, value }) {
//   return (
//     <div className="font-bold border dark:border-[#1f1f1f] dark:bg-[#1e1e1e] p-4 rounded-md shadow-md">
//       <div className="px-4 py-5 sm:p-6">
//         <span className="flex items-center text-sm font-medium dark:text-gray-300">
//           <span className="mr-2">{icon}</span>
//           <span className="">{text}</span>
//         </span>
//         <p className="mt-2 text-xl font-bold">{value}</p>
//       </div>
//     </div>
//   );
// }

export function StatCardItem({ text, icon, value, chartData, color = "#3B82F6" }) {
  return (
    <div className="font-bold border dark:border-[#1f1f1f] dark:bg-[#1e1e1e] bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      {/* Title & Icon */}
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center text-sm font-medium dark:text-gray-300">
          <span className="mr-2">{icon}</span>
          {text}
        </span>
      </div>

      <p className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">
        {value}
      </p>

      <div className="h-20 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
