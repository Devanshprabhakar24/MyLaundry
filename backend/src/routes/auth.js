import { Router } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const userObject = user.toObject();
            delete userObject.password;
            res.json({ success: true, user: userObject });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const newUser = new User({ name, email, password });
        await newUser.save();

        const userObject = newUser.toObject();
        delete userObject.password;
        res.status(201).json({ success: true, user: userObject });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;