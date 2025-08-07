import React from "react";
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Layout } from "./components/Layout.jsx";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Services from "./pages/Services.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Contact from "./pages/Contact.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Garments from "./pages/Garments.jsx";
import NewOrder from "./pages/NewOrder.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Profile from "./pages/Profile.jsx";
import Help from "./pages/Help.jsx";

const queryClient = new QueryClient();

// Placeholder component for unimplemented pages
const PlaceholderPage = ({ title }) => (
  <Layout>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <h1 className="text-3xl font-bold text-laundry-dark mb-4">{title}</h1>
        <p className="text-laundry-gray mb-6">
          This page is under construction. Please continue prompting to have the content generated for this page.
        </p>
        <div className="bg-laundry-light-blue p-6 rounded-lg">
          <p className="text-sm text-laundry-blue">
            💡 Tip: Ask the AI to create the content for this specific page to see it come to life!
          </p>
        </div>
      </div>
    </div>
  </Layout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/services" element={<Layout><Services /></Layout>} />
            <Route path="/subscriptions" element={<Layout><Subscriptions /></Layout>} />
            <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/about" element={<PlaceholderPage title="About Us" />} />
            <Route path="/faq" element={<PlaceholderPage title="Frequently Asked Questions" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* User Dashboard Routes */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/garments" element={<Layout><Garments /></Layout>} />
            <Route path="/new-order" element={<Layout><NewOrder /></Layout>} />
            <Route path="/track-order" element={<Layout><TrackOrder /></Layout>} />
            <Route path="/my-orders" element={<Layout><MyOrders /></Layout>} />
            <Route path="/MyOrders" element={<Layout><MyOrders /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />

            {/* Public Pages */}
            <Route path="/help" element={<Layout><Help /></Layout>} />

            {/* Admin Dashboard Routes */}
            <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/AdminDashboard" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/admin/orders" element={<PlaceholderPage title="Admin - Manage Orders" />} />
            <Route path="/admin/customers" element={<PlaceholderPage title="Admin - Customers" />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")).render(<App />);
