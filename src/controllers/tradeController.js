import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { getPrice } from '../utils/priceService.js';

export const buyCrypto = async (req, res) => {
  const userId = req.user.id;
  const { symbol, amount } = req.body;

  if (!symbol || !amount) {
    return res.status(400).json({ msg: 'Missing symbol or amount' });
  }

  try {
    const price = await getPrice(symbol);

    if (!price) return res.status(400).json({ msg: 'Invalid symbol or price unavailable' });

    const user = await User.findById(userId);

    if (!user.wallet) user.wallet = { balance: 0, portfolio: [] };
    if (!Array.isArray(user.wallet.portfolio)) user.wallet.portfolio = [];

    const cost = amount * price;

    if (user.wallet.balance < cost) {
      return res.status(400).json({ msg: 'Insufficient balance' });
    }

    user.wallet.balance -= cost;

    const existingAsset = user.wallet.portfolio.find(c => c.symbol === symbol);
    if (existingAsset) {
      existingAsset.amount += amount;
    } else {
      user.wallet.portfolio.push({ symbol, amount });
    }

    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'buy',
      symbol,
      amount,
      price,
    });

    res.json({ msg: 'Crypto bought successfully', wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const sellCrypto = async (req, res) => {
  const userId = req.user.id;
  const { symbol, amount } = req.body;

  if (!symbol || !amount) {
    return res.status(400).json({ msg: 'Missing symbol or amount' });
  }

  try {
    const price = await getPrice(symbol);

    if (!price) return res.status(400).json({ msg: 'Invalid symbol or price unavailable' });

    const user = await User.findById(userId);

    if (!user.wallet) user.wallet = { balance: 0, portfolio: [] };
    if (!Array.isArray(user.wallet.portfolio)) user.wallet.portfolio = [];

    const asset = user.wallet.portfolio.find(c => c.symbol === symbol);

    if (!asset || asset.amount < amount) {
      return res.status(400).json({ msg: 'Not enough crypto to sell' });
    }

    asset.amount -= amount;
    user.wallet.balance += amount * price;

    if (asset.amount === 0) {
      user.wallet.portfolio = user.wallet.portfolio.filter(c => c.symbol !== symbol);
    }

    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'sell',
      symbol,
      amount,
      price,
    });

    res.json({ msg: 'Crypto sold successfully', wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
