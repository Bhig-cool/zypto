import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Wallet } from 'ethers';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Ethereum wallet
    const ethWallet = Wallet.createRandom();
    const ethAddress = ethWallet.address;
    const privateKey = ethWallet.privateKey;

    const user = new User({
      email,
    password: hashedPassword,
    wallet: {
    ethAddress,
    privateKey,
    balance: 10000000,
    portfolio: []
      }
    });

    await user.save();

    res.status(201).json({
      msg: 'User registered successfully',
      wallet: {
        address: ethAddress,
        privateKey: privateKey
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Registration failed', error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        wallet: user.wallet,
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
};
