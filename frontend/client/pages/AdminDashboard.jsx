import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/AuthContext";
import {
  Package,
  Users,
  Clock,
  DollarSign,
  Search,
  Eye
} from "lucide-react";
import API_URL from '../apiConfig'; 
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, activeCustomers: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch('${API_URL}/api/admin/stats'),
          fetch('${API_URL}/api/admin/orders')
        ]);
        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();
        setStats(statsData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
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
        const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
            method: 'PUT',  
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) {
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            alert(`Order status updated to: ${getStatusText(newStatus)}`);
        } else {
            alert("Failed to update order status.");
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
                <DollarSign className="h-8 w-8 text-laundry-blue" />
              </div>
            </CardContent>
          </Card>
        </div>

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
                <div key={order._id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-laundry-dark">#{order._id}</h3>
                        <p className="text-sm text-laundry-gray">{order.userId?.name}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-laundry-gray">Items: </span>
                      <span>{order.items.join(", ")}</span>
                    </div>
                    <div>
                      <span className="text-laundry-gray">Pickup: </span>
                      <span>{new Date(order.pickupDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-laundry-gray">Total: </span>
                      <span className="font-semibold text-laundry-blue">₹{order.total}</span>
                    </div>
                  </div>

                  {selectedOrder === order._id && (
                    <div className="mt-4 pt-4 border-t bg-gray-50 p-4 rounded">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold text-laundry-dark mb-2">Customer Details</h4>
                          <p><span className="text-laundry-gray">Email:</span> {order.userId?.email}</p>
                          <p><span className="text-laundry-gray">Address:</span> {order.address}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-laundry-dark mb-2">Order Details</h4>
                          <p><span className="text-laundry-gray">Delivery Date:</span> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                          <p><span className="text-laundry-gray">Items:</span></p>
                          <ul className="ml-4 list-disc">
                            {order.items.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                          {order.specialInstructions && (
                            <p><span className="text-laundry-gray">Instructions:</span> {order.specialInstructions}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredOrders.length === 0 && !isLoading && (
                <div className="text-center py-8 text-laundry-gray">
                  No orders found matching your search criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}