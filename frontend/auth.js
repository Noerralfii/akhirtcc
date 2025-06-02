// Simpan data user (simulasi database)
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Redirect jika sudah login
if (currentUser) {
    if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
        window.location.href = 'home.html';
    }
}

// Redirect jika belum login
if (!currentUser && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
    window.location.href = 'login.html';
}

// Form Register
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // Validasi
        if (password !== confirmPassword) {
            alert('Password dan konfirmasi password tidak sama!');
            return;
        }
        
        // Cek jika email sudah terdaftar
        if (users.some(user => user.email === email)) {
            alert('Email sudah terdaftar!');
            return;
        }
        
        // Tambahkan user baru
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            cart: []
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Registrasi berhasil! Silakan login.');
        window.location.href = 'login.html';
    });
}

// Form Login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Cari user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Login berhasil
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'home.html';
        } else {
            alert('Email atau password salah!');
        }
    });
}

// Logout
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
}

// Update cart count di navbar
function updateCartCount() {
    if (currentUser) {
        const cartCountElements = document.querySelectorAll('#cartCount');
        const totalItems = currentUser.cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }
}

// Panggil updateCartCount saat halaman dimuat
if (document.readyState === 'complete') {
    updateCartCount();
} else {
    document.addEventListener('DOMContentLoaded', updateCartCount);
}