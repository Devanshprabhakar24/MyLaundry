import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  HelpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  Users,
  Star,
  Send,
  Headphones
} from "lucide-react";

export default function Help() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [chatMessage, setChatMessage] = useState("");
  const [supportForm, setSupportForm] = useState({
    subject: "",
    category: "",
    message: "",
    priority: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "all", name: "All Topics", count: 25 },
    { id: "orders", name: "Orders & Tracking", count: 8 },
    { id: "billing", name: "Billing & Payment", count: 6 },
    { id: "account", name: "Account Management", count: 4 },
    { id: "services", name: "Services & Pricing", count: 5 },
    { id: "technical", name: "Technical Issues", count: 2 }
  ];

  const faqs = [
    {
      id: 1,
      category: "orders",
      question: "How do I track my order?",
      answer: "You can track your order by entering your Order ID on the Track Order page, or by logging into your account and viewing your order history. You'll also receive SMS and email updates at each stage.",
      helpful: 24,
      views: 156
    },
    {
      id: 2,
      category: "orders", 
      question: "What is your turnaround time?",
      answer: "Our standard turnaround is 24 hours for wash & fold and 48 hours for dry cleaning. Express service is available for same-day delivery with an additional fee.",
      helpful: 19,
      views: 142
    },
    {
      id: 3,
      category: "billing",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and digital wallets like Apple Pay and Google Pay. Payment is processed after successful delivery.",
      helpful: 15,
      views: 98
    },
    {
      id: 4,
      category: "services",
      question: "Do you handle delicate items?",
      answer: "Yes, we specialize in delicate items including silk, cashmere, and designer clothing. Our expert team uses appropriate cleaning methods and premium eco-friendly products for each fabric type.",
      helpful: 22,
      views: 87
    },
    {
      id: 5,
      category: "account",
      question: "How do I change my delivery address?",
      answer: "You can add or modify addresses in your account settings under the 'Addresses' tab. You can also specify a different delivery address when placing a new order.",
      helpful: 18,
      views: 76
    },
    {
      id: 6,
      category: "billing",
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer a 100% satisfaction guarantee. If you're not happy with our service, contact us within 24 hours of delivery and we'll re-clean your items for free or provide a full refund.",
      helpful: 31,
      views: 203
    },
    {
      id: 7,
      category: "services",
      question: "What areas do you serve?",
      answer: "We currently serve the metropolitan area including Downtown, Midtown, University District, and surrounding neighborhoods. Check our service area tool on the homepage to confirm coverage for your location.",
      helpful: 12,
      views: 65
    },
    {
      id: 8,
      category: "technical",
      question: "The app isn't working properly, what should I do?",
      answer: "Try clearing your browser cache or updating the app. If issues persist, contact our technical support team at tech@mylaundry.com or use the live chat feature.",
      helpful: 8,
      views: 43
    }
  ];

  const quickActions = [
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: <MessageCircle className="h-6 w-6" />,
      action: () => alert("Live chat would open here"),
      available: true
    },
    {
      title: "Call Support",
      description: "Speak with an agent",
      icon: <Phone className="h-6 w-6" />,
      action: () => window.open("tel:+1234567890"),
      available: true
    },
    {
      title: "Email Support",
      description: "Send us an email",
      icon: <Mail className="h-6 w-6" />,
      action: () => window.open("mailto:support@mylaundry.com"),
      available: true
    },
    {
      title: "Video Tutorials",
      description: "Watch how-to videos",
      icon: <Video className="h-6 w-6" />,
      action: () => alert("Video library would open here"),
      available: true
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitTicket = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Support ticket submitted successfully! We'll get back to you within 24 hours.");
      setSupportForm({ subject: "", category: "", message: "", priority: "medium" });
    }, 1000);
  };

  const handleSendChatMessage = () => {
    if (chatMessage.trim()) {
      alert(`Chat message sent: "${chatMessage}"`);
      setChatMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-laundry-dark mb-4">Help & Support Center</h1>
          <p className="text-xl text-laundry-gray max-w-3xl mx-auto">
            Find answers to common questions, get support, and learn how to make the most of MyLaundry
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
              <CardContent className="p-6 text-center">
                <div className="bg-laundry-light-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <div className="text-laundry-blue">{action.icon}</div>
                </div>
                <h3 className="font-semibold text-laundry-dark mb-2">{action.title}</h3>
                <p className="text-sm text-laundry-gray">{action.description}</p>
                {action.available && (
                  <Badge className="mt-2 bg-green-100 text-green-800">Available Now</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-laundry-blue" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laundry-gray" />
                    <Input
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className={selectedCategory === category.id ? "btn-primary" : ""}
                      >
                        {category.name}
                        <Badge variant="secondary" className="ml-2">
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* FAQ Accordion */}
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border rounded-lg">
                      <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50">
                        <div className="text-left">
                          <div className="font-medium">{faq.question}</div>
                          <div className="flex items-center gap-4 text-xs text-laundry-gray mt-1">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {faq.helpful} helpful
                            </span>
                            <span>{faq.views} views</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <p className="text-laundry-gray mb-4">{faq.answer}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-laundry-gray">Was this helpful?</span>
                          <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Yes
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            No
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8 text-laundry-gray">
                    <HelpCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
                    <p>Try adjusting your search or category filter</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Support Sidebar */}
          <div className="space-y-6">
            {/* Live Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-laundry-blue" />
                  Live Chat
                </CardTitle>
                <CardDescription>Get instant help from our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Support Agent</span>
                    </div>
                    <p>Hi! How can I help you today?</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    />
                    <Button onClick={handleSendChatMessage} size="sm" className="btn-primary">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-laundry-gray">
                    <Clock className="h-3 w-3" />
                    <span>Average response time: 2 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-laundry-blue" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-laundry-blue" />
                  <div>
                    <div className="font-medium">(123) 456-7890</div>
                    <div className="text-sm text-laundry-gray">24/7 Support Hotline</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-laundry-blue" />
                  <div>
                    <div className="font-medium">support@mylaundry.com</div>
                    <div className="text-sm text-laundry-gray">Response within 24 hours</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-laundry-blue" />
                  <div>
                    <div className="font-medium">Business Hours</div>
                    <div className="text-sm text-laundry-gray">Mon-Fri: 7AM-9PM</div>
                    <div className="text-sm text-laundry-gray">Weekends: 8AM-7PM</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Ticket */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-laundry-blue" />
                  Submit Support Ticket
                </CardTitle>
                <CardDescription>For complex issues that need detailed attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="Brief description of your issue"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={supportForm.category}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">Select category</option>
                    <option value="orders">Orders & Tracking</option>
                    <option value="billing">Billing & Payment</option>
                    <option value="account">Account Issues</option>
                    <option value="technical">Technical Problems</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select 
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={supportForm.priority}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Describe your issue in detail..."
                    rows={4}
                    value={supportForm.message}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>
                
                <Button 
                  onClick={handleSubmitTicket}
                  disabled={isSubmitting || !supportForm.subject || !supportForm.message}
                  className="w-full btn-primary"
                >
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
