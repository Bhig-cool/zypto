import Transaction from '../models/Transaction.js';

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch transactions', error: err.message });
  }
};
