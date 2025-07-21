import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema({
  symbol: String,
  amount: Number,
});

const walletSchema = new mongoose.Schema({
  ethAddress: { type: String, required: true },
  privateKey: { type: String, required: true },
  balance: { type: Number, default: 10000000 },
  portfolio: { type: [portfolioItemSchema], default: [] },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wallet: { type: walletSchema, default: () => ({}) },
});

const User = mongoose.model('User', userSchema);

export default User;
