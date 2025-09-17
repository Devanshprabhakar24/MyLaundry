import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { useToast } from "@/hooks/use-toast";

export default function AddGarmentForm({
  open,
  onOpenChange,
  garment,
  onSave,
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (garment) {
      setFormData({
        name: garment.name || "",
        category: garment.category || "",
        color: garment.color || "",
        material: garment.material || "",
        size: garment.size || "",
        careInstructions: garment.careInstructions || "",
        notes: garment.notes || "",
        imageUrl: garment.imageUrl || "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        color: "",
        material: "",
        size: "",
        careInstructions: "",
        notes: "",
        imageUrl: "",
      });
    }
    setImageFile(null);
    setError("");
  }, [garment, open]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setError("");
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append("userId", user._id);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      let response;
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      
      if (garment) {
        response = await api.put(`/garments/${garment._id}`, data, config);
      } else {
        response = await api.post("/garments", data, config);
      }

      onSave(response.data);
      onOpenChange(false);
      toast({
        title: "Success!",
        description: `Garment has been successfully ${
          garment ? "updated" : "added"
        }.`,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to save garment. Please try again.";
      setError(errorMessage);
      console.error("Failed to save garment:", err.response?.data || err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {garment ? "Edit Garment" : "Add New Garment"}
          </DialogTitle>
          <DialogDescription>
            {garment
              ? "Update the details of your garment."
              : "Fill in the details of your new garment."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Input id="category" value={formData.category} onChange={handleInputChange} className="col-span-3" required/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">Color</Label>
            <Input id="color" value={formData.color} onChange={handleInputChange} className="col-span-3"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="material" className="text-right">Material</Label>
            <Input id="material" value={formData.material} onChange={handleInputChange} className="col-span-3"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="size" className="text-right">Size</Label>
            <Input id="size" value={formData.size} onChange={handleInputChange} className="col-span-3"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="careInstructions" className="text-right">Care</Label>
            <Textarea id="careInstructions" value={formData.careInstructions} onChange={handleInputChange} className="col-span-3"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={handleInputChange} className="col-span-3"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">Image</Label>
            <Input id="image" type="file" onChange={handleFileChange} className="col-span-3"/>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}