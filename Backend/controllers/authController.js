import jwt from 'jsonwebtoken';
import bcrypt from bcryptjs;
import { User } from '../models/index.js';

export const register = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({ 
      ...rest, 
      password: hashedPassword 
    });
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ message: 'User already exists or invalid data' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  const { password, ...user } = req.user.toJSON();
  res.json(user);
};