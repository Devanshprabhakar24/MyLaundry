import express from 'express';
import { sendWelcomeEmail } from '../services/emailService.js';
const router = express.Router();

router.get('/test-email', async (req, res) => {
  const to = req.query.to || process.env.EMAIL_USER;
  const name = req.query.name || 'Tester';
  if (!to) return res.status(400).json({ ok: false, error: 'no recipient provided and EMAIL_USER not set' });
  const result = await sendWelcomeEmail(to, name);
  res.json(result);
});

export default router;
