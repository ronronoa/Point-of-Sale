import { useEffect, useState } from "react";
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
    totalSales: 0
  });

  const [salesChartData, setSalesChartData] = useState([])
  const [productChartData, setProductChartData] = useState([])
  const [userChartData, setUserChartData] = useState([])
  const [revenueChartData, setRevenueChartData] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats: ", error);
      }
    };

    const fetchChartData = async () => {
      try {
        const salesRate = await axios.get("http://localhost:5000/api/chart/sales")
        const formattedData = salesRate.data.map(item => ({
          ...item,
          name: new Date(item.name).toLocaleDateString('en-CA')
        }))
        setSalesChartData(formattedData)

        const productRes = await axios.get("http://localhost:5000/api/chart/products")
        setProductChartData(productRes.data)
      } catch (error) {
        console.error("Error fetching chart data:", error)
      }
    }

    const fetchRevenueChartData = async () => {
      try {
        const revenueData = await axios.get("http://localhost:5000/api/chart/revenues")
        const formattedData = revenueData.data.map(item => ({
          ...item,
          name: new Date(item.date).toLocaleDateString('en-CA')
        }))
        setRevenueChartData(formattedData)
      } catch (error) {
        console.error("Error fetching chart revenue:", error)
      }
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/chart')
        const formattedData = res.data.map(item => ({
          ...item,
          name: new Date(item.name).toLocaleDateString('en-CA')
        }))

        setUserChartData(formattedData)
      } catch (error) {
         console.error("Error fetching user chart data:", error);
      }
    }

    fetchStats();
    fetchUserData();
    fetchChartData();
    fetchRevenueChartData();
  }, []);
  return (
    <>
      <StatCard>
        <StatCardItem
          icon={<User className="text-blue-500" />}
          text="Total Users"
          value={stats.totalUsers}
          chartData={userChartData}
        />
        <StatCardItem 
        icon={<ShoppingBag className="text-orange-500"/>} 
        text="Total Sales" 
        value={stats.totalSales} 
        chartData={salesChartData}
        />
        <StatCardItem
          icon={<Box className="text-amber-500"/>}
          text="Total Product"
          value={stats.totalProducts}
          chartData={productChartData}
        />
        <StatCardItem
          icon={<PhilippinePeso className="text-green-500"/>}
          text="Total Revenue"
          value={stats.totalRevenue}
          chartData={revenueChartData}
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
