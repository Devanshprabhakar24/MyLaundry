import { Router } from 'express';
import Order from '../models/Order.js';
import { logActivity } from './activity.js';
import User from '../models/User.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';
import { protect } from '../middleware/auth.js'; // Import protect middleware

const router = Router();

// Apply protect middleware to all order routes
router.use(protect);

// Get all orders for the logged-in user
// Changed from /:userId to /mine or just usage of req.user._id for security
router.get('/mine', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders for a specific user (Admin or self only)
router.get('/user/:userId', async (req, res) => {
    try {
        // Ensure user is requesting their own orders or is admin
        if (req.params.userId !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single order by ID
router.get('/details/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('userId', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure user owns the order or is admin
        if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Create a new order
router.post('/', async (req, res) => {
    try {
        // Force userId to be the logged-in user
        const orderData = {
            ...req.body,
            userId: req.user._id
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        await logActivity('new_order', `New order #${newOrder._id.toString().slice(-6)} placed.`, newOrder.userId, newOrder._id);

        // Send confirmation email (non-blocking)
        const orderWithUserName = {
            ...newOrder.toObject(),
            userName: req.user.name
        };

        sendOrderConfirmationEmail(req.user.email, orderWithUserName)
            .then(result => {
                if (result.ok) {
                    console.log(`[orders] Order confirmation email sent to ${req.user.email}`);
                } else {
                    console.warn(`[orders] Failed to send order confirmation email: ${result.error}`);
                }
            })
            .catch(err => {
                console.error(`[orders] Error sending order confirmation email:`, err);
            });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;