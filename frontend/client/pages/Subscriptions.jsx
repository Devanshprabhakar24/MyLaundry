import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircle,
  Star,
  Truck,
  Shield,
  Clock,
  Package,
  Crown,
  Users,
  Home,
  CreditCard,
  Lock,
  Check,
  X,
  Loader2
} from "lucide-react";
import API_URL from '../apiConfig';

export default function Subscriptions() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
    billingAddress: "",
    city: "",
    zipCode: ""
  });

  const plans = [
    {
      id: "basic",
      name: "Basic",
      icon: <Home className="h-8 w-8" />,
      price: 29.99,
      originalPrice: 39.99,
      savings: 25,
      description: "Perfect for individuals or couples",
      weightAllowance: "5kg",
      pickups: 2,
      features: [
        "5kg monthly weight allowance",
        "2 pickups per month",
        "Wash & fold service",
        "Free pickup & delivery",
        "SMS notifications",
        "Basic stain treatment"
      ],
      color: "bg-gray-100",
      textColor: "text-gray-800",
      buttonStyle: "btn-secondary"
    },
    {
      id: "family",
      name: "Family",
      icon: <Users className="h-8 w-8" />,
      price: 49.99,
      originalPrice: 69.99,
      savings: 29,
      description: "Ideal for families of 3-4 people",
      weightAllowance: "12kg",
      pickups: 4,
      features: [
        "12kg monthly weight allowance",
        "4 pickups per month",
        "Wash & fold + basic dry cleaning",
        "Free pickup & delivery",
        "Priority scheduling",
        "Advanced stain treatment",
        "Same-day service available",
        "Family bundle discounts"
      ],
      color: "bg-laundry-light-blue",
      textColor: "text-laundry-blue",
      buttonStyle: "btn-primary",
      popular: true
    },
    {
      id: "premium",
      name: "Premium",
      icon: <Crown className="h-8 w-8" />,
      price: 79.99,
      originalPrice: 109.99,
      savings: 27,
      description: "Ultimate convenience for busy families",
      weightAllowance: "20kg",
      pickups: 8,
      features: [
        "20kg monthly weight allowance",
        "8 pickups per month (2 per week)",
        "All services included",
        "Priority express delivery",
        "Dedicated account manager",
        "Premium care for delicates",
        "Free dry cleaning (up to 5 items)",
        "Emergency same-day service",
        "Eco-friendly premium options"
      ],
      color: "bg-gradient-to-br from-yellow-100 to-orange-100",
      textColor: "text-orange-800",
      buttonStyle: "btn-primary"
    }
  ];

  const benefits = [
    {
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: "Guaranteed Savings",
      description: "Save 25-30% compared to pay-per-use pricing"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Priority Service",
      description: "Members get priority scheduling and faster turnaround"
    },
    {
      icon: <Truck className="h-6 w-6 text-purple-600" />,
      title: "Free Delivery",
      description: "Unlimited free pickup and delivery within service area"
    },
    {
      icon: <Package className="h-6 w-6 text-orange-600" />,
      title: "Flexible Usage",
      description: "Unused allowance rolls over for up to 2 months"
    }
  ];

  const testimonials = [
    {
      name: "Jennifer Martinez",
      plan: "Family Plan",
      rating: 5,
      comment: "The Family plan has been a game-changer for our household. With three kids, laundry was overwhelming. Now it's completely off my plate!"
    },
    {
      name: "David Chen",
      plan: "Premium Plan",
      rating: 5,
      comment: "As a busy executive, the Premium plan's twice-weekly pickup is perfect. My dedicated account manager always ensures everything is perfect."
    },
    {
      name: "Sarah Johnson",
      plan: "Basic Plan",
      rating: 5,
      comment: "Great value for money! The Basic plan covers all my needs as a single professional, and the quality is consistently excellent."
    }
  ];

  // Called when user chooses a plan
  const handlePlanSelect = (plan) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
    setPaymentError("");
    setPaymentSuccess(false);
    // Reset payment data
    setPaymentData({
      cardNumber: "",
      cardHolder: "",
      expiry: "",
      cvv: "",
      billingAddress: "",
      city: "",
      zipCode: ""
    });
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setPaymentError("");
    setPaymentSuccess(false);
    setIsProcessing(false);
  };

  // Helper: sanitize card input while typing (allow digits and spaces). Format on blur.
  const onCardInputChange = (value) => {
    // allow digits and spaces, max 19 chars (16 digits + 3 spaces)
    const sanitized = value.replace(/[^\d\s]/g, "").slice(0, 19);
    setPaymentData(prev => ({ ...prev, cardNumber: sanitized }));
  };

  // Format card number into groups of 4 on blur
  const onCardBlur = () => {
    const digits = paymentData.cardNumber.replace(/\D/g, "").slice(0, 16);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) parts.push(digits.substring(i, i + 4));
    setPaymentData(prev => ({ ...prev, cardNumber: parts.join(" ") }));
  };

  // For expiry, allow typing digits and slash. Format on blur to MM/YY if possible.
  const onExpiryChange = (value) => {
    const sanitized = value.replace(/[^\d\/]/g, "").slice(0, 5);
    setPaymentData(prev => ({ ...prev, expiry: sanitized }));
  };

  const onExpiryBlur = () => {
    const v = paymentData.expiry.replace(/\D/g, "");
    if (v.length >= 2) {
      const mm = v.substring(0, 2);
      const yy = v.substring(2, 4);
      const formatted = yy ? `${mm}/${yy}` : `${mm}`;
      setPaymentData(prev => ({ ...prev, expiry: formatted }));
    }
  };

  // Generic onChange for simple fields
  const onFieldChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError("");
     // Add a guard to ensure user and user._id are available
    if (!user || !user._id) {
      setPaymentError("Your session has expired. Please log out and log back in.");
      setIsProcessing(false);
      return;
    }

    // Validate required fields
    if (!paymentData.cardNumber || !paymentData.cardHolder || !paymentData.expiry || !paymentData.cvv || !paymentData.billingAddress || !paymentData.city || !paymentData.zipCode) {
      setPaymentError("Please fill in all required fields.");
      setIsProcessing(false);
      return;
    }

    // Validate card number length (digits only)
    const cardNumberDigits = paymentData.cardNumber.replace(/\s/g, '');
    if (cardNumberDigits.length !== 16) {
      setPaymentError("Please enter a valid 16-digit card number.");
      setIsProcessing(false);
      return;
    }

    // Validate expiry date format
    const expiryParts = paymentData.expiry.split('/');
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      setPaymentError("Please enter a valid expiry date (MM/YY).");
      setIsProcessing(false);
      return;
    }

    // Validate CVV length >=3
    if (paymentData.cvv.length < 3) {
      setPaymentError("Please enter a valid CVV.");
      setIsProcessing(false);
      return;
    }

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Fake payment gateway simulation
      const paymentResult = await simulatePayment(paymentData);

      if (paymentResult.success) {
        // Extract expiry month and year
        const expiryPartsLocal = paymentData.expiry.split('/');
        const expiryMonth = expiryPartsLocal[0] || '';
        const expiryYear = expiryPartsLocal[1] || '';

        // Create subscription payload
        const subscriptionData = {
          userId: user._id,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          price: selectedPlan.price,
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          weightAllowance: selectedPlan.weightAllowance,
          pickupsAllowed: selectedPlan.pickups,
          weightUsed: 0,
          pickupsUsed: 0,
          paymentMethod: {
            cardLast4: cardNumberDigits.slice(-4),
            cardBrand: 'Visa',
            expiryMonth: expiryMonth,
            expiryYear: expiryYear
          },
          billingAddress: {
            address: paymentData.billingAddress,
            city: paymentData.city,
            zipCode: paymentData.zipCode
          }
        };

        const response = await fetch(`${API_URL}/api/subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscriptionData),
        });

        if (response.ok) {
          setPaymentSuccess(true);
          // small delay so user sees success
          setTimeout(() => {
            handleCloseModal();
            navigate('/dashboard');
          }, 1500);
        } else {
          setPaymentError("Failed to create subscription. Please try again.");
        }
      } else {
        setPaymentError(paymentResult.message || "Payment failed. Please check your card details.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError("An error occurred during payment processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const simulatePayment = async (paymentDataLocal) => {
    const cardNumber = paymentDataLocal.cardNumber.replace(/\s/g, '');

    if (cardNumber === '4000000000000002') {
      return { success: false, message: "Card declined. Please try a different card." };
    }

    if (cardNumber === '4000000000009995') {
      return { success: false, message: "Insufficient funds." };
    }

    if (cardNumber === '4000000000009987') {
      return { success: false, message: "Card expired." };
    }

    if (cardNumber.length === 16 && cardNumber.startsWith('4')) {
      return { success: true, transactionId: 'txn_' + Math.random().toString(36).substr(2, 9) };
    }

    return { success: false, message: "Invalid card number." };
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      const month = v.substring(0, 2);
      const year = v.substring(2, 4);
      return year ? month + '/' + year : month;
    }
    return v;
  };

  // If user is not authenticated show login CTA
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Please login</CardTitle>
            <CardDescription>You need to login to subscribe to a plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/login')}>Login</Button>
              <Button variant="outline" onClick={() => navigate('/signup')}>Sign Up</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-laundry-light-blue to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-laundry-dark mb-6">Laundry Club Membership</h1>
          <p className="text-xl text-laundry-gray max-w-3xl mx-auto mb-8">
            Join thousands of satisfied members and save up to 30% on all your laundry needs. 
            More convenience, better prices, premium service.
          </p>
          <Badge className="bg-laundry-blue text-white px-4 py-2 text-lg">
            🎉 Limited Time: First Month 50% Off!
          </Badge>
        </div>
      </section>

      {/* Plans Comparison */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">Choose Your Perfect Plan</h2>
            <p className="text-xl text-laundry-gray">All plans include our satisfaction guarantee and can be canceled anytime</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={plan.name} className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-laundry-blue scale-105' : ''} transition-transform hover:scale-105`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-laundry-blue text-white px-4 py-1">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`${plan.textColor} mx-auto mb-4`}>
                    {plan.icon}
                  </div>
                  <CardTitle className={`text-2xl ${plan.textColor}`}>{plan.name}</CardTitle>
                  <CardDescription className={plan.textColor}>{plan.description}</CardDescription>
                  
                  <div className="pt-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold text-laundry-blue">₹{plan.price}</span>
                      <span className="text-laundry-gray">/month</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-sm text-laundry-gray line-through">₹{plan.originalPrice}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Save {plan.savings}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-laundry-blue">{plan.weightAllowance}</div>
                      <div className="text-sm text-laundry-gray">Monthly Weight</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-laundry-blue">{plan.pickups}</div>
                      <div className="text-sm text-laundry-gray">Pickups/Month</div>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-laundry-gray">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${plan.buttonStyle}`}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {plan.popular ? "Start Free Trial" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-laundry-gray mb-4">Not sure which plan is right for you?</p>
            <Button variant="outline" className="border-laundry-blue text-laundry-blue">
              Get Personalized Recommendation
            </Button>
          </div>
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">Membership Benefits</h2>
            <p className="text-xl text-laundry-gray">Exclusive perks for Laundry Club members</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-laundry-dark mb-2">{benefit.title}</h3>
                <p className="text-sm text-laundry-gray">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works for Members */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">How Membership Works</h2>
            <p className="text-xl text-laundry-gray">Simple, seamless service designed around your schedule</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-laundry-blue rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-laundry-dark mb-3">Choose Your Plan</h3>
              <p className="text-laundry-gray">
                Select the membership that fits your household size and laundry needs. Start with a free trial.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-laundry-blue rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-laundry-dark mb-3">Schedule Regular Pickups</h3>
              <p className="text-laundry-gray">
                Set your preferred pickup schedule. We'll automatically come to collect your laundry based on your plan.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-laundry-blue rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-laundry-dark mb-3">Enjoy Premium Service</h3>
              <p className="text-laundry-gray">
                Receive priority processing, premium care, and flexible scheduling as a valued member.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Member Testimonials */}
      <section className="py-20 bg-laundry-light-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">What Our Members Say</h2>
            <p className="text-xl text-laundry-gray">Real feedback from satisfied Laundry Club members</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-laundry-gray mb-4 italic">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-semibold text-laundry-dark">{testimonial.name}</p>
                    <p className="text-sm text-laundry-blue">{testimonial.plan} Member</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-laundry-dark mb-2">Can I change my plan anytime?</h3>
                <p className="text-laundry-gray">Yes! You can upgrade, downgrade, or cancel your membership at any time. Changes take effect in your next billing cycle.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-laundry-dark mb-2">What happens to unused allowance?</h3>
                <p className="text-laundry-gray">Unused weight allowance rolls over for up to 2 months, so you never lose what you've paid for.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-laundry-dark mb-2">Is there a commitment period?</h3>
                <p className="text-laundry-gray">No long-term commitment required. You can cancel anytime with 30 days notice.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-laundry-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Join the Laundry Club?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your free trial today and experience the convenience of membership
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-laundry-blue hover:bg-gray-100 px-8 py-3 text-lg"
              onClick={() => handlePlanSelect(plans[1])} // Default to Family plan
            >
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-laundry-blue px-8 py-3 text-lg">
              Compare All Plans
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            No credit card required for free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Payment Modal (single set of inputs, formatted on blur) */}
      {/*
        Modal remains mounted only when showPaymentModal === true.
        Inputs are controlled and sanitized on change to avoid cursor jump/focus loss.
      */}
      {showPaymentModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-laundry-blue to-blue-600 p-2 rounded-lg">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Complete Subscription</h2>
                    <p className="text-sm text-gray-500">Secure payment processing</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Plan Summary */}
              <div className="bg-gradient-to-r from-laundry-light-blue to-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedPlan?.name} Plan</h3>
                    <p className="text-sm text-gray-600">Monthly subscription</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-laundry-blue">₹{selectedPlan?.price}</div>
                    <div className="text-xs text-gray-500">per month</div>
                  </div>
                </div>
              </div>

              {paymentSuccess ? (
                <div className="text-center py-8">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-3">Payment Successful!</h3>
                  <p className="text-green-600 mb-6">Your {selectedPlan?.name} subscription is now active.</p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">Subscription Details</span>
                    </div>
                    <div className="text-sm text-green-700">
                      <p>Plan: {selectedPlan?.name}</p>
                      <p>Amount: ₹{selectedPlan?.price}/month</p>
                      <p>Status: Active</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    Redirecting to dashboard in a few seconds...
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePaymentSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-laundry-blue rounded-full"></div>
                      <h3 className="font-semibold text-gray-900">Payment Information</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentData.cardNumber}
                          onChange={(e) => onCardInputChange(e.target.value)}
                          onBlur={onCardBlur}
                          maxLength={19}
                          required
                          className="border-gray-300 focus:border-laundry-blue focus:ring-laundry-blue"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="expiry" className="text-sm font-medium text-gray-700">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={paymentData.expiry}
                            onChange={(e) => onExpiryChange(e.target.value)}
                            onBlur={onExpiryBlur}
                            maxLength={5}
                            required
                            className="border-gray-300 focus:border-laundry-blue focus:ring-laundry-blue"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
                            maxLength={4}
                            required
                            className="border-gray-300 focus:border-laundry-blue focus:ring-laundry-blue"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardHolder" className="text-sm font-medium text-gray-700">Cardholder Name</Label>
                        <Input
                          id="cardHolder"
                          placeholder="John Doe"
                          value={paymentData.cardHolder}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, cardHolder: e.target.value }))}
                          required
                          className="border-gray-300 focus:border-laundry-blue focus:ring-laundry-blue"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h3 className="font-semibold text-gray-900">Billing Information</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="billingAddress" className="text-sm font-medium text-gray-700">Billing Address</Label>
                        <Input
                          id="billingAddress"
                          placeholder="123 Main Street"
                          value={paymentData.billingAddress}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, billingAddress: e.target.value }))}
                          required
                          className="border-gray-300 focus:border-laundry-blue focus:ring-laundry-blue"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                          <Input
                            id="city"
                            placeholder="Mumbai"
                            value={paymentData.city}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, city: e.target.value }))}
                            required
                            className="border-gray-300 focus:border-laundry-blue focus:ring-laundry-blue"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            placeholder="400001"
                            value={paymentData.zipCode}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, zipCode: e.target.value }))}
                            required
                            className="border-gray-300 focus:border-laundry-blue focus:ring-laundry-blue"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-700 font-medium">Payment Error</span>
                      </div>
                      <p className="text-red-600 text-sm mt-1">{paymentError}</p>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-1 rounded-full">
                        <Lock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">Secure Payment</h4>
                        <p className="text-xs text-blue-700 mt-1">
                          Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseModal}
                      className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-laundry-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing Payment...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Subscribe for ₹{selectedPlan?.price}</span>
                        </div>
                      )}
                    </Button>
                  </div>

                  {/* Terms */}
                  <p className="text-xs text-gray-500 text-center">
                    By subscribing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
