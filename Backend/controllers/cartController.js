import { User, Cart } from '../models/index.js';

export const getCart = async (req, res) => {
  const items = await Cart.findAll({ where: { userId: req.user.id } });
  res.json({ userId: req.user.id, items });
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const [item, created] = await Cart.findOrCreate({
    where: { userId: req.user.id, productId },
    defaults: { quantity },
  });
  if (!created) {
    item.quantity += quantity;
    await item.save();
  }
  res.json(item);
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  await Cart.destroy({ where: { userId: req.user.id, productId } });
  res.json({ message: 'Removed from cart' });
};
