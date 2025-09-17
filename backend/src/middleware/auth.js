// backend/src/middleware/auth.js  (or backend/src/routes/auth.js if this is where you keep it)
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ ok: false, message: 'User not found' });
            }

            return next();
        } catch (error) {
            console.error('Auth protect error:', error);
            return res.status(401).json({ ok: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ ok: false, message: 'Not authorized, no token' });
    }
};
