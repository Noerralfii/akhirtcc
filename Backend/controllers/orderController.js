const { Order, Cart, Product } = require('..');

exports.createOrder = async (req, res) => {
  const items = await Cart.findAll({ where: { userId: req.user.id } });
  if (!items.length) return res.status(400).json({ message: 'Cart is empty' });

  let total = 0;
  const productMap = {};
  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    productMap[item.productId] = product;
    total += product.price * item.quantity;
  }

  const order = await Order.create({
    userId: req.user.id,
    items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
    total,
  });

  await Cart.destroy({ where: { userId: req.user.id } });
  res.status(201).json(order);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.findAll({ where: { userId: req.user.id } });
  res.json(orders);
};