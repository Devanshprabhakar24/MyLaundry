import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Filter,
  Eye,
  Download,
  Star,
  Package,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  RefreshCw,
  MoreVertical
} from "lucide-react";
import { API_URL } from '../apiConfig';
import api from "../utils/api";

export default function MyOrders() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchOrders = async () => {
        setIsLoading(true);
        try {
          const response = await api.get('/orders/mine');
          setOrders(response.data);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    } else if (!isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Redirect to login if not authenticated
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Login Required</CardTitle>
              <CardDescription>
                You need to login to view your orders
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Please login to access your order history and track your laundry orders.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  className="btn-primary w-full"
                  onClick={() => navigate('/login')}
                >
                  Login to Your Account
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/signup')}
                >
                  Create New Account
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
      case 'washing': return 'Processing';
      case 'ready': return 'Ready';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pickup_scheduled': return <Calendar className="h-4 w-4" />;
      case 'picked_up': return <Package className="h-4 w-4" />;
      case 'washing': return <RefreshCw className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'out_for_delivery': return <Truck className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    // FIX: Use order._id for MongoDB
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      // FIX: Use createdAt for date filtering
      const orderDate = new Date(order.createdAt);
      const now = new Date();

      switch (dateFilter) {
        case "week":
          matchesDate = (now.getTime() - orderDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
          break;
        case "month":
          matchesDate = (now.getTime() - orderDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
          break;
        case "quarter":
          matchesDate = (now.getTime() - orderDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleReorder = (orderId) => {
    alert(`Reordering ₹{orderId} - This would redirect to new order page with pre-filled items`);
  };

  const handleRateOrder = (orderId) => {
    alert(`Rating order ₹{orderId} - This would open a rating modal`);
  };

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    avgRating: orders.filter(o => o.rating).reduce((sum, order) => sum + (order.rating || 0), 0) / orders.filter(o => o.rating).length || 0
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-laundry-dark">My Orders</h1>
            <p className="text-laundry-gray">Track and manage your laundry order history</p>
          </div>
          <Button className="btn-primary" onClick={() => navigate('/new-order')}>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-laundry-blue">{stats.total}</div>
              <div className="text-sm text-laundry-gray">Total Orders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-laundry-gray">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-laundry-blue">₹{stats.totalSpent.toFixed(2)}</div>
              <div className="text-sm text-laundry-gray">Total Spent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)}</span>
              </div>
              <div className="text-sm text-laundry-gray">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laundry-gray" />
                <Input
                  placeholder="Search orders by ID or items..."
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
                  <SelectItem value="washing">Processing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-laundry-dark">#{order._id}</h3>
                      <p className="text-sm text-laundry-gray">
                        {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </div>
                    </Badge>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-laundry-blue">₹{order.total}</div>
                    {order.rating && (
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-laundry-gray">{order.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-laundry-gray mb-2">Items:</div>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-laundry-gray" />
                    <span className="text-laundry-gray">Pickup:</span>
                    <span>{new Date(order.pickupDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-laundry-gray" />
                    <span className="text-laundry-gray">Delivery:</span>
                    <span>{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-laundry-gray" />
                    <span className="text-laundry-gray">Total:</span>
                    <span className="font-medium">₹{order.total}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/track-order?orderId=₹{order._id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(order._id)}
                    className="border-laundry-blue text-laundry-blue"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reorder
                  </Button>

                  {order.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRateOrder(order._id)}
                      className="border-yellow-500 text-yellow-600"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Rate Order
                    </Button>
                  )}

                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && !isLoading && (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-laundry-gray mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-laundry-dark mb-2">No Orders Found</h3>
                <p className="text-laundry-gray mb-6">
                  {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                    ? "No orders match your current filters."
                    : "You haven't placed any orders yet. Start your first order today!"
                  }
                </p>
                <Button className="btn-primary" onClick={() => navigate('/new-order')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Place Your First Order
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


