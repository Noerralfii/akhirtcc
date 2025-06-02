const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  const total = cart.items.reduce((sum, i) => sum + i.quantity * i.productId.price, 0);
  const order = new Order({ userId: req.user._id, items: cart.items, total });
  await order.save();

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.json(orders);
};
