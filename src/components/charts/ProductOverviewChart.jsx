import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0a7075", "#0c969c", "#A855F7", "#F472B6", "#F59E0B"];

export default function ProductOverviewChart() {
  const chartData = [
    { category: "Beverages", stock: 100 },
    { category: "Snacks", stock: 100 },
    { category: "Desserts", stock: 100 },
    { category: "Breads", stock: 100 },
  ];

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
              data={chartData}
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
              {chartData.map((entry, index) => (
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
