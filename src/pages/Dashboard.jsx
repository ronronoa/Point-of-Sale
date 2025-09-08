import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import axios from "axios";
import SalesOverviewChart from "../components/charts/SalesOverviewChart";
import ProductOverviewChart from "../components/charts/ProductOverviewChart";
import StatCard, { StatCardItem } from "../components/Layout/StatCard";
import { Box, DollarSign, PhilippinePeso, ShoppingBag, User } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Today's Sales",
      value: "P2,543.67",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
    },
  ];

  return (
    <>
      <StatCard>
        <StatCardItem icon={<User />} text="Total Users" value="128,220" />
        <StatCardItem icon={<ShoppingBag />} text="Total Sales" value="1,524"/>
        <StatCardItem icon={<Box />} text="Total Product" value="20"/>
        <StatCardItem icon={<PhilippinePeso />} text="Total Revenue" value="₱20,232"/>
      </StatCard>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-3 space-y-4">
        <div className="px-4 lg:col-span-4">
          <SalesOverviewChart />
        </div>

        <div className="px-4 lg:col-span-2">
          <ProductOverviewChart />
        </div>
      </div>
    </>
  );
}
