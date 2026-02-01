import { Router } from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { logActivity } from './activity.js'; // <-- ADD THIS IMPORT
import { sendOrderStatusUpdateEmail, sendEmail, verifyTransporter } from '../services/emailService.js'; // <-- ADD THIS

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
        ).populate('userId', 'name email');

        await logActivity(
            'status_update',
            `Order #${updatedOrder._id.toString().slice(-6)} status updated to ${status}.`,
            updatedOrder.userId._id,
            updatedOrder._id
        );

        // Send status update email (non-blocking)
        if (updatedOrder.userId && updatedOrder.userId.email) {
            const orderWithUserName = {
                ...updatedOrder.toObject(),
                userName: updatedOrder.userId.name
            };

            sendOrderStatusUpdateEmail(updatedOrder.userId.email, orderWithUserName)
                .then(result => {
                    if (result.ok) {
                        console.log(`[admin] Status update email sent to ${updatedOrder.userId.email} for order ${updatedOrder._id}`);
                    } else {
                        console.warn(`[admin] Failed to send status update email: ${result.error}`);
                    }
                })
                .catch(err => {
                    console.error(`[admin] Error sending status update email:`, err);
                });
        }

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

// Test email endpoint - useful for verifying email works in production
router.post('/test-email', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email address is required' });
        }

        // First verify the transporter
        const isVerified = await verifyTransporter();

        if (!isVerified) {
            return res.status(500).json({
                success: false,
                message: 'Email transporter verification failed. Check server logs and environment variables.',
                envCheck: {
                    EMAIL_HOST: process.env.EMAIL_HOST ? 'SET' : 'NOT SET',
                    EMAIL_PORT: process.env.EMAIL_PORT ? 'SET' : 'NOT SET',
                    EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
                    EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
                }
            });
        }

        // Send test email
        const result = await sendEmail(
            email,
            'MyLaundry - Email Test',
            '<h1>Email Test Successful!</h1><p>If you received this email, your email service is working correctly.</p><p>Sent from MyLaundry backend.</p>',
            'Email Test Successful! If you received this email, your email service is working correctly.'
        );

        if (result.ok) {
            res.json({
                success: true,
                message: `Test email sent to ${email}`,
                messageId: result.info?.messageId
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test email',
                error: result.error
            });
        }
    } catch (error) {
        console.error('[admin/test-email] Error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Email status check endpoint
router.get('/email-status', async (req, res) => {
    try {
        const isVerified = await verifyTransporter();
        res.json({
            success: true,
            emailServiceActive: isVerified,
            config: {
                EMAIL_HOST: process.env.EMAIL_HOST ? 'configured' : 'missing',
                EMAIL_PORT: process.env.EMAIL_PORT ? 'configured' : 'missing',
                EMAIL_USER: process.env.EMAIL_USER ? 'configured' : 'missing',
                EMAIL_PASS: process.env.EMAIL_PASS ? 'configured' : 'missing',
                EMAIL_FROM: process.env.EMAIL_FROM ? 'configured' : 'missing',
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;