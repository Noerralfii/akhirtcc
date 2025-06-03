import { API_URL } from './config.js';

// Redirect jika sudah login
const token = localStorage.getItem('token');
if (token) {
  if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
    window.location.href = 'products.html';
  }
} else {
  if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
    window.location.href = 'login.html';
  }
}

// Fungsi login
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login gagal');

  localStorage.setItem('token', data.token);
  window.location.href = 'products.html';
}

// Fungsi register
export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registrasi gagal');

  localStorage.setItem('token', data.token);
  window.location.href = 'products.html';
}

// Logout
export function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// Update cart count (opsional untuk navigasi)
export function updateCartCount(count = 0) {
  const cartCountElements = document.querySelectorAll('#cartCount');
  cartCountElements.forEach(el => (el.textContent = count));
}
