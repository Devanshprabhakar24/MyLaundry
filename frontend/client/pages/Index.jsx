import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Truck, 
  Package, 
  CheckCircle, 
  Star, 
  Leaf, 
  Clock, 
  MessageSquare,
  WashingMachine,
  Shirt,
  Sparkles,
  Shield,
  Phone,
  Mail,
  MapPin,
  Users,
  Heart,
  Award
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [zipCode, setZipCode] = useState("");
  const [zipCodeResult, setZipCodeResult] = useState(null);

  const handleZipCodeCheck = (e) => {
    e.preventDefault();
    // Simple zip code validation for demo
    if (zipCode.length === 5 || zipCode.length === 6) {
      setZipCodeResult("Great! We serve your area.");
    } else {
      setZipCodeResult("Sorry, we're not in your area yet.");
    }
  };

  const services = [
    {
      icon: <WashingMachine className="h-8 w-8 text-laundry-blue" />,
      title: "Wash & Fold",
      description: "Professional washing and folding service",
      price: "From ₹35/kg",
    },
    {
      icon: <Shirt className="h-8 w-8 text-laundry-blue" />,
      title: "Dry Cleaning",
      description: "Expert dry cleaning for delicate items",
      price: "From ₹99/item",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-laundry-blue" />,
      title: "Ironing Services",
      description: "Professional pressing for crisp clothes",
      price: "From ₹19/item",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "Excellent service! My clothes come back perfectly clean and folded. The pickup and delivery is always on time.",
    },
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Best laundry service in the city. They handle my formal shirts with great care. Highly recommended!",
    },
    {
      name: "Anita Patel",
      rating: 5,
      comment: "Very affordable and professional. The staff is courteous and the quality is consistently good.",
    },
  ];

  const benefits = [
    {
      icon: <Clock className="h-6 w-6 text-laundry-blue" />,
      title: "24-Hour Service",
      description: "Get your laundry back clean and fresh within 24 hours",
    },
    {
      icon: <Truck className="h-6 w-6 text-green-600" />,
      title: "Free Pickup & Delivery",
      description: "Convenient doorstep service at no extra charge",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-purple-600" />,
      title: "Real-time Updates",
      description: "Stay informed with SMS and email order updates",
    },
    {
      icon: <Shield className="h-6 w-6 text-orange-600" />,
      title: "Satisfaction Guarantee",
      description: "100% satisfaction guarantee or we'll make it right",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "50,000+", label: "Orders Completed" },
    { number: "24hrs", label: "Turnaround Time" },
    { number: "99.9%", label: "Customer Satisfaction" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-laundry-light-blue to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-laundry-dark mb-6">
              The Easiest Way to <span className="text-laundry-blue">Do Your Laundry</span>
            </h1>
            <p className="text-xl text-laundry-gray mb-8 max-w-2xl mx-auto">
              Premium washing, folding, and dry cleaning delivered to your door. 
              Say goodbye to laundry day and hello to more free time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                className="btn-primary text-lg px-8 py-4"
                onClick={() => navigate(isAuthenticated ? '/new-order' : '/login')}
              >
                Schedule a Pickup
              </Button>
              <Button 
                variant="outline" 
                className="border-laundry-blue text-laundry-blue hover:bg-laundry-blue hover:text-white text-lg px-8 py-4"
                onClick={() => navigate('/services')}
              >
                View Pricing
              </Button>
            </div>
            
            {/* Hero Image Placeholder */}
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
              <div className="h-64 bg-gradient-to-r from-laundry-light-blue to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <WashingMachine className="h-16 w-16 text-laundry-blue mx-auto mb-4" />
                  <p className="text-laundry-gray">Clean, folded laundry delivered to your door</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-laundry-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">How It Works</h2>
            <p className="text-xl text-laundry-gray">Simple, convenient, and reliable laundry service in 3 easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-laundry-light-blue rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-laundry-blue" />
              </div>
              <h3 className="text-xl font-semibold text-laundry-dark mb-4">1. Schedule Pickup</h3>
              <p className="text-laundry-gray">
                Book a pickup online or via phone. Choose your preferred time slot and we'll collect your laundry from your doorstep.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-laundry-light-blue rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <WashingMachine className="h-10 w-10 text-laundry-blue" />
              </div>
              <h3 className="text-xl font-semibold text-laundry-dark mb-4">2. We Clean & Care</h3>
              <p className="text-laundry-gray">
                Our expert team cleans your clothes using premium detergents and state-of-the-art equipment with utmost care.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-laundry-light-blue rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Truck className="h-10 w-10 text-laundry-blue" />
              </div>
              <h3 className="text-xl font-semibold text-laundry-dark mb-4">3. Doorstep Delivery</h3>
              <p className="text-laundry-gray">
                Get your freshly cleaned, folded, and packaged clothes delivered back to your doorstep within 24 hours.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              className="btn-primary text-lg px-8 py-4"
              onClick={() => navigate('/how-it-works')}
            >
              Learn More About Our Process
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">Our Services</h2>
            <p className="text-xl text-laundry-gray">Complete laundry solutions for all your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-laundry-blue bg-laundry-light-blue">
                    {service.price}
                  </Badge>
                  <Button 
                    className="w-full mt-4 btn-secondary"
                    onClick={() => navigate('/services')}
                  >
                    View Pricing
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area Checker */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-laundry-dark mb-4">Do We Serve Your Area?</h2>
          <p className="text-xl text-laundry-gray mb-8">
            Enter your pin code to check if we deliver to your location
          </p>

          <form onSubmit={handleZipCodeCheck} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Enter pin code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="flex-1"
              maxLength={6}
            />
            <Button type="submit" className="btn-primary">
              Check Area
            </Button>
          </form>

          {zipCodeResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              zipCodeResult.includes("Great") 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-orange-50 text-orange-700 border border-orange-200"
            }`}>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{zipCodeResult}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-laundry-light-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">What Our Customers Say</h2>
            <p className="text-xl text-laundry-gray">Trusted by thousands of satisfied customers</p>
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
                  <p className="font-semibold text-laundry-dark">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">Why Choose MyLaundry?</h2>
            <p className="text-xl text-laundry-gray">The benefits that set us apart</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-laundry-dark mb-2">{benefit.title}</h3>
                <p className="text-sm text-laundry-gray">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-laundry-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers and experience the convenience of MyLaundry
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-laundry-blue hover:bg-gray-100 px-8 py-4 text-lg"
              onClick={() => navigate(isAuthenticated ? '/new-order' : '/login')}
            >
              Schedule Your First Pickup
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-laundry-blue px-8 py-4 text-lg"
              onClick={() => navigate('/subscriptions')}
            >
              View Subscription Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
