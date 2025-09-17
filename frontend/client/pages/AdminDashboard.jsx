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
  Search,
  Eye
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, activeCustomers: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    // We don't set loading to true here to avoid a full page flash on refetch
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pickup_scheduled': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      case 'washing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            // Refetch all data to ensure consistency across the dashboard
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-laundry-gray">Total Orders</p>
                  <p className="text-2xl font-bold text-laundry-dark">{stats.totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-laundry-blue" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-laundry-gray">Pending Orders</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-laundry-gray">Active Customers</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeCustomers}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-laundry-gray">Total Revenue</p>
                  <p className="text-2xl font-bold text-laundry-blue">₹{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <IndianRupee className="h-8 w-8 text-laundry-blue" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-laundry-blue" />
                  Order Management
                </CardTitle>
                <CardDescription>Monitor and update order statuses</CardDescription>
              </CardHeader>
              <CardContent>
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
                      <SelectTrigger className="w-48">
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
                      <div key={order._id} className="border rounded-lg p-4 bg-white flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-laundry-dark">#{order._id.slice(-6)}</h3>
                          <p className="text-sm text-laundry-gray">{order.userId?.name}</p>
                          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
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
                    ))}
                    {filteredOrders.length === 0 && !isLoading && (
                      <div className="text-center py-8 text-laundry-gray">No orders found.</div>
                    )}
                  </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <ActivityFeed activities={activities} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}