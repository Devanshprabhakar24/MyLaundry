import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// Get all garments for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const userGarments = db.garments.filter(g => g.userId === userId);
  res.json(userGarments);
});

export default router;