import { Router } from "express";
import Garment from "../models/Garment.js";
import multer from "multer";
import path from "path";

const router = Router();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Get all garments for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const garments = await Garment.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });
    res.json(garments);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching garments" });
  }
});

// Create a new garment with an image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const garmentData = req.body;
    if (req.file) {
      // The path will be accessible via /uploads/filename.jpg
      garmentData.imageUrl = `/uploads/${req.file.filename}`;
    }
    const newGarment = new Garment(garmentData);
    await newGarment.save();
    res.status(201).json(newGarment);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating garment", error: error.message });
  }
});

// Update a garment
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    const updatedGarment = await Garment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedGarment) {
      return res.status(404).json({ message: "Garment not found" });
    }
    res.json(updatedGarment);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating garment", error: error.message });
  }
});

// Delete a garment
router.delete("/:id", async (req, res) => {
  try {
    const deletedGarment = await Garment.findByIdAndDelete(req.params.id);
    if (!deletedGarment) {
      return res.status(404).json({ message: "Garment not found" });
    }
    res.json({ message: "Garment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error deleting garment", error: error.message });
  }
});

export default router;