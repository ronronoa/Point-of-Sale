import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TotalRevenueCard() {
  const [revenue, setRevenue] = useState(0);
  const [year, setYear] = useState("");

  const fetchRevenue = async () => {
    const res = await axios.get("http://localhost:5000/api/sales/total-revenue", {
      params: { year },
    });
    setRevenue(res.data.total_revenue);
  };

  useEffect(() => {
    fetchRevenue();
  }, [year]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Total Revenue</h2>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">All Years</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>
      <p className="text-2xl font-bold text-green-600">
        ₱{Number(revenue).toLocaleString()}
      </p>
    </div>
  );
}
