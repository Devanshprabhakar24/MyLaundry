import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext";
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Trash2,
  Plus,
  Edit,
  Star,
  Gift,
  Users,
  Settings,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { API_URL } from '../apiConfig';
export default function Profile() {
  const { user, setUser, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || { city: "", state: "", country: "" },
    contact: user?.contact || { email: user?.email || "", phone: user?.phone || "" },
    rating: user?.rating || 0,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({ ...prev, ...user }))
    }
  }, [user]);

  // Addresses state
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      address: user?.address || "123 Main St, City, State 12345",
      isDefault: true
    },
    {
      id: 2,
      type: "Office",
      address: "456 Business Ave, City, State 67890",
      isDefault: false
    }
  ]);

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "Visa",
      last4: "4532",
      expiry: "12/25",
      isDefault: true
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8901",
      expiry: "08/26",
      isDefault: false
    }
  ]);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    sms: true,
    email: true,
    push: true
  });

  // Loyalty points
  const loyaltyData = {
    points: 1250,
    tier: "Gold",
    nextTier: "Platinum",
    pointsToNext: 750,
    totalSpent: 245.67,
    ordersCount: 15
  };

  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          location: profileData.location,
          contact: profileData.contact,
          rating: profileData.rating
        })
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser); // Update context
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("An error occurred while updating the profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = () => {
    const newAddress = {
      id: addresses.length + 1,
      type: "New Address",
      address: "",
      isDefault: false
    };
    setAddresses([...addresses, newAddress]);
  };

  const handleDeleteAddress = (id) => {
    if (addresses.find(addr => addr.id === id)?.isDefault) {
      alert("Cannot delete default address");
      return;
    }
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleAddPaymentMethod = () => {
    alert("Add Payment Method modal would open here");
  };

  const handleDeletePaymentMethod = (id) => {
    if (paymentMethods.find(pm => pm.id === id)?.isDefault) {
      alert("Cannot delete default payment method");
      return;
    }
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Login Required</CardTitle>
              <CardDescription>
                You need to login to access your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Please login to access and manage your profile settings.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  className="btn-primary w-full"
                  onClick={() => window.location.href = '/login'}
                >
                  Login to Your Account
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = '/signup'}
                >
                  Create New Account
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => window.location.href = '/'}
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-laundry-dark">Account Settings</h1>
            <p className="text-laundry-gray">Manage your profile, preferences, and account security</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-laundry-blue rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-semibold text-laundry-dark">{user?.name}</div>
              <div className="text-sm text-laundry-gray capitalize">{user?.role}</div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Loyalty
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-laundry-blue" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>Update your account details and security settings</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-laundry-blue text-laundry-blue"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value, contact: { ...prev.contact, email: e.target.value } }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value, contact: { ...prev.contact, phone: e.target.value } }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <Input value={user?.role || "User"} disabled className="capitalize" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileData.location.city}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: { ...prev.location, city: e.target.value } }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={profileData.location.state}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: { ...prev.location, state: e.target.value } }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profileData.location.country}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: { ...prev.location, country: e.target.value } }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">User Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={profileData.rating}
                      onChange={(e) => setProfileData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <>
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-laundry-dark mb-4">Change Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPassword ? "text" : "password"}
                              value={profileData.currentPassword}
                              onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              placeholder="Enter current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={profileData.newPassword}
                            onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Enter new password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={profileData.confirmPassword}
                            onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleProfileSave}
                        disabled={isLoading}
                        className="btn-primary"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-laundry-blue" />
                      Saved Addresses
                    </CardTitle>
                    <CardDescription>Manage your pickup and delivery addresses</CardDescription>
                  </div>
                  <Button onClick={handleAddAddress} className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-laundry-dark">{address.type}</h3>
                          {address.isDefault && (
                            <Badge className="bg-laundry-blue text-white">Default</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={address.isDefault}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-laundry-gray mb-3">{address.address}</p>
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="border-laundry-blue text-laundry-blue"
                        >
                          Set as Default
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-laundry-blue" />
                      Payment Methods
                    </CardTitle>
                    <CardDescription>Manage your saved payment methods</CardDescription>
                  </div>
                  <Button onClick={handleAddPaymentMethod} className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Card
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-gray-100 rounded p-2">
                            <CreditCard className="h-6 w-6 text-laundry-gray" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{method.type} •••• {method.last4}</span>
                              {method.isDefault && (
                                <Badge className="bg-laundry-blue text-white">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-laundry-gray">Expires {method.expiry}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePaymentMethod(method.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={method.isDefault}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-laundry-blue" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Order Updates</h4>
                      <p className="text-sm text-laundry-gray">Notifications about pickup, processing, and delivery</p>
                    </div>
                    <Switch
                      checked={notifications.orderUpdates}
                      onCheckedChange={(checked) => handleNotificationChange("orderUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Promotions & Offers</h4>
                      <p className="text-sm text-laundry-gray">Special deals and discount notifications</p>
                    </div>
                    <Switch
                      checked={notifications.promotions}
                      onCheckedChange={(checked) => handleNotificationChange("promotions", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Newsletter</h4>
                      <p className="text-sm text-laundry-gray">Monthly newsletter with tips and updates</p>
                    </div>
                    <Switch
                      checked={notifications.newsletter}
                      onCheckedChange={(checked) => handleNotificationChange("newsletter", checked)}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Delivery Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-laundry-gray" />
                        <span>SMS Notifications</span>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-laundry-gray" />
                        <span>Email Notifications</span>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-laundry-gray" />
                        <span>Push Notifications</span>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-laundry-blue" />
                  Loyalty Program
                </CardTitle>
                <CardDescription>Track your rewards and benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-laundry-blue to-blue-600 text-white p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{loyaltyData.tier} Member</h3>
                        <Star className="h-6 w-6" />
                      </div>
                      <div className="text-3xl font-bold mb-2">{loyaltyData.points} Points</div>
                      <p className="text-blue-100">{loyaltyData.pointsToNext} points to {loyaltyData.nextTier}</p>
                      <div className="w-full bg-blue-400 rounded-full h-2 mt-3">
                        <div
                          className="bg-white h-2 rounded-full"
                          style={{ width: `${(loyaltyData.points / (loyaltyData.points + loyaltyData.pointsToNext)) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-laundry-blue">₹{loyaltyData.totalSpent}</div>
                        <div className="text-sm text-laundry-gray">Total Spent</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-laundry-blue">{loyaltyData.ordersCount}</div>
                        <div className="text-sm text-laundry-gray">Orders Completed</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Available Rewards</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">₹5 Off Next Order</h4>
                            <p className="text-sm text-laundry-gray">500 points</p>
                          </div>
                          <Button size="sm" className="btn-primary">Redeem</Button>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Free Dry Cleaning</h4>
                            <p className="text-sm text-laundry-gray">1000 points</p>
                          </div>
                          <Button size="sm" className="btn-primary">Redeem</Button>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4 opacity-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">₹20 Off Order</h4>
                            <p className="text-sm text-laundry-gray">2000 points</p>
                          </div>
                          <Button size="sm" disabled>Need More Points</Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-laundry-light-blue p-4 rounded-lg">
                      <h4 className="font-semibold text-laundry-blue mb-2">Refer Friends</h4>
                      <p className="text-sm text-laundry-blue mb-3">
                        Get 200 points for each friend who places their first order!
                      </p>
                      <Button size="sm" variant="outline" className="border-laundry-blue text-laundry-blue">
                        <Users className="h-4 w-4 mr-2" />
                        Share Referral Link
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}