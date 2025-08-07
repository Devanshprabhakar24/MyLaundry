import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Truck, 
  Package, 
  CheckCircle, 
  Clock,
  Shield,
  Smartphone,
  CreditCard,
  MapPin,
  Shirt,
  Sparkles,
  Bell
} from "lucide-react";

export default function HowItWorks() {
  const mainSteps = [
    {
      number: "1",
      title: "You Schedule",
      subtitle: "Book a pickup online or through our app",
      description: "Choose your preferred time slot that works for your schedule. Available 7 days a week.",
      icon: <Calendar className="h-12 w-12 text-laundry-blue" />,
      details: [
        "Select pickup date and time window",
        "Add special instructions for your items",
        "Choose services (wash & fold, dry cleaning, etc.)",
        "Confirm your address and contact details"
      ]
    },
    {
      number: "2",
      title: "We Collect & Clean",
      subtitle: "Our team picks up and professionally cleans your laundry",
      description: "Expert care using premium detergents and state-of-the-art equipment.",
      icon: <Package className="h-12 w-12 text-laundry-blue" />,
      details: [
        "Professional pickup by trained staff",
        "Items sorted and pre-treated for stains",
        "Washing with eco-friendly detergents",
        "Quality inspection and careful handling"
      ]
    },
    {
      number: "3",
      title: "We Deliver",
      subtitle: "Clean, folded laundry delivered back to your door",
      description: "Your fresh, clean clothes returned within 24 hours, perfectly folded and ready to wear.",
      icon: <Truck className="h-12 w-12 text-laundry-blue" />,
      details: [
        "Professional folding and packaging",
        "Items organized and labeled",
        "Delivery to your preferred location",
        "Contactless delivery option available"
      ]
    }
  ];

  const processDetails = [
    {
      icon: <Smartphone className="h-8 w-8 text-blue-600" />,
      title: "Easy Scheduling",
      description: "Book online in under 2 minutes or use our mobile app for even faster scheduling."
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: "Flexible Pickup",
      description: "We come to you - home, office, or anywhere within our service area."
    },
    {
      icon: <Shirt className="h-8 w-8 text-purple-600" />,
      title: "Professional Care",
      description: "Expert sorting, treating, and cleaning using premium, eco-friendly products."
    },
    {
      icon: <Bell className="h-8 w-8 text-orange-600" />,
      title: "Real-time Updates",
      description: "SMS and email notifications keep you informed every step of the way."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-pink-600" />,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee - we'll re-clean or refund if you're not happy."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-indigo-600" />,
      title: "Simple Payment",
      description: "Automatic billing with transparent pricing - no hidden fees or surprises."
    }
  ];

  const preparationTips = [
    {
      title: "Sort Your Items",
      description: "Separate delicates, dry clean only items, and regular laundry",
      icon: <Package className="h-6 w-6 text-laundry-blue" />
    },
    {
      title: "Check Pockets",
      description: "Remove all items from pockets (coins, tissues, etc.)",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />
    },
    {
      title: "Note Special Instructions",
      description: "Let us know about stains, fabric preferences, or special care needs",
      icon: <Shield className="h-6 w-6 text-orange-600" />
    },
    {
      title: "Have Items Ready",
      description: "Place laundry in a bag or basket near your pickup location",
      icon: <Clock className="h-6 w-6 text-purple-600" />
    }
  ];

  const timeline = [
    { time: "Day 1 - Pickup", event: "We collect your laundry during your scheduled window" },
    { time: "Day 1 - Processing", event: "Items are sorted, treated, and begin the cleaning process" },
    { time: "Day 2 - Quality Check", event: "Cleaned items are inspected, folded, and packaged" },
    { time: "Day 2 - Delivery", event: "Fresh, clean laundry is delivered back to you" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-laundry-light-blue to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-laundry-dark mb-6">How It Works</h1>
          <p className="text-xl text-laundry-gray max-w-3xl mx-auto mb-8">
            Experience the simplest way to get your laundry done. From pickup to delivery, 
            we've streamlined every step to save you time and effort.
          </p>
          <Button className="btn-primary text-lg px-8 py-4">
            Schedule Your First Pickup
          </Button>
        </div>
      </section>

      {/* Main Process Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {mainSteps.map((step, index) => (
              <div key={step.number} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-laundry-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                      {step.number}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-laundry-dark">{step.title}</h2>
                      <p className="text-laundry-blue font-medium">{step.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-xl text-laundry-gray mb-6">{step.description}</p>
                  
                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-laundry-gray">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex-1 flex justify-center">
                  <div className="bg-laundry-light-blue rounded-2xl p-12 w-full max-w-md">
                    <div className="text-center">
                      {step.icon}
                      <div className="mt-6 text-6xl font-bold text-laundry-blue/20">
                        {step.number}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Details */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">The MyLaundry Difference</h2>
            <p className="text-xl text-laundry-gray">Every detail designed for your convenience and peace of mind</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processDetails.map((detail, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {detail.icon}
                  </div>
                  <CardTitle className="text-xl">{detail.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-laundry-gray">{detail.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preparation Guide */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">How to Prepare Your Laundry</h2>
            <p className="text-xl text-laundry-gray">Follow these simple steps to ensure the best results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {preparationTips.map((tip, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {tip.icon}
                </div>
                <h3 className="text-lg font-semibold text-laundry-dark mb-2">{tip.title}</h3>
                <p className="text-sm text-laundry-gray">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-laundry-light-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">Your Laundry Journey</h2>
            <p className="text-xl text-laundry-gray">From pickup to delivery in 24 hours</p>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-center gap-6">
                <div className="bg-laundry-blue text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-laundry-dark">{item.time}</h3>
                  <p className="text-laundry-gray">{item.event}</p>
                </div>
                {index < timeline.length - 1 && (
                  <div className="hidden md:block w-full border-t-2 border-dashed border-laundry-blue/30 flex-shrink-0" style={{ width: '100px' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment & Delivery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="h-8 w-8 text-laundry-blue" />
                  <CardTitle className="text-2xl">Payment Process</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <strong>Automatic Billing:</strong> We charge your card after delivery completion
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <strong>Transparent Pricing:</strong> No hidden fees or surprise charges
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <strong>Secure Payments:</strong> All transactions protected with bank-level security
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <strong>Digital Receipts:</strong> Detailed invoices sent via email
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="h-8 w-8 text-laundry-blue" />
                  <CardTitle className="text-2xl">Delivery Options</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <strong>Standard Delivery:</strong> Next-day delivery during regular hours
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <strong>Contactless Option:</strong> Safe delivery without direct contact
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <strong>Flexible Locations:</strong> Home, office, or any address you specify
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <strong>Delivery Notifications:</strong> Real-time updates via SMS and email
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">Common Questions</h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-laundry-dark mb-2">What if I'm not home during pickup or delivery?</h3>
                <p className="text-laundry-gray">We offer flexible solutions including secure pickup/drop-off locations, contactless service, and rescheduling options.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-laundry-dark mb-2">How do you handle delicate or expensive items?</h3>
                <p className="text-laundry-gray">All items are treated with professional care. Delicate items receive special attention, and we're fully insured for your peace of mind.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-laundry-dark mb-2">Can I track my order status?</h3>
                <p className="text-laundry-gray">Yes! You'll receive SMS and email updates at every stage: pickup confirmation, processing, and delivery notification.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-laundry-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Experience the Difference?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who've made laundry effortless
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-laundry-blue hover:bg-gray-100 px-8 py-3 text-lg">
              Schedule Your First Pickup
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-laundry-blue px-8 py-3 text-lg">
              Download Our App
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
