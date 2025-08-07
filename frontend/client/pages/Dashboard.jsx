import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext";
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
  MapPin
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeOrder, setActiveOrder] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchOrders = async () => {
        try {
          const response = await fetch(`/api/orders/${user.id}`);
          const orders = await response.json();
          
          const active = orders.find(o => o.status !== 'completed');
          const recent = orders.filter(o => o.status === 'completed').slice(0, 2);

          setActiveOrder(active);
          setRecentOrders(recent);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    } else {
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
                You need to login to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Please login to access your dashboard and manage your laundry orders.
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-laundry-dark">Welcome back, {user?.name}!</h1>
          <p className="text-laundry-gray">Manage your laundry orders and account settings</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Order */}
            {activeOrder && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-laundry-blue" />
                      Active Order
                    </CardTitle>
                    <Badge className={getStatusColor(activeOrder.status)}>
                      {getStatusText(activeOrder.status)}
                    </Badge>
                  </div>
                  <CardDescription>Order #{activeOrder.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-laundry-gray">Pickup Date:</span>
                      <span className="font-medium">{new Date(activeOrder.pickupDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-laundry-gray">Estimated Delivery:</span>
                      <span className="font-medium">{new Date(activeOrder.estimatedDelivery).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-laundry-gray">Items:</span>
                      <span className="font-medium">{activeOrder.items.join(", ")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-laundry-gray">Total:</span>
                      <span className="font-bold text-laundry-blue">${activeOrder.total}</span>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-sm text-laundry-gray mb-2">
                        <span>Progress</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-laundry-blue h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>

                    <Button
                      className="w-full btn-primary mt-4"
                      onClick={() => navigate('/track-order')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Track Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-laundry-blue" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Your latest laundry orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-laundry-dark">#{order.id}</div>
                        <div className="text-sm text-laundry-gray">{order.items}</div>
                        <div className="text-sm text-laundry-gray">{new Date(order.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-laundry-blue">${order.total}</div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-laundry-blue" />
                  Account Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-laundry-blue rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="font-medium text-laundry-dark">{user?.name}</div>
                    <div className="text-sm text-laundry-gray">{user?.email}</div>
                  </div>
                </div>

                {user?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-laundry-gray" />
                    <span className="text-sm text-laundry-gray">{user.phone}</span>
                  </div>
                )}

                {user?.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-laundry-gray mt-1" />
                    <span className="text-sm text-laundry-gray">{user.address}</span>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full border-laundry-blue text-laundry-blue"
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-laundry-blue" />
                  Membership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-lg font-semibold text-laundry-dark mb-2">Family Plan</div>
                  <div className="text-sm text-laundry-gray mb-4">8.5kg remaining this month</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-laundry-blue h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-laundry-blue text-laundry-blue"
                    onClick={() => navigate('/subscriptions')}
                  >
                    Manage Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-laundry-gray">Orders:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-laundry-gray">Items Cleaned:</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-laundry-gray">Money Saved:</span>
                  <span className="font-medium text-green-600">₹500+</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}