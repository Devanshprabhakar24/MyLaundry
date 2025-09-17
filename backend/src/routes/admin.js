import { Router } from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { logActivity } from './activity.js'; // <-- ADD THIS IMPORT

const router = Router();

// Fetch all orders for the admin dashboard
router.get('/orders', async (req, res) => {
    try {
        // Populate the 'userId' field to get customer name and email from the User model
        const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
});

// Update an order's status
router.put('/orders/:orderId', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        ).populate('userId', 'name');

        // Log the status update activity
        await logActivity(
            'status_update',
            `Order #${updatedOrder._id.toString().slice(-6)} status updated to ${status}.`,
            updatedOrder.userId._id,
            updatedOrder._id
        );

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating order' });
    }
});
// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: { $ne: 'completed' } });
        const activeCustomers = await User.countDocuments({ role: 'user' });

        // Calculate total revenue from completed orders
        const revenueResult = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        res.json({
            totalOrders,
            pendingOrders,
            activeCustomers,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching stats' });
    }
});

// Fetch all customers for the admin dashboard (Optimized with Aggregation)
router.get('/customers', async (req, res) => {
    try {
        const customerData = await User.aggregate([
            { $match: { role: 'user' } },
            {
                $lookup: {
                    from: 'orders', // The name of the orders collection in MongoDB
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'orders'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    phone: 1,
                    address: 1,
                    createdAt: 1,
                    totalOrders: { $size: '$orders' },
                    totalSpent: { $sum: '$orders.total' }
                }
            }
        ]);
        res.json(customerData);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: 'Server error while fetching customers' });
    }
});

export default router;