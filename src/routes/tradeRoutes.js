// src/routes/tradeRoutes.js
import express from 'express';
import { buyCrypto, sellCrypto } from '../controllers/tradeController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/buy', authMiddleware, buyCrypto);
router.post('/sell', authMiddleware, sellCrypto);

export default router;
