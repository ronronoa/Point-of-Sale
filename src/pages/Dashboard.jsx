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
import {
  Box,
  DollarSign,
  PhilippinePeso,
  ShoppingBag,
  User,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats: ", error);
      }
    };
    fetchStats();
  }, []);
  return (
    <>
      <StatCard>
        <StatCardItem
          icon={<User className="text-blue-500" />}
          text="Total Users"
          value={stats.totalUsers}
          chartData={[
            { name: "Mon", value: 2 },
            { name: "Tue", value: 3 },
            { name: "Wed", value: 5 },
            { name: "Thu", value: 1 },
            { name: "Fri", value: 2 },
          ]}
        />
        <StatCardItem icon={<ShoppingBag />} text="Total Sales" value="1,524" />
        <StatCardItem
          icon={<Box />}
          text="Total Product"
          value={stats.totalProducts}
          chartData={[
            { name: "Jan", value: 982},
            { name: "Feb", value: 1200},
            { name: "March", value: 1892},
            { name: "Apr", value: 1652},
          ]}
        />
        <StatCardItem
          icon={<PhilippinePeso />}
          text="Total Revenue"
          value={stats.totalRevenue}
          chartData={[
            { name: "Jan", value: 982},
            { name: "Feb", value: 1200},
            { name: "March", value: 1892},
            { name: "Apr", value: 1652},
          ]}
        />
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
