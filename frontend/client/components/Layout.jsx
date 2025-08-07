import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Shirt,
  Phone,
  Mail,
  Facebook,
  Instagram,
  MapPin,
  Clock,
  LayoutDashboard,
  Package,
  Home,
  Plus,
  Search,
  List,
  Settings,
  LogOut,
  User,
  ChevronDown,
  HelpCircle,
  Star,
  Bell,
  CreditCard,
  Menu,
  X
} from "lucide-react";

export function Layout({ children }) {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-laundry-blue p-2 rounded-lg">
                <Shirt className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-laundry-dark">MyLaundry</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {!isAuthenticated ? (
                // Public navigation
                <>
                  <Link
                    to="/services"
                    className={`text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/services") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    Services
                  </Link>
                  <Link
                    to="/subscriptions"
                    className={`text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/subscriptions") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    Subscriptions
                  </Link>
                  <Link
                    to="/how-it-works"
                    className={`text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/how-it-works") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    How It Works
                  </Link>
                  <Link
                    to="/contact"
                    className={`text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/contact") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    Contact
                  </Link>
                </>
              ) : user?.role === 'admin' ? (
                // Admin navigation
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/admin/dashboard") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    ADMIN Dashboard
                  </Link>
                  <Link
                    to="/admin/orders"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/admin/orders") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    <Package className="h-4 w-4" />
                    Manage Orders
                  </Link>
                  <Link
                    to="/admin/customers"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/admin/customers") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Customers
                  </Link>
                </>
              ) : (
                // User navigation
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/dashboard") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/garments"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/garments") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    <Shirt className="h-4 w-4" />
                    Garments
                  </Link>
                  <Link
                    to="/"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                  <Link
                    to="/new-order"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/new-order") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    New Order
                  </Link>
                  <Link
                    to="/track-order"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/track-order") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    <Search className="h-4 w-4" />
                    Track Order
                  </Link>
                  <Link
                    to="/my-orders"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-laundry-blue ${
                      isActive("/my-orders") ? "text-laundry-blue" : "text-laundry-gray"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    My Orders
                  </Link>
                </>
              )}
            </nav>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/help">
                    <Button variant="ghost" className="text-laundry-gray hover:text-laundry-blue">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="ghost" className="text-laundry-gray hover:text-laundry-blue">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="btn-primary">
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5 text-laundry-gray" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      2
                    </span>
                  </Button>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <div className="bg-laundry-blue rounded-full w-8 h-8 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-left hidden md:block">
                          <div className="text-sm font-medium text-laundry-dark">{user?.name}</div>
                          <div className="text-xs text-laundry-gray capitalize">{user?.role}</div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-laundry-gray" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Profile & Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/my-orders" className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile?tab=payment" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Payment Methods
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile?tab=loyalty" className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Loyalty Rewards
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/help" className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4" />
                          Help & Support
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-2 space-y-1">
              {!isAuthenticated ? (
                // Public mobile navigation
                <>
                  <Link
                    to="/services"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <Link
                    to="/subscriptions"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Subscriptions
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/help"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Help
                  </Link>
                </>
              ) : user?.role === 'admin' ? (
                // Admin mobile navigation
                <>
                  <Link
                    to="/admin/dashboard"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Orders
                  </Link>
                  <Link
                    to="/admin/customers"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Customers
                  </Link>
                </>
              ) : (
                // User mobile navigation
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/new-order"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    New Order
                  </Link>
                  <Link
                    to="/my-orders"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/track-order"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Track Order
                  </Link>
                  <Link
                    to="/garments"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Garments
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-laundry-gray hover:text-laundry-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-laundry-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-laundry-blue p-2 rounded-lg">
                  <Shirt className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">MyLaundry</span>
              </div>
              <p className="text-gray-400 text-sm">
                Premium washing, folding, and dry cleaning delivered to your door. 
                Making laundry convenient and hassle-free.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                    Services & Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/subscriptions" className="text-gray-400 hover:text-white transition-colors">
                    Laundry Club
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>(123) 456-7890</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:support@mylaundry.com" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>support@mylaundry.com</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Monday - Friday: 7AM - 9PM</span>
                </div>
                <div className="ml-6">Saturday: 8AM - 7PM</div>
                <div className="ml-6">Sunday: 9AM - 6PM</div>
                <div className="flex items-center space-x-2 mt-4">
                  <MapPin className="h-4 w-4" />
                  <span>Serving Metro Area</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 MyLaundry. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
