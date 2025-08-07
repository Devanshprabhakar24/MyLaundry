import React, { useState } from "react";
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
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Edit,
  Eye
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for demonstration
  const stats = {
    totalOrders: 245,
    pendingOrders: 23,
    activeCustomers: 156,
    todayRevenue: 2840.50
  };

  const orders = [
    {
      id: "ORD-001",
      customer: "John Smith",
      email: "john@example.com", 
      phone: "+1 (555) 123-4567",
      status: "pickup_scheduled",
      pickupDate: "2024-01-15",
      deliveryDate: "2024-01-16",
      items: ["3kg Wash & Fold", "2 Shirts (Dry Clean)"],
      total: 28.97,
      address: "123 Main St, City, State",
      specialInstructions: "Please handle delicate items with care"
    },
    {
      id: "ORD-002", 
      customer: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 234-5678",
      status: "washing",
      pickupDate: "2024-01-14",
      deliveryDate: "2024-01-15",
      items: ["5kg Wash & Fold"],
      total: 12.50,
      address: "456 Oak Ave, City, State",
      specialInstructions: ""
    },
    {
      id: "ORD-003",
      customer: "Mike Chen", 
      email: "mike@example.com",
      phone: "+1 (555) 345-6789",
      status: "ready",
      pickupDate: "2024-01-13",
      deliveryDate: "2024-01-14",
      items: ["1 Suit", "3 Shirts (Dry Clean)"],
      total: 51.96,
      address: "789 Pine St, City, State",
      specialInstructions: "Starch on shirts, no starch on suit"
    },
    {
      id: "ORD-004",
      customer: "Emily Rodriguez",
      email: "emily@example.com",
      phone: "+1 (555) 456-7890", 
      status: "out_for_delivery",
      pickupDate: "2024-01-12",
      deliveryDate: "2024-01-13",
      items: ["2kg Wash & Fold", "1 Dress (Dry Clean)"],
      total: 23.99,
      address: "321 Elm St, City, State",
      specialInstructions: "Contactless delivery preferred"
    }
  ];

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
    switch (status) {
      case 'pickup_scheduled': return 'Pickup Scheduled';
      case 'picked_up': return 'Picked Up';
      case 'washing': return 'Washing';
      case 'ready': return 'Ready for Delivery';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // In a real app, this would make an API call
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // For demo purposes, we'll just log it
    alert(`Order ${orderId} status updated to: ${getStatusText(newStatus)}`);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-laundry-dark">Admin Dashboard</h1>
          <p className="text-laundry-gray">Welcome back, {user?.name}. Manage orders and monitor operations.</p>
        </div>

        {/* Stats Cards */}
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
                  <p className="text-sm text-laundry-gray">Today's Revenue</p>
                  <p className="text-2xl font-bold text-laundry-blue">${stats.todayRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-laundry-blue" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-laundry-blue" />
                  Order Management
                </CardTitle>
                <CardDescription>Monitor and update order statuses</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laundry-gray" />
                <Input
                  placeholder="Search orders, customers, or order IDs..."
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

            {/* Orders Table */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-laundry-dark">#{order.id}</h3>
                        <p className="text-sm text-laundry-gray">{order.customer}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Select
                        value={order.status}
                        onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
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
                      <span className="font-semibold text-laundry-blue">${order.total}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t bg-gray-50 p-4 rounded">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold text-laundry-dark mb-2">Customer Details</h4>
                          <p><span className="text-laundry-gray">Email:</span> {order.email}</p>
                          <p><span className="text-laundry-gray">Phone:</span> {order.phone}</p>
                          <p><span className="text-laundry-gray">Address:</span> {order.address}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-laundry-dark mb-2">Order Details</h4>
                          <p><span className="text-laundry-gray">Delivery Date:</span> {new Date(order.deliveryDate).toLocaleDateString()}</p>
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

              {filteredOrders.length === 0 && (
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
