import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { API_URL } from '../apiConfig';
import api from '../utils/api';
import {
  Calendar,
  Clock,
  MapPin,
  Package,
  CreditCard,
  Plus,
  Minus,
  Shirt,
  Sparkles,
  CheckCircle
} from "lucide-react";

export default function NewOrder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    // Service Selection
    services: {
      washFold: { selected: false, weight: 0 },
      dryClean: { selected: false, items: {} },
      ironing: { selected: false, items: {} }
    },

    // Pickup Details
    pickupDate: "",
    pickupTime: "",
    deliveryPreference: "standard",

    // Address & Instructions
    pickupAddress: user?.address || "",
    deliveryAddress: "",
    sameAddress: true,
    specialInstructions: "",

    // Payment
    paymentMethod: "card",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    {
      id: "washFold",
      name: "Wash & Fold",
      description: "Professional washing, drying, and folding",
      icon: <Package className="h-6 w-6" />,
      price: 70,
      unit: "per kg",
      minWeight: 3
    },
    {
      id: "dryClean",
      name: "Dry Cleaning",
      description: "Expert care for delicate garments",
      icon: <Shirt className="h-6 w-6" />,
      items: [
        { name: "Shirt", price: 15 },
        { name: "Trousers", price: 30 },
        { name: "Dress", price: 100 },
        { name: "Suit", price: 200 },
        { name: "Coat", price: 250 }
      ]
    },
    {
      id: "ironing",
      name: "Ironing Services",
      description: "Professional pressing and finishing",
      icon: <Sparkles className="h-6 w-6" />,
      items: [
        { name: "Shirt", price: 10 },
        { name: "Trousers", price: 15 },
        { name: "Dress", price: 30 }
      ]
    }
  ];

  const timeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "1:00 PM - 3:00 PM",
    "3:00 PM - 5:00 PM",
    "5:00 PM - 7:00 PM"
  ];

  const updateServiceWeight = (serviceId, weight) => {
    setOrderData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceId]: {
          ...prev.services[serviceId],
          weight: Math.max(0, weight),
          selected: weight > 0
        }
      }
    }));
  };

  const updateServiceItem = (serviceId, itemName, quantity) => {
    setOrderData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceId]: {
          ...prev.services[serviceId],
          items: {
            ...prev.services[serviceId].items,
            [itemName]: Math.max(0, quantity)
          },
          selected: Object.values({
            ...prev.services[serviceId].items,
            [itemName]: Math.max(0, quantity)
          }).some(q => (q) > 0)
        }
      }
    }));
  };

  const calculateTotal = () => {
    let total = 0;

    if (orderData.services.washFold.selected) {
      total += orderData.services.washFold.weight * 70;
    }

    if (orderData.services.dryClean.selected) {
      const dryCleanService = services.find(s => s.id === "dryClean");
      if (dryCleanService?.items) {
        Object.entries(orderData.services.dryClean.items).forEach(([itemName, quantity]) => {
          const item = dryCleanService.items?.find(i => i.name === itemName);
          if (item) {
            total += item.price * (quantity);
          }
        });
      }
    }

    if (orderData.services.ironing.selected) {
      const ironingService = services.find(s => s.id === "ironing");
      if (ironingService?.items) {
        Object.entries(orderData.services.ironing.items).forEach(([itemName, quantity]) => {
          const item = ironingService.items?.find(i => i.name === itemName);
          if (item) {
            total += item.price * (quantity);
          }
        });
      }
    }

    return total;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (!user?._id) {
      alert("Please login to place an order.");
      navigate('/login');
      setIsSubmitting(false);
      return;
    }

    const finalOrderData = {
      // userId: user._id, // REMOVED: Backend infers userId from token
      pickupDate: orderData.pickupDate,
      pickupTime: orderData.pickupTime,
      address: orderData.pickupAddress,
      estimatedDelivery: new Date(new Date(orderData.pickupDate).getTime() + 24 * 60 * 60 * 1000), // Set estimated delivery to 24 hours after pickup
      specialInstructions: orderData.specialInstructions,
      total: calculateTotal() + (orderData.deliveryPreference === "express" ? 20 : 0),
      status: 'pickup_scheduled',
      items: Object.entries(orderData.services)
        .filter(([, service]) => service.selected)
        .map(([key, service]) => {
          if (key === 'washFold') return `${service.weight}kg Wash & Fold`;
          return Object.entries(service.items)
            .filter(([, qty]) => qty > 0)
            .map(([itemName, qty]) => `${qty} ${itemName}(s) (${key})`)
            .join(', ');
        }).flat().filter(Boolean)
    };

    try {
      // Use api.post instead of fetch. Base URL is handled by api instance.
      // Token is automatically attached by interceptor.
      const response = await api.post('/orders', finalOrderData);

      if (response.status === 201) {
        alert("Order placed successfully! You'll receive a confirmation email shortly.");
        navigate("/my-orders");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return Object.values(orderData.services).some(service => service.selected);
      case 2:
        return orderData.pickupDate && orderData.pickupTime;
      case 3:
        return orderData.pickupAddress.trim() !== "";
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-laundry-dark">Schedule a Pickup</h1>
          <p className="text-laundry-gray">Get your laundry done in 4 easy steps</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold ${step <= currentStep ? 'bg-laundry-blue text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${step < currentStep ? 'bg-laundry-blue' : 'bg-gray-200'
                  }`} />
              )}
            </div>
          ))}
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Select Services"}
              {currentStep === 2 && "Choose Pickup Time"}
              {currentStep === 3 && "Pickup & Delivery Details"}
              {currentStep === 4 && "Review & Confirm"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Choose the services you need for your laundry"}
              {currentStep === 2 && "Select your preferred pickup date and time"}
              {currentStep === 3 && "Provide pickup address and special instructions"}
              {currentStep === 4 && "Review your order details and confirm"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-8">
                {services.map((service) => (
                  <Card key={service.id} className={`border-2 ${orderData.services[service.id]?.selected
                    ? 'border-laundry-blue bg-laundry-light-blue'
                    : 'border-gray-200'
                    }`}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="text-laundry-blue">{service.icon}</div>
                        <div>
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {service.id === "washFold" ? (
                        <div className="flex items-center gap-4">
                          <Label className="flex-1">Weight (kg):</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateServiceWeight(service.id, orderData.services.washFold.weight - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={orderData.services.washFold.weight}
                              onChange={(e) => updateServiceWeight(service.id, parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                              min="0"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateServiceWeight(service.id, orderData.services.washFold.weight + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Badge variant="secondary">₹{service.price} {service.unit}</Badge>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {service.items?.map((item) => (
                            <div key={item.name} className="flex items-center justify-between p-3 bg-white rounded border">
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-laundry-gray">₹{item.price}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateServiceItem(
                                    service.id,
                                    item.name,
                                    (orderData.services[service.id].items[item.name] || 0) - 1
                                  )}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">
                                  {orderData.services[service.id].items[item.name] || 0}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateServiceItem(
                                    service.id,
                                    item.name,
                                    (orderData.services[service.id].items[item.name] || 0) + 1
                                  )}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                <div className="bg-laundry-light-blue p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-laundry-dark">Estimated Total:</span>
                    <span className="text-2xl font-bold text-laundry-blue">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pickup Time */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      value={orderData.pickupDate}
                      onChange={(e) => setOrderData(prev => ({ ...prev, pickupDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickupTime">Pickup Time</Label>
                    <Select onValueChange={(value) => setOrderData(prev => ({ ...prev, pickupTime: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryPreference">Delivery Preference</Label>
                  <Select
                    value={orderData.deliveryPreference}
                    onValueChange={(value) => setOrderData(prev => ({ ...prev, deliveryPreference: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (Next day) - Free</SelectItem>
                      <SelectItem value="express">Express (Same day) - ₹20.00</SelectItem>
                      <SelectItem value="scheduled">Scheduled delivery - Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Pickup Information</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Our team will arrive during your selected time window. Please have your laundry ready
                    in a bag or basket. We'll send you a notification 30 minutes before arrival.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Address & Instructions */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pickupAddress">Pickup Address</Label>
                  <Textarea
                    id="pickupAddress"
                    value={orderData.pickupAddress}
                    onChange={(e) => setOrderData(prev => ({ ...prev, pickupAddress: e.target.value }))}
                    placeholder="Enter your pickup address"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAddress"
                    checked={orderData.sameAddress}
                    onCheckedChange={(checked) => setOrderData(prev => ({
                      ...prev,
                      sameAddress: checked,
                      deliveryAddress: checked ? "" : prev.deliveryAddress
                    }))}
                  />
                  <Label htmlFor="sameAddress">Delivery to same address</Label>
                </div>

                {!orderData.sameAddress && (
                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Textarea
                      id="deliveryAddress"
                      value={orderData.deliveryAddress}
                      onChange={(e) => setOrderData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                      placeholder="Enter delivery address if different"
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="specialInstructions"
                    value={orderData.specialInstructions}
                    onChange={(e) => setOrderData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    placeholder="Any special care instructions, building access codes, or preferences..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {orderData.services.washFold.selected && (
                        <div className="flex justify-between">
                          <span>Wash & Fold ({orderData.services.washFold.weight}kg)</span>
                          <span>₹{(orderData.services.washFold.weight * 700).toFixed(2)}</span>
                        </div>
                      )}

                      {orderData.services.dryClean.selected &&
                        Object.entries(orderData.services.dryClean.items).map(([item, qty]) => (
                          qty > 0 && (
                            <div key={item} className="flex justify-between">
                              <span>{item} × {qty}</span>
                              <span>₹{(qty * (services.find(s => s.id === "dryClean")?.items?.find(i => i.name === item)?.price || 0)).toFixed(2)}</span>
                            </div>
                          )
                        ))
                      }

                      {orderData.services.ironing.selected &&
                        Object.entries(orderData.services.ironing.items).map(([item, qty]) => (
                          qty > 0 && (
                            <div key={item} className="flex justify-between">
                              <span>{item} (Ironing) × {qty}</span>
                              <span>₹{(qty * (services.find(s => s.id === "ironing")?.items?.find(i => i.name === item)?.price || 0)).toFixed(2)}</span>
                            </div>
                          )
                        ))
                      }

                      {orderData.deliveryPreference === "express" && (
                        <div className="flex justify-between">
                          <span>Express Delivery</span>
                          <span>₹20.00</span>
                        </div>
                      )}

                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span className="text-laundry-blue">
                            ₹{(calculateTotal() + (orderData.deliveryPreference === "express" ? 20 : 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pickup Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium">Date:</span> {orderData.pickupDate}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {orderData.pickupTime}
                      </div>
                      <div>
                        <span className="font-medium">Address:</span>
                        <div className="text-sm text-laundry-gray mt-1">{orderData.pickupAddress}</div>
                      </div>
                      <div>
                        <span className="font-medium">Delivery:</span> {orderData.deliveryPreference}
                      </div>
                      {orderData.specialInstructions && (
                        <div>
                          <span className="font-medium">Instructions:</span>
                          <div className="text-sm text-laundry-gray mt-1">{orderData.specialInstructions}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Ready to Place Order</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your order is ready to be placed. You'll receive email and SMS confirmations once confirmed.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-laundry-blue text-laundry-blue"
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="btn-primary"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
