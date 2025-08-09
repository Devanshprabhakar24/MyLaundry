import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Star, 
  Truck, 
  Shield, 
  Clock,
  Package,
  Crown,
  Users,
  Home
} from "lucide-react";

export default function Subscriptions() {
  const plans = [
    {
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

                  <Button className={`w-full ${plan.buttonStyle}`}>
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
            <Button className="bg-white text-laundry-blue hover:bg-gray-100 px-8 py-3 text-lg">
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
    </div>
  );
}
