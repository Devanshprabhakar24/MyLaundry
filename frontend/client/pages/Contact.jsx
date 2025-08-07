import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare,
  Headphones,
  Users,
  HelpCircle,
  Send
} from "lucide-react";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Thank you for your message! We'll get back to you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: ""
      });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-laundry-blue" />,
      title: "Phone Support",
      details: "(123) 456-7890",
      description: "Call us for immediate assistance",
      availability: "Mon-Fri: 7AM-9PM, Weekends: 8AM-7PM"
    },
    {
      icon: <Mail className="h-6 w-6 text-laundry-blue" />,
      title: "Email Support",
      details: "support@mylaundry.com",
      description: "Send us an email anytime",
      availability: "Response within 24 hours"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-laundry-blue" />,
      title: "Live Chat",
      details: "Available on website",
      description: "Chat with our support team",
      availability: "Mon-Fri: 8AM-8PM"
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "7:00 AM - 9:00 PM", pickup: "Yes", delivery: "Yes" },
    { day: "Saturday", hours: "8:00 AM - 7:00 PM", pickup: "Yes", delivery: "Yes" },
    { day: "Sunday", hours: "9:00 AM - 6:00 PM", pickup: "Limited", delivery: "Yes" }
  ];

  const serviceAreas = [
    "Downtown District",
    "Midtown Area", 
    "University District",
    "Residential Hills",
    "Business Park",
    "Suburban Communities"
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "pricing", label: "Pricing Question" },
    { value: "service", label: "Service Issue" },
    { value: "billing", label: "Billing Question" },
    { value: "partnership", label: "Business Partnership" },
    { value: "feedback", label: "Feedback & Suggestions" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-laundry-light-blue to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-laundry-dark mb-6">Contact Us</h1>
          <p className="text-xl text-laundry-gray max-w-3xl mx-auto">
            Have questions? Need support? We're here to help! 
            Get in touch with our friendly team for any assistance you need.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">Get In Touch</h2>
            <p className="text-xl text-laundry-gray">Choose the way that works best for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 bg-laundry-light-blue rounded-full w-16 h-16 flex items-center justify-center">
                    {info.icon}
                  </div>
                  <CardTitle className="text-xl">{info.title}</CardTitle>
                  <CardDescription className="text-lg font-medium text-laundry-blue">
                    {info.details}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-laundry-gray mb-2">{info.description}</p>
                  <p className="text-sm text-laundry-gray font-medium">{info.availability}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Send className="h-10 w-10 text-laundry-blue" />
              </div>
              <CardTitle className="text-3xl">Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Type of Inquiry</Label>
                    <Select onValueChange={(value) => handleInputChange("inquiryType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Enter message subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    rows={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Message..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Business Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Business Hours */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-8 w-8 text-laundry-blue" />
                  <CardTitle className="text-2xl">Business Hours</CardTitle>
                </div>
                <CardDescription>
                  Our pickup and delivery schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-laundry-dark">{schedule.day}</h3>
                        <p className="text-laundry-gray">{schedule.hours}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-laundry-gray">
                          <span className="block">Pickup: {schedule.pickup}</span>
                          <span className="block">Delivery: {schedule.delivery}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-laundry-light-blue rounded-lg">
                  <h4 className="font-semibold text-laundry-blue mb-2">Holiday Hours</h4>
                  <p className="text-sm text-laundry-gray">
                    We operate on modified schedules during holidays. 
                    Check our website or call for holiday-specific hours.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Service Areas */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-8 w-8 text-laundry-blue" />
                  <CardTitle className="text-2xl">Service Areas</CardTitle>
                </div>
                <CardDescription>
                  We proudly serve these areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {serviceAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span className="text-laundry-gray">{area}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-laundry-light-blue rounded-lg">
                  <h4 className="font-semibold text-laundry-blue mb-2">Don't See Your Area?</h4>
                  <p className="text-sm text-laundry-gray mb-3">
                    We're expanding! Contact us to see if we can serve your location.
                  </p>
                  <Button variant="outline" size="sm" className="border-laundry-blue text-laundry-blue">
                    Check Service Availability
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">Visit Our Location</h2>
            <p className="text-xl text-laundry-gray">Our main facility and customer service center</p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Map Placeholder */}
                <div className="bg-gray-200 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-laundry-blue mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-laundry-dark mb-2">Interactive Map</h3>
                    <p className="text-laundry-gray">
                      Embedded Google Maps would appear here<br />
                      showing our main facility location
                    </p>
                  </div>
                </div>

                {/* Location Details */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-laundry-dark mb-6">MyLaundry Main Facility</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-laundry-blue mt-1" />
                      <div>
                        <h4 className="font-semibold text-laundry-dark">Address</h4>
                        <p className="text-laundry-gray">
                          123 Clean Street<br />
                          Laundry District, City 12345
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-laundry-blue mt-1" />
                      <div>
                        <h4 className="font-semibold text-laundry-dark">Phone</h4>
                        <p className="text-laundry-gray">(123) 456-7890</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-laundry-blue mt-1" />
                      <div>
                        <h4 className="font-semibold text-laundry-dark">Email</h4>
                        <p className="text-laundry-gray">support@mylaundry.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-laundry-blue mt-1" />
                      <div>
                        <h4 className="font-semibold text-laundry-dark">Customer Service Hours</h4>
                        <p className="text-laundry-gray">
                          Monday - Friday: 8:00 AM - 6:00 PM<br />
                          Saturday: 9:00 AM - 5:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button className="btn-primary w-full">
                      Get Directions
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Support Resources */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-laundry-dark mb-4">Need Quick Help?</h2>
            <p className="text-xl text-laundry-gray">Check out these resources for instant answers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <HelpCircle className="h-12 w-12 text-laundry-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-laundry-dark mb-2">FAQ</h3>
                <p className="text-laundry-gray mb-4">
                  Find answers to common questions about our services, pricing, and policies.
                </p>
                <Button variant="outline" className="border-laundry-blue text-laundry-blue">
                  View FAQ
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Headphones className="h-12 w-12 text-laundry-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-laundry-dark mb-2">Live Chat</h3>
                <p className="text-laundry-gray mb-4">
                  Chat with our support team for real-time assistance with your questions.
                </p>
                <Button variant="outline" className="border-laundry-blue text-laundry-blue">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-laundry-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-laundry-dark mb-2">Community</h3>
                <p className="text-laundry-gray mb-4">
                  Join our community forum to connect with other customers and get tips.
                </p>
                <Button variant="outline" className="border-laundry-blue text-laundry-blue">
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
