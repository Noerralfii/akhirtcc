
const apiBase = "http://localhost:3000/api"; // atau sesuaikan dengan Cloud Run kamu
import { apiBase } from "./config.js";
console.log("main.js loaded");
// Debug: pastikan apiBase tersedia
if (typeof apiBase === 'undefined') {
  console.error('❌ apiBase is undefined. Pastikan config.js dimuat terlebih dahulu.');
} else {
  console.log('✅ apiBase =', apiBase);
}

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Gagal menghubungi server.');
  }
});

const productContainer = document.getElementById('products');
const modal = document.getElementById('modal');
let selectedProduct = null;

async function fetchProducts() {
  try {
    console.log('🔄 Fetching products from:', `${apiBase}/products`);
    const res = await fetch(`${apiBase}/products`);
    if (!res.ok) throw new Error('Gagal fetch produk');
    const products = await res.json();

    productContainer.innerHTML = '';
    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <img src="https://via.placeholder.com/200" alt="${p.name}">
        <div class="card-body">
          <h4>${p.name}</h4>
          <p>Rp ${p.price}</p>
        </div>
      `;
      div.onclick = () => showModal(p);
      productContainer.appendChild(div);
    });
  } catch (err) {
    console.error('❌ Gagal memuat produk:', err);
    productContainer.innerHTML = `<p style="color:red;text-align:center;">Gagal memuat produk</p>`;
  }
}

function showModal(product) {
  selectedProduct = product;
  document.getElementById('modalTitle').innerText = product.name;
  document.getElementById('modalDesc').innerText = `Stok: ${product.stock}`;
  document.getElementById('modalPrice').innerText = `Rp ${product.price}`;
  modal.style.display = 'flex';
}

function addToCart() {
  const quantity = parseInt(document.getElementById('quantity').value);
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push({ product: selectedProduct, quantity });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Ditambahkan ke keranjang');
  modal.style.display = 'none';
}

window.onclick = function (e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}

fetchProducts();
