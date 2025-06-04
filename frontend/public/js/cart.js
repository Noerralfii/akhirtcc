// cart.js FINAL - backend version
import { API_URL } from 'config.js';

const token = localStorage.getItem('token');

async function fetchCart() {
  const res = await fetch(`${API_URL}/cart`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.items;
}

function showCartItems(items) {
  const cartContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  cartContainer.innerHTML = '';
  let total = 0;

  if (!items.length) {
    cartContainer.innerHTML = '<p>Keranjang kosong. 😢</p>';
    cartTotal.textContent = 'Rp 0';
    return;
  }

  items.forEach(item => {
    total += item.Product.price * item.quantity;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.Product.image}" alt="${item.Product.name}">
      <div class="cart-item-info">
        <h3>${item.Product.name}</h3>
        <p class="cart-item-price">Rp ${item.Product.price.toLocaleString()}</p>
        <div class="cart-item-quantity">
          <span>Jumlah: ${item.quantity}</span>
        </div>
      </div>
      <div class="cart-item-remove">
        <button class="btn btn-danger" onclick="removeItem(${item.productId})">Hapus</button>
      </div>
    `;
    cartContainer.appendChild(el);
  });

  cartTotal.textContent = `Rp ${total.toLocaleString()}`;
}

window.removeItem = async function (productId) {
  try {
    const res = await fetch(`${API_URL}/cart/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });
    if (!res.ok) throw new Error('Gagal menghapus item');
    const items = await fetchCart();
    showCartItems(items);
  } catch (err) {
    alert(err.message);
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const items = await fetchCart();
    showCartItems(items);
  } catch (err) {
    document.getElementById('cartItems').innerHTML = '<p>Gagal memuat keranjang.</p>';
  }
});
