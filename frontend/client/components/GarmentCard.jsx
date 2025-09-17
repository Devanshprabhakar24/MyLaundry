import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shirt, Package, Edit, Trash2 } from "lucide-react";
import { BACKEND_URL } from "../utils/api"; // Import the base URL

export default function GarmentCard({ garment, onEdit, onDelete }) {
  const getConditionColor = (condition) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "shirts":
        return <Shirt className="h-5 w-5" />;
      case "suits":
        return <Package className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  // Construct the full image URL
  const fullImageUrl = garment.imageUrl ? `${BACKEND_URL}${garment.imageUrl}` : null;

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
        <CardDescription>ID: {garment._id}</CardDescription>
      </CardHeader>
      <CardContent>
        {fullImageUrl && (
          <div className="mb-4">
            <img
              src={fullImageUrl}
              alt={garment.name}
              className="rounded-lg w-full h-48 object-cover"
            />
          </div>
        )}
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
            <span className="text-laundry-gray text-sm">
              Care Instructions:
            </span>
            <div className="text-sm font-medium">
              {garment.careInstructions}
            </div>
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
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(garment)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(garment)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}