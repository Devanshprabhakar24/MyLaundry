import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import ActivityFeed from "../components/ActivityFeed";
import {
  Package,
  Users,
  Clock,
  IndianRupee,
  Search
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

const StatsCard = ({ title, value, icon, iconBgClass }) => (
    <Card>
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-sm text-laundry-gray">{title}</p>
                <p className={`text-2xl font-bold text-laundry-dark`}>{value}</p>
            </div>
            <div className={`text-white p-3 rounded-lg ${iconBgClass}`}>
                {icon}
            </div>
        </CardContent>
    </Card>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, activeCustomers: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes, activitiesRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/orders"),
        api.get("/activities"),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusText = (status) => {
    const statusMap = {
      pickup_scheduled: 'Pickup Scheduled',
      picked_up: 'Picked Up',
      washing: 'Washing',
      ready: 'Ready for Delivery',
      out_for_delivery: 'Out for Delivery',
      completed: 'Completed'
    };
    return statusMap[status] || 'Unknown';
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const response = await api.put(`/admin/orders/${orderId}`, { status: newStatus });
        if (response.data) {
            fetchData();
        }
    } catch (error) {
        console.error("Failed to update order status:", error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const customerName = order.userId?.name || '';
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-laundry-dark">Admin Dashboard</h1>
          <p className="text-laundry-gray">Welcome back, {user?.name}. Manage orders and monitor operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Orders" value={stats.totalOrders} icon={<Package className="h-6 w-6" />} iconBgClass="bg-laundry-blue" />
          <StatsCard title="Pending Orders" value={stats.pendingOrders} icon={<Clock className="h-6 w-6" />} iconBgClass="bg-orange-500" />
          <StatsCard title="Active Customers" value={stats.activeCustomers} icon={<Users className="h-6 w-6" />} iconBgClass="bg-green-500" />
          <StatsCard title="Total Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} icon={<IndianRupee className="h-6 w-6" />} iconBgClass="bg-laundry-blue" />
        </div>
        
        <Card>
            <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CardTitle className="flex items-center gap-2 mb-4">
                        <Package className="h-5 w-5 text-laundry-blue" />
                        Order Management
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laundry-gray" />
                            <Input
                                placeholder="Search by customer name or order ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pickup_scheduled">Pickup Scheduled</SelectItem>
                                <SelectItem value="picked_up">Picked Up</SelectItem>
                                <SelectItem value="washing">Washing</SelectItem>
                                <SelectItem value="ready">Ready</SelectItem>
                                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-laundry-dark">#{order._id.slice(-6)}</h3>
                                        <p className="text-sm text-gray-600">{order.userId?.name || "N/A"}</p>
                                    </div>
                                    <div className="mt-2 sm:mt-0">
                                        <Select
                                        value={order.status}
                                        onValueChange={(newStatus) => updateOrderStatus(order._id, newStatus)}
                                        >
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pickup_scheduled">Pickup Scheduled</SelectItem>
                                            <SelectItem value="picked_up">Picked Up</SelectItem>
                                            <SelectItem value="washing">Washing</SelectItem>
                                            <SelectItem value="ready">Ready</SelectItem>
                                            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="border-t my-2"></div>
                                <div className="text-sm text-gray-500 flex justify-between">
                                    <span>Pickup: {new Date(order.pickupDate).toLocaleDateString()}</span>
                                    <span className="font-semibold text-laundry-blue">Total: ₹{order.total}</span>
                                </div>
                            </div>
                        ))}
                        {filteredOrders.length === 0 && !isLoading && (
                            <div className="text-center py-8 text-laundry-gray">No orders found.</div>
                        )}
                    </div>
                </div>
                
                <div className="lg:border-l lg:pl-8">
                    <ActivityFeed activities={activities} isLoading={isLoading} />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}