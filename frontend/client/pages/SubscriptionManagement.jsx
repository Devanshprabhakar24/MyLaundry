import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext";
import {
  Package,
  Calendar,
  CreditCard,
  Users,
  Crown,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import API_URL from '../apiConfig';

export default function SubscriptionManagement() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchActiveSubscription();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchActiveSubscription = async () => {
    try {
      const response = await fetch(`${API_URL}/api/subscriptions/user/${user._id}/active`);
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    setIsCancelling(true);
    try {
      const response = await fetch(`${API_URL}/api/subscriptions/${subscription._id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const updatedSubscription = await response.json();
        setSubscription(updatedSubscription);
        alert("Subscription cancelled successfully. You can continue using your remaining allowance until the end of your billing period.");
      } else {
        alert("Failed to cancel subscription. Please try again.");
      }
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      alert("An error occurred while cancelling your subscription.");
    } finally {
      setIsCancelling(false);
    }
  };

  const getPlanIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return <Home className="h-6 w-6" />;
      case 'family':
        return <Users className="h-6 w-6" />;
      case 'premium':
        return <Crown className="h-6 w-6" />;
      default:
        return <Package className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const calculateUsagePercentage = (used, allowed) => {
    const usedNum = parseFloat(used);
    const allowedNum = parseFloat(allowed.replace('kg', ''));
    return Math.min((usedNum / allowedNum) * 100, 100);
  };

  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Login Required</CardTitle>
              <CardDescription>
                You need to login to manage your subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Please login to view and manage your subscription details.
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-laundry-dark">Subscription Management</h1>
            <p className="text-laundry-gray">Manage your laundry subscription and usage</p>
          </div>
          <Button
            className="btn-primary"
            onClick={() => navigate('/subscriptions')}
          >
            View Plans
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-laundry-blue" />
              <p className="text-laundry-gray">Loading subscription details...</p>
            </CardContent>
          </Card>
        ) : subscription ? (
          <div className="space-y-6">
            {/* Current Subscription */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-laundry-blue">
                      {getPlanIcon(subscription.planName)}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{subscription.planName} Plan</CardTitle>
                      <CardDescription>
                        Active since {new Date(subscription.startDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(subscription.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(subscription.status)}
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Usage Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-laundry-blue" />
                      <span className="font-medium">Weight Allowance</span>
                    </div>
                    <div className="text-2xl font-bold text-laundry-blue">
                      {subscription.weightUsed}kg / {subscription.weightAllowance}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-laundry-blue h-2 rounded-full transition-all" 
                        style={{ 
                          width: `${calculateUsagePercentage(subscription.weightUsed, subscription.weightAllowance)}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-laundry-blue" />
                      <span className="font-medium">Pickups</span>
                    </div>
                    <div className="text-2xl font-bold text-laundry-blue">
                      {subscription.pickupsUsed} / {subscription.pickupsAllowed}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-laundry-blue h-2 rounded-full transition-all" 
                        style={{ 
                          width: `${(subscription.pickupsUsed / subscription.pickupsAllowed) * 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-laundry-blue" />
                      <span className="font-medium">Days Remaining</span>
                    </div>
                    <div className="text-2xl font-bold text-laundry-blue">
                      {calculateDaysRemaining(subscription.endDate)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Renews on {new Date(subscription.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-laundry-dark mb-3">Plan Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Price:</span>
                        <span className="font-medium">₹{subscription.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight Allowance:</span>
                        <span className="font-medium">{subscription.weightAllowance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickups per Month:</span>
                        <span className="font-medium">{subscription.pickupsAllowed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Auto Renew:</span>
                        <span className="font-medium">{subscription.autoRenew ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-laundry-dark mb-3">Billing Information</h3>
                    <div className="space-y-2 text-sm">
                      {subscription.paymentMethod && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Card:</span>
                            <span className="font-medium">•••• {subscription.paymentMethod.cardLast4}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expires:</span>
                            <span className="font-medium">{subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear}</span>
                          </div>
                        </>
                      )}
                      {subscription.billingAddress && (
                        <div className="text-gray-600">
                          <div className="font-medium">Billing Address:</div>
                          <div>{subscription.billingAddress.address}</div>
                          <div>{subscription.billingAddress.city}, {subscription.billingAddress.zipCode}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="border-laundry-blue text-laundry-blue"
                    onClick={() => navigate('/new-order')}
                  >
                    Schedule Pickup
                  </Button>
                  
                  {subscription.status === 'active' && (
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      onClick={handleCancelSubscription}
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        'Cancel Subscription'
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-laundry-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-laundry-dark mb-2">No Active Subscription</h3>
              <p className="text-laundry-gray mb-6">
                You don't have an active subscription. Subscribe to a plan to enjoy premium laundry services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="btn-primary"
                  onClick={() => navigate('/subscriptions')}
                >
                  View Subscription Plans
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/new-order')}
                >
                  Place One-time Order
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
