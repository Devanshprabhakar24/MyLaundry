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
        password: "123456789",
        role: "user"
      },
      {
        name: "Demo Admin",
        email: "admin@mylaundry.com",
        password: "123456789",
        role: "admin"
      },
      {
        name: "Devansh Prabhakar",
        email: "dev24prabhakar@gmail.com",
        password: "123456789",
        role: "user"
      }
    ];

    const results = [];

    for (const userData of usersToCreate) {
      let user = await User.findOne({ email: userData.email });

      if (user) {
        // FORCE RESET PASSWORD
        // We manually hash because we might not trigger pre-save if we modified it differently, 
        // but setting the property and verify is safer.
        // Actually, let's just set the plain text and .save(), the pre-save hook handles hashing if modified.
        user.password = userData.password;
        user.name = userData.name;
        user.role = userData.role;
        await user.save();
        results.push(`♻️ Updated/Reset: ${userData.email}`);
      } else {
        user = new User(userData);
        await user.save();
        results.push(`✅ Created: ${userData.email}`);
      }
    }
    res.json({ success: true, message: "Seeding complete", results });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
