import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export default function SalesOverviewChart() {
  const [salesData, setSalesData] = useState([]);
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const today = new Date().toISOString().split("T")[0];
  const minDate = "2025-01-01";

  const fetchData = async () => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await axios.get("http://localhost:5000/api/sales", { params });

      const formattedData = res.data.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-CA"),
        total: parseFloat(item.total_sales) || 0,
      }));

      setSalesData(formattedData);
    } catch (error) {
      console.error("Failed to fetch sales data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <div className="flex gap-2 mt-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={minDate}
            max={today}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                      bg-white text-gray-700"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={minDate}
            max={today}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                      bg-white text-gray-700"
          />
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={salesData}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: "5px",
              }}
            />
            <Bar
              dataKey="total"
              fill="#4C763B"
              radius={[6, 6, 0, 0]}
              barSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
