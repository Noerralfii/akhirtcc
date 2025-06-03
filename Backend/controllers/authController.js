import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ message: 'User already exists or invalid data' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
};

export const getProfile = async (req, res) => {
  const { password, ...user } = req.user.toJSON();
  res.json(user);
};
