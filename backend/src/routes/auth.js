import { Router } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logActivity } from './activity.js'; // ensure this file exists
import { sendWelcomeEmail } from '../services/emailService.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const router = Router();

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ Login Failed: User not found [${email}]`);
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`❌ Login Failed: Password mismatch [${email}]`);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (user && isMatch) {
            const userObject = user.toObject();
            delete userObject.password;
            return res.json({
                success: true,
                user: userObject,
                token: generateToken(user._id)
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('[auth.login] error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // 🔐 Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Log activity
        try {
            await logActivity('new_user', `New user registered: ${name}`, newUser._id);
        } catch (err) {
            console.warn('[auth.signup] Failed to log activity:', err.message);
        }

        // Send welcome email (non-blocking)
        sendWelcomeEmail(email, name)
            .then(r => {
                if (r && r.ok) {
                    console.log('[auth.signup] Welcome email sent:', r.info?.messageId);
                } else {
                    console.warn('[auth.signup] Welcome email failed:', r?.error || r);
                }
            })
            .catch(err => {
                console.error('[auth.signup] Error sending welcome email:', err.message);
            });

        const userObject = newUser.toObject();
        delete userObject.password;
        return res.status(201).json({
            success: true,
            user: userObject,
            token: generateToken(newUser._id)
        });
    } catch (error) {
        console.error('[auth.signup] error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
