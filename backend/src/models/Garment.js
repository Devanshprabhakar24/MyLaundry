import mongoose from "mongoose";

const garmentSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        color: { type: String },
        size: { type: String },
        material: { type: String },
        careInstructions: { type: String },
        lastCleaned: { type: Date, default: Date.now },
        cleanCount: { type: Number, default: 0 },
        condition: {
            type: String,
            enum: ["excellent", "good", "fair", "poor"],
            default: "good",
        },
        notes: { type: String },
        imageUrl: { type: String },
    },
    { timestamps: true }
);

const Garment = mongoose.model("Garment", garmentSchema);

export default Garment;