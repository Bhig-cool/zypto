import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['buy', 'sell', 'fund'], required: true },
  symbol: { type: String },  // Optional for 'fund'
  amount: { type: Number, required: true },
  price: { type: Number },   // Optional for 'fund'
  date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
