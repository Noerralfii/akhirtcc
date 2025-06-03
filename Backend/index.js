// index.js - Frontend toko sembako lokal

// ===============================
// Konfigurasi API
// ===============================
const API_URL = "https://be-040-dot-b-02-451105.uc.r.appspot.com/api"; // Sesuaikan URL backend

// ===============================
// Ambil dan tampilkan produk dari backend
// ===============================
async function renderProducts() {
  const container = document.getElementById("product-container");
  container.innerHTML = "Memuat produk...";
  try {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    container.innerHTML = "";
    products.forEach(product => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <h3>${product.name}</h3>
        <p>Harga: Rp ${product.price}</p>
        <button onclick="addToCart('${product.id}', '${product.name}', ${product.price})">🛒 Beli</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    container.innerHTML = "Gagal memuat produk.";
    console.error(err);
  }
}

// ===============================
// Keranjang Belanja (localStorage)
// ===============================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id, name, price) {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  saveCart(cart);
  alert("Produk ditambahkan ke keranjang!");
  renderCartBadge();
}

function renderCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = total;
}

// ===============================
// Login & Register via localStorage
// ===============================
function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html";
  } else {
    alert("Username atau password salah.");
  }
}

function register() {
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;

  if (!username || !password) {
    alert("Semua field wajib diisi.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(u => u.username === username)) {
    alert("Username sudah digunakan.");
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Pendaftaran berhasil. Silakan login.");
  window.location.href = "login.html";
}

// ===============================
// Inisialisasi Halaman
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCartBadge();
});
