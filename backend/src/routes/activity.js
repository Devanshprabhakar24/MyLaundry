import { Router } from 'express';
import Activity from '../models/Activity.js';

const router = Router();

// Function to log an activity
export const logActivity = async (type, message, userId = null, orderId = null) => {
    try {
        const activity = new Activity({ type, message, userId, orderId });
        await activity.save();
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

// GET recent activities for the admin dashboard
router.get('/', async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(10) // Get the 10 most recent activities
            .populate('userId', 'name')
            .populate('orderId', '_id');

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching activities' });
    }
});

export default router;