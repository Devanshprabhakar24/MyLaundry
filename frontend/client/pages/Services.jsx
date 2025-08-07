import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  WashingMachine,
  Shirt,
  Sparkles,
  Calculator,
  CheckCircle,
  Clock,
  Shield,
  Leaf,
  Package,
  Home,
  Baby,
  Bed,
  Crown,
  Star,
  Waves,
  Snowflake
} from "lucide-react";

export default function Services() {
  const navigate = useNavigate();
  const [estimatorItems, setEstimatorItems] = useState({
    shirts: 0,
    trousers: 0,
    dresses: 0,
    suits: 0,
    coats: 0,
    sarees: 0,
    lehengas: 0,
    curtains: 0,
    bedsheets: 0,
    blankets: 0,
    shoes: 0,
    bags: 0,
    washFoldKg: 0,
  });

  const pricing = {
    washFold: 35, // per kg in rupees
    dryClean: {
      shirt: 99,
      trousers: 149,
      dress: 199,
      suit: 299,
      coat: 349,
      saree: 129,
      lehenga: 399,
      blazer: 179,
      jacket: 229,
      sweater: 119,
    },
    ironing: {
      shirt: 19,
      trousers: 25,
      dress: 35,
      saree: 29,
      kurta: 25,
    },
    specialCare: {
      wedding_dress: 799,
      leather_jacket: 599,
      silk_saree: 199,
      designer_wear: 499,
      vintage_clothing: 299,
    },
    homeTextiles: {
      curtains: 99,
      bedsheet_set: 149,
      blanket: 199,
      pillow: 69,
      cushion_cover: 49,
    },
    accessories: {
      shoes: 99,
      handbag: 149,
      belt: 69,
      tie: 49,
      scarf: 79,
    }
  };

  const calculateTotal = () => {
    const washFoldTotal = estimatorItems.washFoldKg * pricing.washFold;
    const dryCleanTotal = 
      estimatorItems.shirts * pricing.dryClean.shirt +
      estimatorItems.trousers * pricing.dryClean.trousers +
      estimatorItems.dresses * pricing.dryClean.dress +
      estimatorItems.suits * pricing.dryClean.suit +
      estimatorItems.coats * pricing.dryClean.coat +
      estimatorItems.sarees * pricing.dryClean.saree +
      estimatorItems.lehengas * pricing.dryClean.lehenga;
    
    return (washFoldTotal + dryCleanTotal).toFixed(0);
  };

  const updateEstimator = (item, value) => {
    setEstimatorItems(prev => ({ ...prev, [item]: Math.max(0, value) }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-laundry-light-blue to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-laundry-dark mb-6">Services & Pricing</h1>
          <p className="text-xl text-laundry-gray max-w-3xl mx-auto">
            Comprehensive laundry and dry cleaning services with transparent Indian pricing. 
            No hidden fees, no surprises - just clean clothes at affordable rates.
          </p>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-laundry-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-laundry-dark mb-2">24-Hour Turnaround</h3>
              <p className="text-sm text-laundry-gray">Quick service without compromising quality</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-laundry-dark mb-2">Eco-Friendly</h3>
              <p className="text-sm text-laundry-gray">Biodegradable detergents and processes</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-laundry-dark mb-2">Satisfaction Guarantee</h3>
              <p className="text-sm text-laundry-gray">100% satisfaction or we'll make it right</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-laundry-dark mb-2">Quality Assured</h3>
              <p className="text-sm text-laundry-gray">Professional cleaning by trained experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wash & Fold Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <WashingMachine className="h-12 w-12 text-laundry-blue" />
              </div>
              <CardTitle className="text-3xl">Wash & Fold Service</CardTitle>
              <CardDescription>Professional washing, drying, and folding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What's Included:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Pre-treatment of stains</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Washing with premium detergents</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Fabric softener and freshening</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Professional folding and packaging</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Free pickup and delivery</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-laundry-light-blue p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-laundry-blue mb-2">₹{pricing.washFold}</div>
                    <div className="text-lg text-laundry-gray">per kilogram</div>
                    <div className="mt-4 text-sm text-laundry-gray">
                      Minimum order: 3kg | Average load: 5-7kg
                    </div>
                    <Button
                      className="btn-primary mt-4 w-full"
                      onClick={() => navigate('/new-order')}
                    >
                      Schedule Wash & Fold
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dry Cleaning Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Shirt className="h-12 w-12 text-laundry-blue mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-laundry-dark mb-4">Dry Cleaning Services</h2>
            <p className="text-xl text-laundry-gray">Expert care for your delicate and formal garments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(pricing.dryClean).map(([item, price]) => (
              <Card key={item} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="capitalize text-lg">{item.replace('_', ' ')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-laundry-blue mb-4">₹{price}</div>
                  <Badge variant="secondary" className="bg-laundry-light-blue text-laundry-blue">
                    Professional Care
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ironing Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Sparkles className="h-12 w-12 text-laundry-blue mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-laundry-dark mb-4">Ironing Services</h2>
            <p className="text-xl text-laundry-gray">Professional pressing for a crisp, polished look</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Object.entries(pricing.ironing).map(([item, price]) => (
              <Card key={item} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="capitalize">{item}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-laundry-blue mb-4">₹{price}</div>
                  <Badge variant="secondary" className="bg-laundry-light-blue text-laundry-blue">
                    Professional Press
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Care Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Crown className="h-12 w-12 text-laundry-blue mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-laundry-dark mb-4">Special Care Services</h2>
            <p className="text-xl text-laundry-gray">Premium treatment for your most precious garments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(pricing.specialCare).map(([item, price]) => (
              <Card key={item} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="capitalize text-lg">{item.replace('_', ' ')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-laundry-blue mb-4">₹{price}</div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Premium Service
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Home Textiles Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Home className="h-12 w-12 text-laundry-blue mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-laundry-dark mb-4">Home Textiles</h2>
            <p className="text-xl text-laundry-gray">Professional cleaning for your home essentials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(pricing.homeTextiles).map(([item, price]) => (
              <Card key={item} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="capitalize">{item.replace('_', ' ')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-laundry-blue mb-4">₹{price}</div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Bed className="h-3 w-3 mr-1" />
                    Home Care
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Accessories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Package className="h-12 w-12 text-laundry-blue mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-laundry-dark mb-4">Accessories Cleaning</h2>
            <p className="text-xl text-laundry-gray">Specialized care for shoes, bags, and accessories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(pricing.accessories).map(([item, price]) => (
              <Card key={item} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="capitalize">{item}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-laundry-blue mb-4">₹{price}</div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Accessory Care
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Price Estimator */}
      <section className="py-16 bg-laundry-light-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Calculator className="h-12 w-12 text-laundry-blue" />
              </div>
              <CardTitle className="text-3xl">Real-time Price Estimator</CardTitle>
              <CardDescription>Calculate your estimated cost instantly in Indian Rupees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Wash & Fold</h3>
                    <div className="flex items-center gap-4">
                      <label className="flex-1">Weight (kg):</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateEstimator('washFoldKg', estimatorItems.washFoldKg - 1)}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={estimatorItems.washFoldKg}
                          onChange={(e) => updateEstimator('washFoldKg', parseInt(e.target.value) || 0)}
                          className="w-20 text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateEstimator('washFoldKg', estimatorItems.washFoldKg + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Dry Cleaning Items</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {Object.keys(pricing.dryClean).slice(0, 7).map((item) => (
                        <div key={item} className="flex items-center gap-4">
                          <label className="flex-1 capitalize">{item.replace('_', ' ')}:</label>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateEstimator(item, estimatorItems[item] - 1)}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={estimatorItems[item]}
                              onChange={(e) => updateEstimator(item, parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateEstimator(item, estimatorItems[item] + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Estimated Total</h3>
                  <div className="text-4xl font-bold text-laundry-blue mb-4">₹{calculateTotal()}</div>
                  <div className="text-sm text-laundry-gray mb-6">
                    * Prices include GST. Final price may vary based on actual weight and specific care requirements.
                  </div>
                  <Button
                    className="btn-primary w-full"
                    onClick={() => navigate('/contact')}
                  >
                    Get Accurate Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-laundry-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Premium Laundry Care?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule your first pickup and see why thousands trust MyLaundry with their clothes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-white text-laundry-blue hover:bg-gray-100 px-8 py-3"
              onClick={() => navigate('/new-order')}
            >
              Schedule Pickup Now
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-laundry-blue px-8 py-3"
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
