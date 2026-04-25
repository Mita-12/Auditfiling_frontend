import { useState, useEffect } from "react";
import { TrendingUp, Users, DollarSign, Star, Calendar } from "lucide-react";
import axios from "axios";

export default function ResellerDashboard() {
  const [stats, setStats] = useState({
    totalCommission: 0,
    totalCustomers: 0,
    totalSales: 0,
    pendingPayout: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user"))?.token;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/reseller/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Commission",
      value: `₹${stats.totalCommission.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-purple-500",
      change: "+12.5%"
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-blue-500",
      change: "+8.2%"
    },
    {
      title: "Total Sales",
      value: `₹${stats.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      change: "+23.1%"
    },
    {
      title: "Pending Payout",
      value: `₹${stats.pendingPayout.toLocaleString()}`,
      icon: Calendar,
      color: "bg-orange-500",
      change: "Next: Mar 15"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Reseller Dashboard</h2>
        <p className="text-gray-600">Welcome to your reseller portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Customers</h3>
          <div className="space-y-3">
            {/* Add recent customers list here */}
            <p className="text-gray-500 text-center py-8">Loading customers...</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Commission History</h3>
          <div className="space-y-3">
            {/* Add commission history here */}
            <p className="text-gray-500 text-center py-8">Loading history...</p>
          </div>
        </div>
      </div>
    </div>
  );
}