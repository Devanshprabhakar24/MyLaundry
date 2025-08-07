import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Shirt, 
  Package, 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter
} from "lucide-react";

export default function Garments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock garment data
  const garments = [
    {
      id: "G001",
      name: "Blue Business Shirt",
      category: "shirts",
      color: "Blue",
      size: "L",
      material: "Cotton",
      careInstructions: "Dry clean only",
      lastCleaned: "2024-01-10",
      cleanCount: 5,
      condition: "excellent",
      notes: "Starch collar and cuffs"
    },
    {
      id: "G002", 
      name: "Navy Wool Suit",
      category: "suits",
      color: "Navy",
      size: "42R",
      material: "Wool",
      careInstructions: "Dry clean, press",
      lastCleaned: "2024-01-05",
      cleanCount: 3,
      condition: "good",
      notes: "Handle with care, expensive fabric"
    },
    {
      id: "G003",
      name: "Black Evening Dress",
      category: "dresses",
      color: "Black",
      size: "M",
      material: "Silk",
      careInstructions: "Gentle dry clean",
      lastCleaned: "2024-01-08",
      cleanCount: 2,
      condition: "excellent",
      notes: "Delicate beading, hang only"
    },
    {
      id: "G004",
      name: "White Cotton T-Shirt",
      category: "casual",
      color: "White",
      size: "L",
      material: "Cotton",
      careInstructions: "Machine wash warm",
      lastCleaned: "2024-01-12",
      cleanCount: 8,
      condition: "good",
      notes: "Pre-treat stains"
    }
  ];

  const categories = [
    { value: "all", label: "All Garments" },
    { value: "shirts", label: "Shirts" },
    { value: "suits", label: "Suits" },
    { value: "dresses", label: "Dresses" },
    { value: "casual", label: "Casual Wear" },
    { value: "outerwear", label: "Outerwear" }
  ];

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'shirts': return <Shirt className="h-5 w-5" />;
      case 'suits': return <Package className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const filteredGarments = garments.filter(garment => {
    const matchesSearch = garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garment.color.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || garment.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-laundry-dark">My Garments</h1>
            <p className="text-laundry-gray">Manage your clothing inventory and care history</p>
          </div>
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Garment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-laundry-blue">{garments.length}</div>
              <div className="text-sm text-laundry-gray">Total Garments</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {garments.filter(g => g.condition === 'excellent').length}
              </div>
              <div className="text-sm text-laundry-gray">Excellent Condition</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {garments.filter(g => new Date(g.lastCleaned) < new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-laundry-gray">Need Cleaning</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-laundry-blue">
                {garments.reduce((sum, g) => sum + g.cleanCount, 0)}
              </div>
              <div className="text-sm text-laundry-gray">Total Cleans</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laundry-gray" />
                <Input
                  placeholder="Search garments by name, category, or color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className={selectedCategory === category.value ? "btn-primary" : ""}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Garments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGarments.map((garment) => (
            <Card key={garment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(garment.category)}
                    <CardTitle className="text-lg">{garment.name}</CardTitle>
                  </div>
                  <Badge className={getConditionColor(garment.condition)}>
                    {garment.condition}
                  </Badge>
                </div>
                <CardDescription>ID: {garment.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-laundry-gray">Color:</span>
                      <div className="font-medium">{garment.color}</div>
                    </div>
                    <div>
                      <span className="text-laundry-gray">Size:</span>
                      <div className="font-medium">{garment.size}</div>
                    </div>
                    <div>
                      <span className="text-laundry-gray">Material:</span>
                      <div className="font-medium">{garment.material}</div>
                    </div>
                    <div>
                      <span className="text-laundry-gray">Cleans:</span>
                      <div className="font-medium">{garment.cleanCount}</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-laundry-gray text-sm">Care Instructions:</span>
                    <div className="text-sm font-medium">{garment.careInstructions}</div>
                  </div>

                  <div>
                    <span className="text-laundry-gray text-sm">Last Cleaned:</span>
                    <div className="text-sm font-medium">
                      {new Date(garment.lastCleaned).toLocaleDateString()}
                    </div>
                  </div>

                  {garment.notes && (
                    <div>
                      <span className="text-laundry-gray text-sm">Notes:</span>
                      <div className="text-sm">{garment.notes}</div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGarments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-laundry-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-laundry-dark mb-2">No Garments Found</h3>
              <p className="text-laundry-gray mb-6">
                {searchTerm || selectedCategory !== "all" 
                  ? "No garments match your search criteria." 
                  : "Start by adding your first garment to track its care history."
                }
              </p>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Garment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
