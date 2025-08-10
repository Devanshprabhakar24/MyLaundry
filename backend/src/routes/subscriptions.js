import { Router } from 'express';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';

const router = Router();

// Get all subscriptions for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching subscriptions' });
    }
});

// Get active subscription for a user
router.get('/user/:userId/active', async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            userId: req.params.userId,
            status: 'active',
            endDate: { $gte: new Date() }
        });
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching active subscription' });
    }
});

// Create a new subscription
router.post('/', async (req, res) => {
    try {
        const {
            userId,
            planId,
            planName,
            price,
            weightAllowance,
            pickupsAllowed,
            paymentMethod,
            billingAddress
        } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cancel any existing active subscriptions
        await Subscription.updateMany(
            { userId, status: 'active' },
            { status: 'cancelled' }
        );

        // Create new subscription
        const newSubscription = new Subscription({
            userId,
            planId,
            planName,
            price,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            weightAllowance,
            pickupsAllowed,
            paymentMethod,
            billingAddress
        });

        await newSubscription.save();
        res.status(201).json(newSubscription);
    } catch (error) {
        console.error('Subscription creation error:', error);
        res.status(500).json({ message: 'Server error while creating subscription' });
    }
});

// Update subscription status
router.put('/:subscriptionId', async (req, res) => {
    try {
        const { status, autoRenew } = req.body;
        const updateData = {};

        if (status) updateData.status = status;
        if (autoRenew !== undefined) updateData.autoRenew = autoRenew;

        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.subscriptionId,
            updateData,
            { new: true }
        );

        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.json(updatedSubscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating subscription' });
    }
});

// Cancel subscription
router.put('/:subscriptionId/cancel', async (req, res) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(
            req.params.subscriptionId,
            {
                status: 'cancelled',
                autoRenew: false
            },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error while cancelling subscription' });
    }
});

// Update subscription usage (pickups and weight)
router.put('/:subscriptionId/usage', async (req, res) => {
    try {
        const { pickupsUsed, weightUsed } = req.body;
        const updateData = {};

        if (pickupsUsed !== undefined) updateData.pickupsUsed = pickupsUsed;
        if (weightUsed !== undefined) updateData.weightUsed = weightUsed;

        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.subscriptionId,
            updateData,
            { new: true }
        );

        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.json(updatedSubscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating usage' });
    }
});

// Get subscription statistics for admin
router.get('/admin/stats', async (req, res) => {
    try {
        const totalSubscriptions = await Subscription.countDocuments();
        const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
        const cancelledSubscriptions = await Subscription.countDocuments({ status: 'cancelled' });

        const totalRevenue = await Subscription.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);

        const monthlyRevenue = await Subscription.aggregate([
            {
                $match: {
                    status: 'active',
                    startDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
                }
            },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);

        res.json({
            totalSubscriptions,
            activeSubscriptions,
            cancelledSubscriptions,
            totalRevenue: totalRevenue[0]?.total || 0,
            monthlyRevenue: monthlyRevenue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching subscription stats' });
    }
});

// Get all subscriptions for admin
router.get('/admin/all', async (req, res) => {
    try {
        const subscriptions = await Subscription.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching all subscriptions' });
    }
});

export default router;
