import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import GarmentCard from "../components/GarmentCard";
import StatsCard from "../components/StatsCard";
import AddGarmentForm from "../components/AddGarmentForm";
import { useToast } from "@/hooks/use-toast";

export default function Garments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [garments, setGarments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState(null);

  const fetchGarments = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/garments/user/${user._id}`);
      setGarments(response.data);
    } catch (error) {
      console.error("Failed to fetch garments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGarments();
  }, [user]);

  const handleSave = () => {
    fetchGarments();
    toast({
      title: "Success!",
      description: `Garment has been ${
        selectedGarment ? "updated" : "added"
      }.`,
    });
  };

  const handleDelete = async (garment) => {
    if (window.confirm(`Are you sure you want to delete "${garment.name}"?`)) {
      try {
        await api.delete(`/garments/${garment._id}`);
        fetchGarments();
        toast({
          title: "Deleted!",
          description: `"${garment.name}" has been removed.`,
          variant: "destructive",
        });
      } catch (error) {
        console.error("Failed to delete garment:", error);
      }
    }
  };

  const handleAddClick = () => {
    setSelectedGarment(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (garment) => {
    setSelectedGarment(garment);
    setIsFormOpen(true);
  };

  const categories = [
    { value: "all", label: "All Garments" },
    { value: "shirts", label: "Shirts" },
    { value: "suits", label: "Suits" },
    { value: "dresses", label: "Dresses" },
    { value: "casual", label: "Casual Wear" },
    { value: "outerwear", label: "Outerwear" },
  ];

  const filteredGarments = garments.filter((garment) => {
    const matchesSearch =
      garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garment.color.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || garment.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-laundry-dark">
              My Garments
            </h1>
            <p className="text-laundry-gray">
              Manage your clothing inventory and care history
            </p>
          </div>
          <Button className="btn-primary" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Garment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Garments"
            value={garments.length}
            colorClass="text-laundry-blue"
          />
          <StatsCard
            title="Excellent Condition"
            value={garments.filter((g) => g.condition === "excellent").length}
            colorClass="text-green-600"
          />
          <StatsCard
            title="Need Cleaning"
            value={
              garments.filter(
                (g) =>
                  new Date(g.lastCleaned) <
                  new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
              ).length
            }
            colorClass="text-orange-600"
          />
          <StatsCard
            title="Total Cleans"
            value={garments.reduce((sum, g) => sum + g.cleanCount, 0)}
            colorClass="text-laundry-blue"
          />
        </div>

        <div className="mb-8">
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
                  variant={
                    selectedCategory === category.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={
                    selectedCategory === category.value ? "btn-primary" : ""
                  }
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGarments.map((garment) => (
            <GarmentCard
              key={garment._id}
              garment={garment}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filteredGarments.length === 0 && !isLoading && (
          <div>
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-laundry-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-laundry-dark mb-2">
                No Garments Found
              </h3>
              <p className="text-laundry-gray mb-6">
                {searchTerm || selectedCategory !== "all"
                  ? "No garments match your search criteria."
                  : "Start by adding your first garment to track its care history."}
              </p>
              <Button className="btn-primary" onClick={handleAddClick}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Garment
              </Button>
            </div>
          </div>
        )}

        <AddGarmentForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          garment={selectedGarment}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}