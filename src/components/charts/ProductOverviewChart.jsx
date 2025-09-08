import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#38BDF8", "#6366F1", "#A855F7", "#F472B6", "#F59E0B"];

export default function ProductOverviewChart() {
  const chartData = [
    { category: "Beverages", stock: 100 },
    { category: "Snacks", stock: 100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Tooltip />
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
