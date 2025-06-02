const apiBase = 'https://YOUR-BACKEND-APPENGINE-URL/api';

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

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
});

const productContainer = document.getElementById('products');
const modal = document.getElementById('modal');
let selectedProduct = null;

async function fetchProducts() {
  const res = await fetch(`${apiBase}/products`);
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

window.onclick = function(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}

fetchProducts();