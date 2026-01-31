import express from 'express';
import { sendWelcomeEmail } from '../services/emailService.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get('/test-email', async (req, res) => {
  const to = req.query.to || process.env.EMAIL_USER;
  const name = req.query.name || 'Tester';
  if (!to) return res.status(400).json({ ok: false, error: 'no recipient provided and EMAIL_USER not set' });
  const result = await sendWelcomeEmail(to, name);
  res.json(result);
});

router.post('/seed', async (req, res) => {
  try {
    const usersToCreate = [
      {
        name: "Demo User",
        email: "user@example.com",
        password: "123456789", // Will be hashed by pre-save hook
        role: "user"
      },
      {
        name: "Demo Admin",
        email: "admin@mylaundry.com",
        password: "123456789",
        role: "admin"
      }
    ];

    const results = [];

    for (const userData of usersToCreate) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        const user = new User(userData);
        await user.save();
        results.push(`Created ${userData.email}`);
      } else {
        results.push(`Skipped ${userData.email} (already exists)`);
      }
    }

    res.json({ success: true, message: "Seeding complete", results });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
