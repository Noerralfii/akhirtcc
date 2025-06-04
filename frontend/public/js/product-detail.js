// 🛍️ PRODUCT-DETAIL.JS - Detailed product view with style!
// Created by: The Product Display Masters 📦✨

document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('productDetail');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // Update user info in header
    updateUserInfo();
    updateCartCount();

    if (!productId) {
        showProductNotFound();
        return;
    }

    // Find the product
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showProductNotFound();
        return;
    }

    // Display product details
    displayProductDetail(product);

    // Functions
    function displayProductDetail(product) {
        productDetailContainer.innerHTML = `
            <div class="product-detail-wrapper" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px; align-items: start;">
                <!-- Product Image -->
                <div class="product-image-section">
                    <div class="product-main-image" style="position: relative; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-bottom: 20px;">
                        <img src="${product.image}" alt="${product.name}" 
                             style="width: 100%; height: 400px; object-fit: contain; border-radius: 15px; background: #f8f9fa;">
                        
                        <!-- Product Category Badge -->
                        <div style="position: absolute; top: 20px; left: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 15px; border-radius: 25px; font-size: 0.9em; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                            📦 ${product.category || 'Sembako'}
                        </div>

                        <!-- Stock Status Badge -->
                        <div style="position: absolute; top: 20px; right: 20px; background: ${product.stock > 10 ? '#4caf50' : product.stock > 0 ? '#ff9800' : '#f44336'}; color: white; padding: 8px 15px; border-radius: 25px; font-size: 0.9em; font-weight: 600;">
                            ${product.stock > 10 ? '✅ Stok Tersedia' : product.stock > 0 ? '⚠️ Stok Terbatas' : '❌ Stok Habis'}
                        </div>
                    </div>

                    <!-- Product Features -->
                    <div class="product-features" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 15px; padding: 20px; color: white;">
                        <h4 style="margin: 0 0 15px 0; font-size: 1.1em;">✨ Keunggulan Produk</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9em;">
                            <div>🏷️ Harga Terjangkau</div>
                            <div>📦 Kemasan Berkualitas</div>
                            <div>⚡ Pengiriman Cepat</div>
                            <div>🛡️ Jaminan Asli</div>
                        </div>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="product-info-section">
                    <div class="product-header" style="margin-bottom: 25px;">
                        <h1 style="font-size: 2.2em; color: #1565c0; margin: 0 0 10px 0; font-weight: 700; line-height: 1.2;">
                            ${product.name}
                        </h1>
                        
                        <!-- Rating Section -->
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <div style="color: #ffc107; font-size: 1.2em;">
                                ${'⭐'.repeat(5)}
                            </div>
                            <span style="color: #666; font-size: 0.95em;">(4.8/5 • 127 ulasan)</span>
                        </div>

                        <!-- Price Section -->
                        <div class="price-section" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 15px; margin-bottom: 25px; color: white;">
                            <div style="font-size: 0.9em; opacity: 0.9; margin-bottom: 5px;">Harga Terbaik</div>
                            <div style="font-size: 2.5em; font-weight: 800; margin-bottom: 5px;">
                                Rp ${product.price.toLocaleString()}
                            </div>
                            <div style="font-size: 0.9em; opacity: 0.9;">
                                💰 Hemat hingga 15% dari harga pasaran
                            </div>
                        </div>
                    </div>

                    <!-- Product Description -->
                    <div class="product-description" style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.08); margin-bottom: 25px;">
                        <h3 style="color: #1565c0; margin: 0 0 15px 0; font-size: 1.3em;">📝 Deskripsi Produk</h3>
                        <p style="color: #555; line-height: 1.6; margin: 0;">
                            ${product.description || `${product.name} adalah produk berkualitas tinggi yang sangat cocok untuk kebutuhan sehari-hari Anda. Dengan kemasan yang praktis dan harga yang terjangkau, produk ini menjadi pilihan terbaik untuk keluarga Indonesia.`}
                        </p>
                    </div>

                    <!-- Product Specifications -->
                    <div class="product-specs" style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.08); margin-bottom: 30px;">
                        <h3 style="color: #1565c0; margin: 0 0 20px 0; font-size: 1.3em;">📋 Spesifikasi</h3>
                        <div style="display: grid; gap: 12px;">
                            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                                <span style="color: #666; font-weight: 500;">Kategori:</span>
                                <span style="color: #333; font-weight: 600;">${product.category || 'Sembako'}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                                <span style="color: #666; font-weight: 500;">Stok Tersedia:</span>
                                <span style="color: #333; font-weight: 600;">${product.stock} unit</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                                <span style="color: #666; font-weight: 500;">Berat:</span>
                                <span style="color: #333; font-weight: 600;">${product.weight || '500g'}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                                <span style="color: #666; font-weight: 500;">SKU:</span>
                                <span style="color: #333; font-weight: 600;">SKU-${String(product.id).padStart(4, '0')}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Add to Cart Section -->
                    <div class="cart-actions" style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.08);">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #333; font-weight: 600; margin-bottom: 10px; font-size: 1.1em;">
                                🔢 Jumlah Pembelian
                            </label>
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <button id="decreaseQty" 
                                        style="width: 45px; height: 45px; border: 2px solid #1565c0; background: white; color: #1565c0; border-radius: 10px; font-size: 1.2em; font-weight: bold; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
                                    −
                                </button>
                                <input type="number" id="quantity" value="1" min="1" max="${product.stock}" 
                                       style="width: 80px; height: 45px; text-align: center; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1.1em; font-weight: 600; color: #333;">
                                <button id="increaseQty" 
                                        style="width: 45px; height: 45px; border: 2px solid #1565c0; background: #1565c0; color: white; border-radius: 10px; font-size: 1.2em; font-weight: bold; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
                                    +
                                </button>
                                <div style="margin-left: 15px;">
                                    <div style="font-size: 0.9em; color: #666;">Total Harga:</div>
                                    <div id="totalPrice" style="font-size: 1.3em; font-weight: 700; color: #4caf50;">
                                        Rp ${product.price.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px;">
                            <button id="addToCartBtn" 
                                    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 15px 20px; border-radius: 12px; font-size: 1em; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);"
                                    ${product.stock === 0 ? 'disabled' : ''}>
                                🛒 Tambah ke Keranjang
                            </button>
                            <button id="buyNowBtn" 
                                    style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; padding: 15px 20px; border-radius: 12px; font-size: 1.1em; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);"
                                    ${product.stock === 0 ? 'disabled' : ''}>
                                ⚡ Beli Sekarang
                            </button>
                        </div>

                        ${product.stock === 0 ? 
                            '<div style="text-align: center; margin-top: 15px; padding: 10px; background: #ffebee; color: #c62828; border-radius: 8px; font-weight: 600;">❌ Produk sedang tidak tersedia</div>' : 
                            '<div style="text-align: center; margin-top: 15px; color: #4caf50; font-size: 0.9em; font-weight: 500;">✅ Siap dikirim dalam 24 jam</div>'
                        }
                    </div>
                </div>
            </div>

            <!-- Related Products Section -->
            <div class="related-products" style="margin-top: 50px;">
                <h3 style="text-align: center; color: #1565c0; margin-bottom: 30px; font-size: 1.8em; font-weight: 600;">
                    🛍️ Produk Terkait
                </h3>
                <div id="relatedProducts" class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <!-- Related products will be loaded here -->
                </div>
            </div>
        `;

        // Add event listeners
        setupEventListeners(product);
        loadRelatedProducts(product);
    }

    function setupEventListeners(product) {
        const quantityInput = document.getElementById('quantity');
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const totalPriceEl = document.getElementById('totalPrice');
        const addToCartBtn = document.getElementById('addToCartBtn');
        const buyNowBtn = document.getElementById('buyNowBtn');

        // Update total price
        function updateTotalPrice() {
            const quantity = parseInt(quantityInput.value) || 1;
            const total = product.price * quantity;
            totalPriceEl.textContent = `Rp ${total.toLocaleString()}`;
        }

        // Quantity controls
        decreaseBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value) || 1;
            if (quantity > 1) {
                quantityInput.value = quantity - 1;
                updateTotalPrice();
            }
        });

        increaseBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value) || 1;
            if (quantity < product.stock) {
                quantityInput.value = quantity + 1;
                updateTotalPrice();
            }
        });

        quantityInput.addEventListener('input', () => {
            let quantity = parseInt(quantityInput.value) || 1;
            if (quantity > product.stock) {
                quantityInput.value = product.stock;
            } else if (quantity < 1) {
                quantityInput.value = 1;
            }
            updateTotalPrice();
        });

        // Add to cart button
        addToCartBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Silakan login terlebih dahulu untuk berbelanja! 🔑', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
                return;
            }

            const quantity = parseInt(quantityInput.value) || 1;
            addToCart(product.id, quantity);
        });

        // Buy now button
        buyNowBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Silakan login terlebih dahulu untuk berbelanja! 🔑', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
                return;
            }

            const quantity = parseInt(quantityInput.value) || 1;
            addToCart(product.id, quantity);
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 500);
        });

        // Add hover effects
        [decreaseBtn, increaseBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.1)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });

        [addToCartBtn, buyNowBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = btn.id === 'addToCartBtn' ? 
                    '0 4px 15px rgba(102, 126, 234, 0.3)' : 
                    '0 4px 15px rgba(240, 147, 251, 0.3)';
            });
        });
    }

    function loadRelatedProducts(currentProduct) {
        const relatedProductsContainer = document.getElementById('relatedProducts');
        const relatedProducts = products
            .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
            .slice(0, 4);

        if (relatedProducts.length === 0) {
            relatedProductsContainer.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">Tidak ada produk terkait yang ditemukan.</p>';
            return;
        }

        relatedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.style.cssText = `
                background: white;
                border-radius: 15px;
                padding: 20px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                cursor: pointer;
                text-align: center;
            `;

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" 
                     style="width: 100%; height: 150px; object-fit: contain; border-radius: 10px; margin-bottom: 15px; background: #f8f9fa;">
                <h4 style="color: #1565c0; margin: 0 0 10px 0; font-size: 1.1em; font-weight: 600;">${product.name}</h4>
                <p style="color: #4caf50; font-size: 1.2em; font-weight: 700; margin: 0 0 10px 0;">Rp ${product.price.toLocaleString()}</p>
                <button onclick="window.location.href='product-detail.html?id=${product.id}'" 
                        style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.9em; font-weight: 600; cursor: pointer;">
                    Lihat Detail
                </button>
            `;

            productCard.addEventListener('mouseenter', () => {
                productCard.style.transform = 'translateY(-5px)';
                productCard.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            });

            productCard.addEventListener('mouseleave', () => {
                productCard.style.transform = 'translateY(0)';
                productCard.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });

            relatedProductsContainer.appendChild(productCard);
        });
    }

    function showProductNotFound() {
        productDetailContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 4em; color: #ccc; margin-bottom: 20px;">📦</div>
                <h2 style="color: #666; margin-bottom: 15px;">Produk Tidak Ditemukan</h2>
                <p style="color: #999; margin-bottom: 25px;">Maaf, produk yang Anda cari tidak tersedia.</p>
                <a href="products.html" class="btn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
                    ← Kembali ke Produk
                </a>
            </div>
        `;
    }

    function addToCart(productId, quantity) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
            showNotification('Error: User tidak ditemukan!', 'error');
            return;
        }

        const user = users[userIndex];
        if (!user.cart) user.cart = [];

        const existingItem = user.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ productId, quantity });
        }

        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));

        updateCartCount();
        showNotification(`✅ ${quantity} produk berhasil ditambahkan ke keranjang!`, 'success');
    }

    function updateUserInfo() {
        if (currentUser) {
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.textContent = `Logout (${currentUser.name || currentUser.username})`;
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
        }
    }

    function updateCartCount() {
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl && currentUser && currentUser.cart) {
            const totalItems = currentUser.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountEl.textContent = totalItems;
        }
    }

    function logout() {
        localStorage.removeItem('currentUser');
        showNotification('Berhasil logout! 👋', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }

    function showNotification(message, type = 'info') {
        // Create notification if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 1000;
                transition: all 0.3s ease;
                transform: translateX(400px);
            `;
            document.body.appendChild(notification);
        }

        const colors = {
            success: '#4caf50',
            error: '#f44336',
            info: '#2196f3'
        };

        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;
        notification.style.transform = 'translateX(0)';

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
        }, 3000);
    }
});

// 🎊 End of file - May your products always be detailed and your customers always be satisfied! 🛍️✨