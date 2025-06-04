// orders.js FINAL VERSION (Fetch data from backend)
import { API_URL } from './config.js';

const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded', async () => {
  if (!token) return window.location.href = 'login.html';

  const listContainer = document.getElementById('ordersList');
  const totalPurchases = document.getElementById('totalPurchases');
  const totalSpent = document.getElementById('totalSpent');
  const totalProducts = document.getElementById('totalProducts');

  try {
    const res = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const orders = await res.json();
    if (!Array.isArray(orders)) throw new Error('Invalid order data');

    let itemCount = 0;
    let totalPrice = 0;
    listContainer.innerHTML = '';

    if (orders.length === 0) {
      document.getElementById('emptyOrdersState').style.display = 'block';
      return;
    }

    orders.forEach((order, i) => {
      const itemsHTML = order.items.map(item => 
        `<li>${item.quantity}x ${item.Product?.name || 'produk ID ' + item.productId}</li>`
      ).join('');
      const orderCard = document.createElement('div');
      orderCard.className = 'order-card';
      orderCard.innerHTML = `
        <h3>Pesanan #${i + 1}</h3>
        <p>Tanggal: ${new Date(order.createdAt).toLocaleString()}</p>
        <ul>${itemsHTML}</ul>
        <p><strong>Total: Rp ${order.total?.toLocaleString() || 'N/A'}</strong></p>
      `;
      listContainer.appendChild(orderCard);

      itemCount += order.items.reduce((sum, item) => sum + item.quantity, 0);
      totalPrice += order.total || 0;
    });

    totalPurchases.textContent = orders.length;
    totalSpent.textContent = `Rp ${totalPrice.toLocaleString()}`;
    totalProducts.textContent = itemCount;

  } catch (err) {
    console.error('Gagal memuat pesanan:', err);
    document.getElementById('emptyOrdersState').style.display = 'block';
  }
});
