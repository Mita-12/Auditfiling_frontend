import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Briefcase, CheckCircle, TrendingUp, Calendar, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalLeads: 0,
        totalCustomers: 0,
        servicesCompleted: 0,
        totalEmployees: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [recentLeads, setRecentLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch dashboard data from your API
        const fetchDashboardData = async () => {
            try {
                // Replace with your actual API calls
                // const statsResponse = await fetch('/api/admin/dashboard/stats');
                // const statsData = await statsResponse.json();
                
                // const activitiesResponse = await fetch('/api/admin/recent-activities');
                // const activitiesData = await activitiesResponse.json();
                
                // const leadsResponse = await fetch('/api/admin/recent-leads');
                // const leadsData = await leadsResponse.json();
                
                // Mock data for demonstration
                const mockStats = {
                    totalLeads: 1248,
                    totalCustomers: 856,
                    servicesCompleted: 3421,
                    totalEmployees: 47
                };
                
                const mockActivities = [
                    { id: 1, type: 'lead', message: 'New lead added - John Doe', time: '2 minutes ago', color: 'blue' },
                    { id: 2, type: 'service', message: 'Service completed - Installation #1234', time: '1 hour ago', color: 'green' },
                    { id: 3, type: 'customer', message: 'New customer registered - Sarah Smith', time: '3 hours ago', color: 'purple' },
                    { id: 4, type: 'employee', message: 'Employee joined - Michael Brown', time: '5 hours ago', color: 'orange' }
                ];
                
                const mockLeads = [
                    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8900', status: 'New', date: '2024-03-25' },
                    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 8901', status: 'Contacted', date: '2024-03-24' },
                    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', phone: '+1 234 567 8902', status: 'Qualified', date: '2024-03-24' },
                    { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '+1 234 567 8903', status: 'New', date: '2024-03-23' }
                ];
                
                setStats(mockStats);
                setRecentActivities(mockActivities);
                setRecentLeads(mockLeads);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, bgColor, trend }) => (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">
                        {loading ? '...' : value.toLocaleString()}
                    </p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-xs text-green-600">{trend}</span>
                        </div>
                    )}
                </div>
                <div className={`${bgColor} p-3 rounded-full`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
        </div>
    );

    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'contacted': return 'bg-yellow-100 text-yellow-800';
            case 'qualified': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Leads"
                    value={stats.totalLeads}
                    icon={Users}
                    color="text-blue-600"
                    bgColor="bg-blue-100"
                    trend="+12% this week"
                />
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    icon={UserCheck}
                    color="text-green-600"
                    bgColor="bg-green-100"
                    trend="+8% this week"
                />
                <StatCard
                    title="Services Completed"
                    value={stats.servicesCompleted}
                    icon={CheckCircle}
                    color="text-purple-600"
                    bgColor="bg-purple-100"
                    trend="+24% this week"
                />
                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon={Briefcase}
                    color="text-orange-600"
                    bgColor="bg-orange-100"
                />
            </div>

            {/* Charts Section (Optional) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
                        <select className="text-sm border rounded-lg px-2 py-1">
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Chart will be displayed here</p>
                            <p className="text-sm text-gray-400">Integrate with your charting library</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivities.map(activity => (
                            <div key={activity.id} className="flex items-start space-x-3">
                                <div className={`mt-1 w-2 h-2 rounded-full bg-${activity.color}-500`} />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">{activity.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Leads Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Leads</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentLeads.map(lead => (
                                <tr key={lead.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {lead.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {lead.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {lead.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {lead.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition text-center">
                    <Users className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-sm font-medium">Add Lead</span>
                </button>
                <button className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg transition text-center">
                    <UserCheck className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-sm font-medium">Add Customer</span>
                </button>
                <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg transition text-center">
                    <CheckCircle className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-sm font-medium">New Service</span>
                </button>
                <button className="bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-lg transition text-center">
                    <Briefcase className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-sm font-medium">Add Employee</span>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;