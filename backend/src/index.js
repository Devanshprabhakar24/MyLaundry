import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import Routes
import demoRoutes from "./routes/demo.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.js";
import garmentRoutes from "./routes/garments.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import activityRoutes from './routes/activity.js';
import devRoutes from './routes/dev.js';


const app = express();
const port = process.env.PORT || 3001;

// --- Create uploads directory if it doesn't exist ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "public/uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created directory: ${uploadsDir}`);
}

// --- CORS Configuration ---
const corsOptions = {
    origin: [
        'http://localhost:8080',
        'http://localhost:5173',
        'https://my-laundry-lime.vercel.app'
    ],
    credentials: true,
};
app.use(cors(corsOptions));

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static("public"));

// --- API Routes ---
app.use("/api/demo", demoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/garments", garmentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use('/api/activities', activityRoutes);
app.use('/dev', devRoutes);
// Health check route
app.get("/", (req, res) => {
    res.send("MyLaundry Backend is running!");
});

// --- MongoDB Connection Setup (Production Level) ---
async function connectWithRetry() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 45000, // 45 seconds
        });
        console.log("✅ Connected to MongoDB");
        app.listen(port, () => {
            console.log(`🚀 MyLaundry backend server running on port ${port}`);
        });
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        // Retry after 5 seconds
        setTimeout(connectWithRetry, 5000);
    }
}

mongoose.connection.on('disconnected', () => {
    console.error('❌ Lost MongoDB connection. Reconnecting...');
    connectWithRetry();
});

mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
});

connectWithRetry();