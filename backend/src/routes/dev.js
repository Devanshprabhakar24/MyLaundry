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
      // Manually hash payload
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = await User.findOneAndUpdate(
        { email: userData.email },
        {
          $set: {
            name: userData.name,
            password: hashedPassword,
            role: userData.role
          }
        },
        { new: true, upsert: true } // Create if not exists
      );
      results.push(`✅ Processed: ${userData.email}`);
    }
    res.json({ success: true, message: "Seeding complete", results });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
