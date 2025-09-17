import { Router } from 'express';
import Order from '../models/Order.js';
import { logActivity } from './activity.js'; // <-- ADD THIS IMPORT

const router = Router();

// Get all orders for a user
router.get('/:userId', async (req, res) => {
    try {
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
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Create a new order
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();

        // Log the new order activity
        await logActivity('new_order', `New order #${newOrder._id.toString().slice(-6)} placed.`, newOrder.userId, newOrder._id);

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;