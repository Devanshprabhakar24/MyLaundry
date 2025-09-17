import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { 
  Package,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  Eye,
  CreditCard,
  User,
  Star,
  Calendar,
  Phone,
  MapPin,
  Crown
} from "lucide-react";

const quickActions = [
    {
      title: "New Order",
      description: "Schedule a pickup",
      icon: <Plus className="h-6 w-6" />,
      link: "/new-order",
      color: "bg-laundry-blue"
    },
    {
      title: "Track Order",
      description: "Check order status",
      icon: <Eye className="h-6 w-6" />,
      link: "/track-order",
      color: "bg-green-600"
    },
    {
      title: "My Orders",
      description: "View order history",
      icon: <Package className="h-6 w-6" />,
      link: "/my-orders",
      color: "bg-purple-600"
    },
    {
      title: "Subscription",
      description: "Manage subscription",
      icon: <Crown className="h-6 w-6" />,
      link: "/subscription-management",
      color: "bg-orange-600"
    }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeOrder, setActiveOrder] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({ ordersCount: 0, itemsCleaned: 0, moneySaved: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [ordersRes, statsRes] = await Promise.all([
            api.get(`/orders/${user._id}`),
            api.get(`/users/${user._id}/stats`)
          ]);

          const orders = ordersRes.data;
          const active = orders.find(o => o.status !== 'completed');
          const recent = orders.filter(o => o.status === 'completed').slice(0, 2);

          setActiveOrder(active);
          setRecentOrders(recent);
          setStats(statsRes.data);

        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Login Required</CardTitle>
              <CardDescription>
                You need to login to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Please login to access your dashboard and manage your laundry orders.
              </p>
              <div className="flex flex-col gap-3">
                <Button className="btn-primary w-full" onClick={() => navigate('/login')}>
                  Login to Your Account
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/signup')}>
                  Create New Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const getStatusColor = (status) => {
    // ... (getStatusColor function remains the same)
  };

  const getStatusText = (status) => {
    // ... (getStatusText function remains the same)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-laundry-dark">Welcome back, {user?.name}!</h1>
          <p className="text-laundry-gray">Manage your laundry orders and account settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`${action.color} rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4`}>
                    <div className="text-white">{action.icon}</div>
                  </div>
                  <h3 className="font-semibold text-laundry-dark mb-2">{action.title}</h3>
                  <p className="text-sm text-laundry-gray">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {activeOrder && (
              <Card>
                <CardHeader>
                    {/* ... Active Order Header ... */}
                </CardHeader>
                <CardContent>
                    {/* ... Active Order Content ... */}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-laundry-blue" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Your latest completed laundry orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-laundry-dark">#{order._id.slice(-6)}</div>
                        <div className="text-sm text-laundry-gray">{order.items.join(', ')}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-laundry-blue">₹{order.total}</div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-laundry-gray py-4">No recent completed orders.</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-laundry-blue text-laundry-blue"
                  onClick={() => navigate('/my-orders')}
                >
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
                <CardHeader>
                    {/* ... Account Info Header ... */}
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* ... Account Info Content ... */}
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-laundry-gray">Orders:</span>
                  <span className="font-medium">{stats.ordersCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-laundry-gray">Items Cleaned:</span>
                  <span className="font-medium">{stats.itemsCleaned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-laundry-gray">Money Saved:</span>
                  <span className="font-medium text-green-600">₹{stats.moneySaved}+</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}