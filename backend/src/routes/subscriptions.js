const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// GET /api/subscriptions/user/:userId/active - Get active subscription for a user
router.get('/user/:userId/active', async (req, res) => {
    try {
        const { userId } = req.params;
        const subscription = await Subscription.findOne({ userId, status: 'active' });
        if (!subscription) {
            return res.status(404).json({ message: 'No active subscription found' });
        }
        res.json(subscription);
    } catch (error) {
        console.error('Error fetching active subscription:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// POST /api/subscriptions - Create or Update a subscription
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
            billingAddress,
        } = req.body;

        // 1. Validate user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Find existing subscription for the user, regardless of status (Upsert logic)
        let subscription = await Subscription.findOne({ userId });

        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        if (subscription) {
            // If subscription exists, update it to reactivate or change the plan
            subscription.planId = planId;
            subscription.planName = planName;
            subscription.price = price;
            subscription.status = 'active';
            subscription.startDate = new Date();
            subscription.endDate = thirtyDaysFromNow;
            subscription.weightAllowance = weightAllowance;
            subscription.pickupsAllowed = pickupsAllowed;
            subscription.weightUsed = 0; // Reset usage
            subscription.pickupsUsed = 0; // Reset usage
            subscription.paymentMethod = paymentMethod;
            subscription.billingAddress = billingAddress;
        } else {
            // If no subscription exists, create a new one
            subscription = new Subscription({
                userId,
                planId,
                planName,
                price,
                status: 'active',
                startDate: new Date(),
                endDate: thirtyDaysFromNow,
                weightAllowance,
                pickupsAllowed,
                paymentMethod,
                billingAddress,
            });
        }

        const savedSubscription = await subscription.save();

        // 4. Update user's subscription reference in the User model
        user.subscription = savedSubscription._id;
        await user.save();

        res.status(201).json(savedSubscription);
    } catch (error) {
        console.error('Error creating/updating subscription:', error);
        // Provide a more specific error message if possible, otherwise a generic one
        res.status(500).json({ message: error.message || 'Server error while processing subscription' });
    }
});


// PUT /api/subscriptions/:id/cancel - Cancel a subscription
router.put('/:id/cancel', async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        subscription.status = 'cancelled';
        subscription.endDate = new Date(); // Or based on billing cycle
        await subscription.save();
        res.json({ message: 'Subscription cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
