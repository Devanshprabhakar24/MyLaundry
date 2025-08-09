import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import API_URL from "../apiConfig";
import { useAuth } from "../context/AuthContext";

export default function Subscriptions() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
    billingAddress: "",
    city: "",
    zipCode: ""
  });
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plans = [
    { id: "basic", name: "Basic", price: 499, weightAllowance: "20kg", pickups: 4 },
    { id: "family", name: "Family", price: 999, weightAllowance: "50kg", pickups: 8 },
    { id: "premium", name: "Premium", price: 1499, weightAllowance: "100kg", pickups: 15 }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setPaymentError("");
    setPaymentSuccess(false);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError("");

    if (!selectedPlan) {
      setPaymentError("Please select a subscription plan.");
      setIsProcessing(false);
      return;
    }

    const requiredFields = ["cardNumber", "cardHolder", "expiry", "cvv", "billingAddress", "city", "zipCode"];
    for (let field of requiredFields) {
      if (!paymentData[field]) {
        setPaymentError("Please fill in all required fields.");
        setIsProcessing(false);
        return;
      }
    }

    const cardNumber = paymentData.cardNumber.replace(/\s/g, "");
    if (cardNumber.length !== 16) {
      setPaymentError("Please enter a valid 16-digit card number.");
      setIsProcessing(false);
      return;
    }

    const expiryParts = paymentData.expiry.split("/");
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      setPaymentError("Please enter a valid expiry date (MM/YY).");
      setIsProcessing(false);
      return;
    }

    if (paymentData.cvv.length < 3) {
      setPaymentError("Please enter a valid CVV.");
      setIsProcessing(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const [expiryMonth, expiryYear] = expiryParts;

      const subscriptionData = {
        userId: user._id,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        price: selectedPlan.price,
        status: "active",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        weightAllowance: selectedPlan.weightAllowance,
        pickupsAllowed: selectedPlan.pickups,
        weightUsed: 0,
        pickupsUsed: 0,
        paymentMethod: {
          cardLast4: cardNumber.slice(-4),
          cardBrand: "Visa",
          expiryMonth,
          expiryYear
        },
        billingAddress: {
          address: paymentData.billingAddress,
          city: paymentData.city,
          zipCode: paymentData.zipCode
        }
      };

      const response = await fetch(`${API_URL}/api/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscriptionData)
      });

      if (response.ok) {
        setPaymentSuccess(true);
        setTimeout(() => {
          navigate("/subscription-management");
        }, 1500);
      } else {
        setPaymentError("Failed to create subscription. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError("An error occurred during payment processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>You must be logged in to subscribe to a plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/login")}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Choose a Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={selectedPlan?.id === plan.id ? "border-blue-500" : ""}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>₹{plan.price} / month</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Weight Allowance: {plan.weightAllowance}</p>
              <p>Pickups: {plan.pickups}</p>
              <Button
                className="mt-4 w-full"
                onClick={() => handlePlanSelect(plan)}
              >
                Select
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <form onSubmit={handlePaymentSubmit} className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Enter Payment Details</h2>
          <Input
            placeholder="Card Number"
            value={paymentData.cardNumber}
            onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
          />
          <Input
            placeholder="Card Holder Name"
            value={paymentData.cardHolder}
            onChange={(e) => setPaymentData({ ...paymentData, cardHolder: e.target.value })}
          />
          <Input
            placeholder="MM/YY"
            value={paymentData.expiry}
            onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
          />
          <Input
            placeholder="CVV"
            value={paymentData.cvv}
            onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
          />
          <Input
            placeholder="Billing Address"
            value={paymentData.billingAddress}
            onChange={(e) => setPaymentData({ ...paymentData, billingAddress: e.target.value })}
          />
          <Input
            placeholder="City"
            value={paymentData.city}
            onChange={(e) => setPaymentData({ ...paymentData, city: e.target.value })}
          />
          <Input
            placeholder="ZIP Code"
            value={paymentData.zipCode}
            onChange={(e) => setPaymentData({ ...paymentData, zipCode: e.target.value })}
          />

          {paymentError && <p className="text-red-500">{paymentError}</p>}
          {paymentSuccess && <p className="text-green-500">Payment Successful! Redirecting...</p>}

          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : `Pay ₹${selectedPlan.price}`}
          </Button>
        </form>
      )}
    </div>
  );
}
