import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";

const COLORS = ["#4e79a7", "#f28e2c", "#e15759", "#59a14f", "#edc949"];

export default function ProductOverviewChart() {
  const [categoryData, setCategoryData] = useState([])
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chart/categories")
        setCategoryData(res.data)
      } catch (error) {
        console.error("Error Fetching Categories:", error)
      }
    }
    fetchCategories()
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Tooltip contentStyle={{
              fontSize: 12,
              borderRadius: "10px",
              backgroundColor: "#f0f0f0",
            }}/>
            <Pie
              data={categoryData}
              dataKey="stock"
              nameKey="category"
              cx="50%"
              cy="50%"
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              fontSize={12}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend 
            iconType="circle"
            wrapperStyle={{fontSize: 12}}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
