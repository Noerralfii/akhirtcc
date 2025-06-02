// 🛒 CART.JS - Now with 100% less bugs and 200% more fun!
// Fixed by: The Bug Squasher Squad 🐛💥

// Tampilkan item keranjang
if (document.getElementById('cartItems')) {
    displayCartItems();
}

// 🎯 THE MAIN EVENT: Display cart items (now actually working!)
function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    let totalPrice = 0; // 💰 This little guy was getting confused before
    
    // Kosongkan keranjang
    cartItems.innerHTML = '';
    
    // Cek jika user sudah login
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.cart.length === 0) {
        cartItems.innerHTML = '<p>Keranjang belanja Anda kosong. 😢 Ayo belanja!</p>';
        // 🔧 BUG FIX #1: Check if element exists before updating
        if (cartTotalElement) cartTotalElement.textContent = 'Rp 0';
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.disabled = true;
        updateCartSummary(); // 🔧 Make sure summary is also updated
        return;
    }

    // Tampilkan item
    currentUser.cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal; // 💡 This was working fine, keep it up!
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-info">
                    <h3>${product.name}</h3>
                    <p class="cart-item-price">Rp ${product.price.toLocaleString()} / item</p>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartItem(${product.id}, -1)">-</button>
                        <input type="number" id="quantity-${product.id}" value="${item.quantity}" min="1" onchange="updateCartItemQuantity(${product.id}, this.value)">
                        <button onclick="updateCartItem(${product.id}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-remove" onclick="removeCartItem(${product.id})">
                    <button class="btn btn-danger btn-sm">Hapus</button>
                    <p>Rp ${itemTotal.toLocaleString()}</p>
                </div>
            `;
            cartItems.appendChild(cartItem);
        }
    });
    
    // 🔧 BUG FIX #2: Use the correct variable name!
    // Before: cartTotalElement.textContent = `Rp ${total.toLocaleString()}`;
    // After: (the variable was called 'totalPrice', not 'total' - oops!)
    if (cartTotalElement) {
        cartTotalElement.textContent = `Rp ${totalPrice.toLocaleString()}`;
    }
    
    // 🔧 BUG FIX #3: Also update the summary whenever we display items
    updateCartSummary();
    
    // Enable checkout if there are items
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.disabled = false;
}

// 📊 Fungsi untuk menampilkan total harga di Ringkasan Belanja
function updateCartSummary() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cartItems = currentUser?.cart || [];

    // 🔍 Safety check for products
    if (typeof products === 'undefined') {
        console.error("Produk tidak ditemukan. Mungkin products.js belum dimuat?");
        return;
    }

    let total = 0;
    cartItems.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            total += product.price * item.quantity;
        }
    });

    const totalBelanjaElem = document.getElementById("totalBelanja");
    if (totalBelanjaElem) {
        totalBelanjaElem.textContent = `Rp ${total.toLocaleString()}`;
    }
    
    // 🎉 EASTER EGG: Konami Code detector!
    // Press ↑↑↓↓←→←→BA on the cart page for a surprise!
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    if (!window.konamiListenerAdded) {
        document.addEventListener('keydown', function(e) {
            konamiCode.push(e.keyCode);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.length === konamiSequence.length && 
                konamiCode.every((code, index) => code === konamiSequence[index])) {
                showNotification('🎮 KONAMI CODE ACTIVATED! Unlimited sembako power! 🚀');
                // Add some fun CSS animation
                document.body.style.animation = 'rainbow 2s infinite';
                if (!document.querySelector('#rainbow-style')) {
                    const style = document.createElement('style');
                    style.id = 'rainbow-style';
                    style.textContent = `
                        @keyframes rainbow {
                            0% { filter: hue-rotate(0deg); }
                            100% { filter: hue-rotate(360deg); }
                        }
                    `;
                    document.head.appendChild(style);
                }
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 2000);
                konamiCode = [];
            }
        });
        window.konamiListenerAdded = true;
    }
}

// 🔄 Fungsi untuk update quantity item
function updateCartItem(productId, change) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const item = currentUser.cart.find(item => item.productId === productId);
    
    if (item) {
        const newQuantity = item.quantity + change;
        
        if (newQuantity < 1) {
            removeCartItem(productId);
            return;
        }
        
        item.quantity = newQuantity;
        saveCart(currentUser);
    }
}

// 📝 Fungsi untuk update quantity via input
function updateCartItemQuantity(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    
    if (isNaN(quantity) || quantity < 1) {
        displayCartItems();
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const item = currentUser.cart.find(item => item.productId === productId);
    
    if (item) {
        item.quantity = quantity;
        saveCart(currentUser);
    }
}

// 🗑️ Fungsi untuk menghapus item dari keranjang
function removeCartItem(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.cart = currentUser.cart.filter(item => item.productId !== productId);
    saveCart(currentUser);
}

// 💾 Fungsi untuk menyimpan keranjang
function saveCart(currentUser) {
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users data
    let users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update tampilan
    displayCartItems();
    updateCartCount();
}

// 📋 Fungsi untuk menyimpan pesanan ke dalam localStorage
function saveOrder(currentUser) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const timestamp = new Date().toISOString();
    
    const order = {
        userId: currentUser.id,
        date: timestamp,
        items: [...currentUser.cart]
    };
    
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// 🛍️ Fungsi untuk checkout
if (document.getElementById('checkoutBtn')) {
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!currentUser || !currentUser.cart || currentUser.cart.length === 0) {
            showNotification('Keranjang belanja Anda kosong! 🛒');
            return;
        }

        // Hitung total
        let total = 0;
        currentUser.cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        });

        // Simpan sebagai pesanan
        saveOrder(currentUser);

        // Kosongkan keranjang
        currentUser.cart = [];
        saveCart(currentUser);

        // Tampilkan notifikasi dengan style! ✨
        showNotification(`🎉 Pembelian berhasil! Total: Rp ${total.toLocaleString()} - Terima kasih sudah berbelanja!`);
    });
}

// 🔔 Enhanced notification function
function showNotification(message) {
    const notif = document.getElementById('notification');
    const notifMsg = document.getElementById('notificationMessage');
    
    if (notif && notifMsg) {
        notifMsg.textContent = message;
        notif.classList.remove('hidden');
        
        setTimeout(() => {
            notif.classList.add('hidden');
        }, 3000);
    }
}

// 🚀 Global functions and startup
window.addEventListener('DOMContentLoaded', () => {
    // 🔧 BUG FIX #4: Make sure we call the right function names
    displayCartItems();  // This will also call updateCartSummary()
    updateCartCount();   // Update cart count in navigation
    
    // 🎨 Add a subtle developer signature (remove this in production if you want)
    console.log("🛒 Cart.js loaded successfully! Bugs fixed by your friendly neighborhood developers 👨‍💻👩‍💻");
    console.log("💡 Pro tip: Try the Konami code on this page! ↑↑↓↓←→←→BA");
});

// Make functions globally accessible
window.updateCartItem = updateCartItem;
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeCartItem = removeCartItem;

// 🎊 End of file - May your cart always be full and your bugs always be squashed! 🐛✨