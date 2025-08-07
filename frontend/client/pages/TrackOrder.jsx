import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const trackOrder = async () => {
    if (!orderId.trim()) {
      setError("Please enter an order ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setTrackedOrder(null);
    
    try {
      const response = await fetch(`/api/orders/details/${orderId}`);
      const data = await response.json();

      if (response.ok) {
        setTrackedOrder(data);
        setError("");
      } else {
        setError(data.message || "Order not found.");
      }
    } catch (err) {
      setError("An error occurred while fetching your order.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("orderId")) {
      trackOrder();
    }
  }, [searchParams]);

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

  const getStatusIcon = (status, isCurrent = false) => {
    const iconClass = `h-5 w-5 ${isCurrent ? 'text-laundry-blue' : 'text-gray-400'}`;
    const iconMap = {
      pickup_scheduled: <Calendar className={iconClass} />,
      picked_up: <Package className={iconClass} />,
      washing: <RefreshCw className={iconClass} />,
      ready: <CheckCircle className={iconClass} />,
      out_for_delivery: <Truck className={iconClass} />,
      completed: <CheckCircle className={iconClass} />
    };
    return iconMap[status] || <Package className={iconClass} />;
  };
  
  const allStatuses = ['pickup_scheduled', 'picked_up', 'washing', 'ready', 'out_for_delivery', 'completed'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-laundry-dark">Track Your Order</h1>
          <p className="text-laundry-gray">Enter your order ID to see real-time status updates</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-laundry-blue" />
              Order Lookup
            </CardTitle>
            <CardDescription>
              Enter your order ID to track your laundry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && trackOrder()}
                className="flex-1"
              />
              <Button 
                onClick={trackOrder}
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? "Searching..." : "Track Order"}
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {trackedOrder && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Order #{trackedOrder._id}</CardTitle>
                    <CardDescription>
                      Placed on {new Date(trackedOrder.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(trackedOrder.status)}>
                    {getStatusText(trackedOrder.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-laundry-gray" />
                    <div>
                      <div className="text-sm text-laundry-gray">Pickup Date</div>
                      <div className="font-medium">{new Date(trackedOrder.pickupDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-laundry-gray" />
                    <div>
                      <div className="text-sm text-laundry-gray">Estimated Delivery</div>
                      <div className="font-medium">{new Date(trackedOrder.estimatedDelivery).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-laundry-gray" />
                    <div>
                      <div className="text-sm text-laundry-gray">Total</div>
                      <div className="font-medium text-laundry-blue">${trackedOrder.total}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-laundry-blue" />
                  Order Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allStatuses.map((status) => {
                    const currentIndex = allStatuses.indexOf(trackedOrder.status);
                    const stepIndex = allStatuses.indexOf(status);
                    const isCompleted = stepIndex < currentIndex;
                    const isCurrent = stepIndex === currentIndex;
                    
                    return (
                      <div key={status} className="flex items-center gap-4">
                        <div className={`rounded-full w-10 h-10 flex items-center justify-center ${
                          isCompleted ? 'bg-green-100' : isCurrent ? 'bg-laundry-blue bg-opacity-20' : 'bg-gray-100'
                        }`}>
                          {getStatusIcon(status, isCurrent)}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            isCompleted ? 'text-green-800' : isCurrent ? 'text-laundry-blue' : 'text-gray-500'
                          }`}>
                            {getStatusText(status)}
                          </div>
                        </div>
                        {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {isCurrent && <div className="h-2 w-2 bg-laundry-blue rounded-full animate-pulse" />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}