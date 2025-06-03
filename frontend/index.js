// index.js - Frontend toko sembako sederhana dengan localStorage

// ===============================
// Data dan utilitas localStorage
// ===============================
function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===============================
// Render Produk
// ===============================
function renderProducts() {
  const products = getProducts();
  const container = document.getElementById("product-container");
  container.innerHTML = "";

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>Harga: Rp ${product.price}</p>
      <button onclick="addToCart('${product.id}')">🛒 Beli</button>
    `;
    container.appendChild(div);
  });
}

// ===============================
// Keranjang Belanja
// ===============================
function addToCart(productId) {
  const products = getProducts();
  const cart = getCart();
  const product = products.find(p => p.id === productId);

  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ id: productId, name: product.name, price: product.price, quantity: 1 });
  }

  saveCart(cart);
  alert("Produk ditambahkan ke keranjang!");
  renderCartBadge();
}

function renderCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = totalItems;
}

// ===============================
// Login dan Register
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
  const userExists = users.some(u => u.username === username);

  if (userExists) {
    alert("Username sudah digunakan.");
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Pendaftaran berhasil. Silakan login.");
  window.location.href = "login.html";
}

// ===============================
// Load awal halaman
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCartBadge();
});
