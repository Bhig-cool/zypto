import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { getPrice } from '../utils/priceService.js';

export const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wallet');

    if (!user || !user.wallet) {
      return res.status(404).json({ msg: 'Wallet not found' });
    }

    const { ethAddress, balance, portfolio } = user.wallet;

    let portfolioValue = 0;
    const detailedPortfolio = [];

    for (const asset of portfolio) {
      const price = await getPrice(asset.symbol);
      const value = price * asset.amount;
      portfolioValue += value;

      detailedPortfolio.push({
        symbol: asset.symbol,
        amount: asset.amount,
        price,
        value,
      });
    }

    res.json({
      wallet: {
        ethAddress,
        balance,
        portfolio: detailedPortfolio,
        portfolioValue,
        totalValue: balance + portfolioValue,
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch wallet', error: err.message });
  }
};

export const fundWallet = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Invalid amount' });
    }

    const user = await User.findById(req.user.id);

    if (!user.wallet) {
      user.wallet = { balance: 0, portfolio: [] };
    }

    user.wallet.balance += amount;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'fund',
      amount,
    });

    res.json({
      msg: `Wallet funded with ${amount}`,
      newBalance: user.wallet.balance
    });
  } catch (err) {
    res.status(500).json({ msg: 'Funding failed', error: err.message });
  }
};
