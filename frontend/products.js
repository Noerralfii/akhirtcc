// Data produk
const products = [
    {
        id: 1,
        name: "Beras Pandan Wangi 5kg",
        price: 65000,
        category: "beras",
        description: "Beras premium dengan aroma pandan wangi, kemasan 5kg.",
        image: "assets/BerasPandanWangi.png"
    },
    {
        id: 2,
        name: "Minyak Goreng Bimoli 2L",
        price: 35000,
        category: "minyak",
        description: "Minyak goreng kemasan 2 liter, bebas kolesterol.",
        image: "assets/MinyakGorengBimoli.png"
    },
    {
        id: 3,
        name: "Gula Pasir Gulaku 1kg",
        price: 15000,
        category: "gula",
        description: "Gula pasir murni kemasan 1kg, cocok untuk segala keperluan.",
        image: "assets/Gulaku.png"
    },
    {
        id: 4,
        name: "Telur Ayam Ras 1kg",
        price: 28000,
        category: "sembako",
        description: "Telur ayam ras segar, kemasan 1kg (isi sekitar 16-17 butir).",
        image: "assets/TelurAyam.png"
    },
    {
        id: 5,
        name: "Mie Instan Indomie Goreng 1 dus",
        price: 120000,
        category: "sembako",
        description: "Mie instan rasa goreng, 1 dus isi 40 bungkus.",
        image: "assets/Indomie.png"
    },
    {
        id: 6,
        name: "Kecap Bango 620ml",
        price: 22000,
        category: "sembako",
        description: "Kecap manis kental, kemasan botol 620ml.",
        image: "assets/KecapBango.png"
    },
    {
        id: 7,
        name: "Tepung Terigu Segitiga Biru 1kg",
        price: 12000,
        category: "sembako",
        description: "Tepung terigu serbaguna, kemasan 1kg.",
        image: "assets/TepungSegitigaBiru.png"
    },
    {
        id: 8,
        name: "Garam Cap Kapal 1kg",
        price: 8000,
        category: "sembako",
        description: "Garam dapur halus, kemasan 1kg.",
        image: "assets/GaramCapKapal.png"
    }
];

// Tampilkan produk di halaman products.html
if (document.getElementById('productList')) {
    displayProducts(products);
    
    // Filter produk
    document.getElementById('searchProduct').addEventListener('input', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
}

// Tampilkan detail produk di halaman product-detail.html
if (document.getElementById('productDetail')) {
    displayProductDetail();
}

// Fungsi untuk menampilkan produk
function displayProducts(productsToDisplay) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">Rp ${product.price.toLocaleString()}</p>
                <a href="product-detail.html?id=${product.id}" class="btn">Lihat Detail</a>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// Fungsi untuk filter produk
function filterProducts() {
    const searchTerm = document.getElementById('searchProduct').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
    });
    
    displayProducts(filteredProducts);
}

// Fungsi untuk menampilkan detail produk
function displayProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);
    const productDetail = document.getElementById('productDetail');
    
    if (product) {
        productDetail.innerHTML = `
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}" width="100%">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p class="product-detail-price">Rp ${product.price.toLocaleString()}</p>
                
                <div class="quantity-selector">
                    <button onclick="changeQuantity(-1)">-</button>
                    <input type="number" id="quantity" value="1" min="1">
                    <button onclick="changeQuantity(1)">+</button>
                </div>
                
                <button onclick="addToCart(${product.id})" class="btn">Tambah ke Keranjang</button>
            </div>
        `;
    } else {
        productDetail.innerHTML = '<p>Produk tidak ditemukan.</p>';
    }
}

// Fungsi untuk mengubah quantity
function changeQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let newValue = parseInt(quantityInput.value) + change;
    
    if (newValue < 1) newValue = 1;
    
    quantityInput.value = newValue;
}

// Fungsi untuk menambahkan ke keranjang
function addToCart(productId) {
    const quantity = parseInt(document.getElementById('quantity').value);
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Update currentUser
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Cek jika produk sudah ada di keranjang
    const existingItem = currentUser.cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        currentUser.cart.push({
            productId,
            quantity,
            price: product.price
        });
    }
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users data
    let users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update cart count
    updateCartCount();
    
    // Tampilkan notifikasi
    showNotification(`${product.name} telah ditambahkan ke keranjang`);
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    notificationMessage.textContent = message;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Fungsi global untuk diakses dari HTML
window.changeQuantity = changeQuantity;
window.addToCart = addToCart;