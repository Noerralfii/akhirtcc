import { API_URL } from 'config.js';
import { updateCartCount } from 'auth.js';

let allProducts = [];

// Fetch produk dari backend
async function fetchProducts() {
  try {
    toggleLoading(true);
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    allProducts = data;
    displayProducts(allProducts);
    toggleLoading(false);
  } catch (err) {
    toggleLoading(false);
    console.error('Gagal mengambil produk:', err);
    showEmptyState();
  }
}

// Menampilkan produk
function displayProducts(productsToShow) {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  if (!productsToShow.length) {
    showEmptyState();
    return;
  }

  productsToShow.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-price">Rp ${product.price.toLocaleString()}</p>
        <a href="product-detail.html?id=${product.id}" class="btn">Lihat Detail</a>
      </div>
    `;
    productList.appendChild(card);
  });
}

function showEmptyState() {
  document.getElementById('emptyState').style.display = 'block';
  document.getElementById('productList').innerHTML = '';
}

function toggleLoading(show) {
  document.getElementById('loadingState').style.display = show ? 'block' : 'none';
}

// Filter produk
function filterProducts() {
  const search = document.getElementById('searchProduct').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;

  const filtered = allProducts.filter(p => {
    const matchName = p.name.toLowerCase().includes(search);
    const matchCat = category === 'all' || p.category === category;
    return matchName && matchCat;
  });

  displayProducts(filtered);
}

// Inisialisasi jika di halaman produk
if (document.getElementById('productList')) {
  fetchProducts();
  document.getElementById('searchProduct').addEventListener('input', filterProducts);
  document.getElementById('categoryFilter').addEventListener('change', filterProducts);
}
