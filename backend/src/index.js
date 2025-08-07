import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import demoRoutes from "./routes/demo.js";
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import garmentRoutes from './routes/garments.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/demo', demoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/garments', garmentRoutes);

// Health check route for Render
app.get("/", (req, res) => {
    res.send("MyLaundry Backend is running!");
});

app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`🚀 MyLaundry backend server running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });