// src/routes/walletRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getWallet, fundWallet } from '../controllers/walletController.js';


const router = express.Router();

// GET /api/wallet
router.get('/', authMiddleware, getWallet);
router.post('/fund', authMiddleware, fundWallet);

export default router;
