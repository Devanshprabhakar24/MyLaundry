import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Star,
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock order data for demonstration
  const mockOrders = {
    "ORD-001": {
      id: "ORD-001",
      status: "washing",
      customer: "John Smith",
      phone: "+1 (555) 123-4567",
      email: "john@example.com",
      pickupDate: "2024-01-15",
      estimatedDelivery: "2024-01-16",
      actualPickupTime: "2024-01-15T10:30:00",
      items: [
        { name: "Wash & Fold", details: "3kg mixed clothing", price: 7.50 },
        { name: "Dry Clean", details: "2 Business shirts", price: 17.98 }
      ],
      total: 25.48,
      pickupAddress: "123 Main St, City, State 12345",
      deliveryAddress: "123 Main St, City, State 12345",
      specialInstructions: "Please handle delicate items with care",
      statusHistory: [
        { status: "pickup_scheduled", timestamp: "2024-01-15T08:00:00", description: "Pickup scheduled" },
        { status: "picked_up", timestamp: "2024-01-15T10:30:00", description: "Items collected from pickup location" },
        { status: "washing", timestamp: "2024-01-15T11:15:00", description: "Items being processed", current: true }
      ],
      estimatedSteps: [
        { step: "pickup_scheduled", label: "Pickup Scheduled", completed: true, time: "10:30 AM" },
        { step: "picked_up", label: "Picked Up", completed: true, time: "10:30 AM" },
        { step: "washing", label: "Washing", completed: false, current: true, estimated: "2:00 PM" },
        { step: "ready", label: "Ready for Delivery", completed: false, estimated: "Tomorrow 8:00 AM" },
        { step: "out_for_delivery", label: "Out for Delivery", completed: false, estimated: "Tomorrow 10:00 AM" },
        { step: "delivered", label: "Delivered", completed: false, estimated: "Tomorrow 2:00 PM" }
      ]
    },
    "ORD-002": {
      id: "ORD-002", 
      status: "out_for_delivery",
      customer: "Sarah Johnson",
      phone: "+1 (555) 234-5678",
      email: "sarah@example.com",
      pickupDate: "2024-01-14",
      estimatedDelivery: "2024-01-15",
      items: [
        { name: "Wash & Fold", details: "5kg family laundry", price: 12.50 }
      ],
      total: 12.50,
      pickupAddress: "456 Oak Ave, City, State 67890",
      deliveryAddress: "456 Oak Ave, City, State 67890",
      specialInstructions: "",
      statusHistory: [
        { status: "pickup_scheduled", timestamp: "2024-01-14T09:00:00", description: "Pickup scheduled" },
        { status: "picked_up", timestamp: "2024-01-14T11:00:00", description: "Items collected" },
        { status: "washing", timestamp: "2024-01-14T12:00:00", description: "Items processed" },
        { status: "ready", timestamp: "2024-01-15T08:00:00", description: "Ready for delivery" },
        { status: "out_for_delivery", timestamp: "2024-01-15T10:00:00", description: "Out for delivery", current: true }
      ],
      estimatedSteps: [
        { step: "pickup_scheduled", label: "Pickup Scheduled", completed: true, time: "11:00 AM" },
        { step: "picked_up", label: "Picked Up", completed: true, time: "11:00 AM" },
        { step: "washing", label: "Washing", completed: true, time: "12:00 PM" },
        { step: "ready", label: "Ready for Delivery", completed: true, time: "8:00 AM" },
        { step: "out_for_delivery", label: "Out for Delivery", completed: false, current: true, estimated: "Now" },
        { step: "delivered", label: "Delivered", completed: false, estimated: "2:00 PM" }
      ]
    }
  };

  const trackOrder = async () => {
    if (!orderId.trim()) {
      setError("Please enter an order ID");
      return;
    }

    setIsLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      const order = mockOrders[orderId];
      if (order) {
        setTrackedOrder(order);
        setError("");
      } else {
        setTrackedOrder(null);
        setError("Order not found. Please check your order ID and try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pickup_scheduled': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      case 'washing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
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
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status, isCurrent = false) => {
    const iconClass = `h-5 w-5 ${isCurrent ? 'text-laundry-blue' : 'text-gray-400'}`;
    
    switch (status) {
      case 'pickup_scheduled': return <Calendar className={iconClass} />;
      case 'picked_up': return <Package className={iconClass} />;
      case 'washing': return <RefreshCw className={iconClass} />;
      case 'ready': return <CheckCircle className={iconClass} />;
      case 'out_for_delivery': return <Truck className={iconClass} />;
      case 'delivered': return <CheckCircle className={iconClass} />;
      default: return <Package className={iconClass} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-laundry-dark">Track Your Order</h1>
          <p className="text-laundry-gray">Enter your order ID to see real-time status updates</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-laundry-blue" />
              Order Lookup
            </CardTitle>
            <CardDescription>
              Enter your order ID (e.g., ORD-001) to track your laundry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter Order ID (e.g., ORD-001)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && trackOrder()}
                />
              </div>
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

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong>Demo Order IDs:</strong> Try ORD-001 (washing) or ORD-002 (out for delivery)
            </div>
          </CardContent>
        </Card>

        {/* Order Tracking Results */}
        {trackedOrder && (
          <div className="space-y-6">
            {/* Order Status Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Order #{trackedOrder.id}</CardTitle>
                    <CardDescription>
                      Placed on {new Date(trackedOrder.pickupDate).toLocaleDateString()}
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

            {/* Progress Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-laundry-blue" />
                  Order Progress
                </CardTitle>
                <CardDescription>Real-time status updates for your order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackedOrder.estimatedSteps.map((step, index) => (
                    <div key={step.step} className="flex items-center gap-4">
                      <div className={`rounded-full w-10 h-10 flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-100' 
                          : step.current 
                            ? 'bg-laundry-blue bg-opacity-20' 
                            : 'bg-gray-100'
                      }`}>
                        {getStatusIcon(step.step, step.current)}
                      </div>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${
                          step.completed 
                            ? 'text-green-800' 
                            : step.current 
                              ? 'text-laundry-blue' 
                              : 'text-gray-500'
                        }`}>
                          {step.label}
                        </div>
                        <div className="text-sm text-laundry-gray">
                          {step.completed 
                            ? `Completed at ${step.time}` 
                            : step.current 
                              ? `In progress - ETA: ${step.estimated}`
                              : `Estimated: ${step.estimated}`
                          }
                        </div>
                      </div>
                      
                      {step.completed && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {step.current && (
                        <div className="h-2 w-2 bg-laundry-blue rounded-full animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>

                {trackedOrder.status === 'out_for_delivery' && (
                  <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">Out for Delivery</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Your order is on its way! Our delivery team will arrive between 12:00 PM - 4:00 PM today.
                      You'll receive a notification 30 minutes before delivery.
                    </p>
                  </div>
                )}

                {trackedOrder.status === 'washing' && (
                  <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-800">Being Processed</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Your items are currently being washed and processed by our expert team. 
                      Processing typically takes 4-6 hours.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-laundry-dark mb-2">Items</h4>
                    <div className="space-y-2">
                      {trackedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-laundry-gray">{item.details}</div>
                          </div>
                          <div className="font-medium text-laundry-blue">${item.price}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-laundry-blue">${trackedOrder.total}</span>
                    </div>
                  </div>

                  {trackedOrder.specialInstructions && (
                    <div>
                      <h4 className="font-semibold text-laundry-dark mb-2">Special Instructions</h4>
                      <p className="text-sm text-laundry-gray bg-gray-50 p-3 rounded">
                        {trackedOrder.specialInstructions}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact & Address Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-laundry-dark mb-2">Customer</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-laundry-gray" />
                        <span className="text-sm">{trackedOrder.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-laundry-gray" />
                        <span className="text-sm">{trackedOrder.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-laundry-dark mb-2">Delivery Address</h4>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-laundry-gray mt-1" />
                      <span className="text-sm text-laundry-gray">{trackedOrder.deliveryAddress}</span>
                    </div>
                  </div>

                  <div className="bg-laundry-light-blue p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-laundry-blue" />
                      <span className="text-sm font-semibold text-laundry-blue">Need Help?</span>
                    </div>
                    <p className="text-xs text-laundry-blue">
                      Contact us at (123) 456-7890 or support@mylaundry.com for any questions about your order.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="btn-primary flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Status
                  </Button>
                  <Button variant="outline" className="flex-1 border-laundry-blue text-laundry-blue">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="flex-1 border-laundry-blue text-laundry-blue">
                    <Star className="h-4 w-4 mr-2" />
                    Rate Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        {!trackedOrder && !error && (
          <Card>
            <CardHeader>
              <CardTitle>Need Help Finding Your Order?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-laundry-dark mb-2">Where to find your Order ID:</h4>
                  <ul className="text-sm text-laundry-gray space-y-1">
                    <li>• Check your email confirmation</li>
                    <li>• Look at your SMS notification</li>
                    <li>• Find it in your account dashboard</li>
                    <li>• On your pickup receipt</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-laundry-dark mb-2">Can't find your order?</h4>
                  <p className="text-sm text-laundry-gray mb-3">
                    Contact our support team for assistance with order lookup.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-laundry-blue" />
                      <span className="text-sm">(123) 456-7890</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-laundry-blue" />
                      <span className="text-sm">support@mylaundry.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
