import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    const response = {
        message: "Hello from the new Express backend!",
    };
    res.status(200).json(response);
});

export default router;