import { Router } from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
const router = Router();

// Get user profile
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Get user statistics for the current month
router.get('/:userId/stats', async (req, res) => {
    try {
        const { userId } = req.params;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const monthlyOrders = await Order.find({
            userId: userId,
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        const ordersCount = monthlyOrders.length;

        let itemsCleaned = 0;
        monthlyOrders.forEach(order => {
            order.items.forEach(item => {
                // Extracts the number from strings like "2 Shirts" or "5kg Wash & Fold"
                const quantityMatch = item.match(/^(\d+)/);
                if (quantityMatch) {
                    itemsCleaned += parseInt(quantityMatch[1], 10);
                } else {
                    itemsCleaned += 1; // Count as 1 if no number is found
                }
            });
        });

        // Placeholder for money saved logic
        const moneySaved = ordersCount * 50; // Assuming an average saving of ₹50 per order

        res.json({
            ordersCount,
            itemsCleaned,
            moneySaved
        });

    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});


// Update user profile
router.put('/:userId', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            { new: true }
        ).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;