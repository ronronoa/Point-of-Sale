import axios from "axios";
import React, { useEffect, useState } from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card"
import { CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis, Line, Tooltip } from "recharts";

export default function SalesOverviewChart() {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sales");
        const formattedData = res.data.map((item) => ({
          date: new Date(item.sale_date).toLocaleDateString(),
          total: Number(item.total_sales),
        }));
        setSalesData(formattedData);
      } catch (error) {
        console.error("Failed to fetch sales data: ", error);
      }
    };
    fetchData();
  }, []);

  const chartData = [
    { month: "January", beverages: "Coca Cola", sales: "20" },
    { month: "Febuary", snack: "Piatos", sales: "50" },
  ];
  return (
  <Card>
    <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardContent>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart width={400} height={300} data={salesData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis />
                    <Tooltip contentStyle={{
                        fontSize: 12,
                        borderRadius: "5px"
                    }}/>
                    <Line type="monotone" dataKey="total" stroke="#92c7b0" strokeWidth={2} dot={{ fill: "#92c7b0", strokeWidth: 2, r: 4}} activeDot={{r:6, strokeWidth: 2}}/>
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
    </CardHeader>
  </Card>
)
}
