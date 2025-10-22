import { useEffect, useState } from "react";
import axios from "axios";
import SalesOverviewChart from "../components/charts/SalesOverviewChart";
import ProductOverviewChart from "../components/charts/ProductOverviewChart";
import StatCard, { StatCardItem } from "../components/Layout/StatCard";
import {
  Box,
  DollarSign,
  SlidersHorizontal,
  PhilippinePeso,
  ShoppingBag,
  User,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalSales: 0,
  });
  const [salesChartData, setSalesChartData] = useState([]);
  const [productChartData, setProductChartData] = useState([]);
  const [userChartData, setUserChartData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const MIN_DATE = "2025-01-01";
  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
  const MAX_DATE = today.toISOString().split("T")[0];

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const salesRate = await axios.get(
        "http://localhost:5000/api/chart/sales",
        { params }
      );
      const formattedSales = salesRate.data.map((item) => ({
        ...item,
        name: new Date(item.name).toLocaleDateString("en-CA"),
      }));
      setSalesChartData(formattedSales);

      const productRes = await axios.get(
        "http://localhost:5000/api/chart/products",
        { params }
      );
      const formattedProduct = productRes.data.map((item) => ({
        ...item,
        name: new Date(item.date).toLocaleDateString("en-CA"),
      }));
      setProductChartData(formattedProduct);

      const revenueData = await axios.get(
        "http://localhost:5000/api/chart/revenues",
        { params }
      );
      const formattedRevenue = revenueData.data.map((item) => ({
        ...item,
        name: new Date(item.date).toLocaleDateString("en-CA"),
        value: parseFloat(item.value) || 0
      }));
      setRevenueChartData(formattedRevenue);

      const userRes = await axios.get("http://localhost:5000/api/users/chart", {
        params,
      });
      const formattedUser = userRes.data.map((item) => ({
        ...item,
        name: new Date(item.date).toLocaleDateString("en-CA"),
      }));
      setUserChartData(formattedUser);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    toast.remove();
    if (startDate && endDate && startDate > endDate) {
      toast.error("Start date cannot be later than end date.");
      return;
    }
    fetchChartData();
  };

  return (
    <>
      <div className="flex items-center justify-between border p-2 md:p-4 rounded-md">
        <Toaster />
        <div>
          <h1 className="text-lg md:text-3xl font-bold">Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            min={MIN_DATE}
            max={MAX_DATE}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md p-2 text-sm cursor-pointer"
          />
          <span>to</span>
          <input
            type="date"
            min={MIN_DATE}
            max={MAX_DATE}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md p-2 text-sm cursor-pointer"
          />
          <button
            className="bg-[#085b5f] text-white px-3 py-2 rounded-md text-xs hover:bg-[#0c969c] transition cursor-pointer flex items-center justify-center min-w-[32px] min-h-[32px]"
            onClick={handleFilter}
            disabled={loading}
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SlidersHorizontal size={14} />
            )}
          </button>
        </div>
      </div>
      <StatCard>
        <StatCardItem
          icon={<User className="text-blue-500" />}
          text="Total Users"
          value={stats.totalUsers}
          chartData={userChartData}
        />
        <StatCardItem
          icon={<ShoppingBag className="text-orange-500" />}
          text="Total Sales"
          value={stats.totalSales}
          chartData={salesChartData}
        />
        <StatCardItem
          icon={<Box className="text-amber-500" />}
          text="Total Product"
          value={stats.totalProducts}
          chartData={productChartData}
        />
        <StatCardItem
          icon={<PhilippinePeso className="text-green-500" />}
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
