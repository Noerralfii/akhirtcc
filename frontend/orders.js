document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    const ordersList = document.getElementById('ordersList');
    const emptyOrdersState = document.getElementById('emptyOrdersState');
    const loadingOrdersState = document.getElementById('loadingOrdersState');
    const orderDateFilter = document.getElementById('orderDateFilter');
    const orderDetailModal = document.getElementById('orderDetailModal');
    const closeModal = document.getElementById('closeModal');
    
    // Elements untuk statistik
    const totalPurchasesEl = document.getElementById('totalPurchases');
    const totalSpentEl = document.getElementById('totalSpent');
    const totalProductsEl = document.getElementById('totalProducts');

    // Cek apakah user sudah login
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu', 'error');
        window.location.href = 'login.html';
        return;
    }

    // Update nama user di header
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = currentUser.name || currentUser.username || 'User';
    }

    // Filter pesanan berdasarkan user
    let userOrders = orders.filter(order => order.userId === currentUser.id);
    let filteredOrders = [...userOrders];

    // Fungsi untuk memformat mata uang
    function formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Fungsi untuk memformat tanggal
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 🔧 PERBAIKAN UTAMA: Fungsi untuk menghitung total order yang lebih robust
    function calculateOrderTotal(order) {
        // Jika order sudah punya total yang tersimpan dan valid, gunakan itu
        if (order.total && order.total > 0) {
            return order.total;
        }
        
        // Jika tidak ada items, return 0
        if (!order.items || order.items.length === 0) {
            console.warn('Order tidak memiliki items:', order);
            return 0;
        }
        
        let calculatedTotal = 0;
        order.items.forEach(item => {
            // Pastikan item memiliki productId dan quantity
            if (!item.productId || !item.quantity) {
                console.warn('Item tidak valid:', item);
                return;
            }
            
            const product = products.find(p => p.id === item.productId);
            if (product) {
                const itemTotal = product.price * item.quantity;
                calculatedTotal += itemTotal;
                console.log(`Item: ${product.name}, Harga: ${product.price}, Qty: ${item.quantity}, Total: ${itemTotal}`);
            } else {
                console.warn(`Product not found for ID: ${item.productId}`);
                // Jika produk tidak ditemukan, coba gunakan harga yang tersimpan di item (jika ada)
                if (item.price) {
                    const itemTotal = item.price * item.quantity;
                    calculatedTotal += itemTotal;
                    console.log(`Using stored price for missing product - Price: ${item.price}, Qty: ${item.quantity}, Total: ${itemTotal}`);
                }
            }
        });
        
        console.log(`Total calculated for order: ${calculatedTotal}`);
        return calculatedTotal;
    }

    // Fungsi untuk filter berdasarkan tanggal
    function filterOrdersByDate(filterType) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisYear = new Date(now.getFullYear(), 0, 1);

        switch (filterType) {
            case 'today':
                filteredOrders = userOrders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= today;
                });
                break;
            case 'week':
                filteredOrders = userOrders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= thisWeek;
                });
                break;
            case 'month':
                filteredOrders = userOrders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= thisMonth;
                });
                break;
            case 'year':
                filteredOrders = userOrders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= thisYear;
                });
                break;
            default:
                filteredOrders = [...userOrders];
        }
        renderOrders();
        updateStatistics();
    }

    // 🔧 PERBAIKAN: Fungsi untuk menghitung statistik yang lebih akurat
    function updateStatistics() {
        const totalPurchases = filteredOrders.length;
        let totalSpent = 0;
        let totalProducts = 0;

        console.log('🔍 Updating statistics for orders:', filteredOrders.length);

        filteredOrders.forEach((order, index) => {
            // Gunakan fungsi calculateOrderTotal yang sudah diperbaiki
            const orderTotal = calculateOrderTotal(order);
            totalSpent += orderTotal;
            
            console.log(`Order ${index + 1}: Total = ${orderTotal}`);
            
            // Hitung total produk
            if (order.items && order.items.length > 0) {
                order.items.forEach(item => {
                    if (item.quantity && !isNaN(item.quantity)) {
                        totalProducts += parseInt(item.quantity);
                    }
                });
            }
        });

        // Update tampilan statistik
        if (totalPurchasesEl) totalPurchasesEl.textContent = totalPurchases;
        if (totalSpentEl) totalSpentEl.textContent = formatCurrency(totalSpent);
        if (totalProductsEl) totalProductsEl.textContent = totalProducts;
        
        // 🔍 Debug log untuk memastikan perhitungan benar
        console.log('📊 Statistics updated:', {
            totalPurchases,
            totalSpent,
            totalProducts,
            filteredOrdersCount: filteredOrders.length
        });
    }

    // Fungsi untuk render pesanan
    function renderOrders() {
        // Tampilkan loading state
        loadingOrdersState.style.display = 'block';
        ordersList.style.display = 'none';
        emptyOrdersState.style.display = 'none';

        // Simulasi loading (bisa dihapus jika tidak diperlukan)
        setTimeout(() => {
            loadingOrdersState.style.display = 'none';

            if (filteredOrders.length === 0) {
                emptyOrdersState.style.display = 'block';
                ordersList.style.display = 'none';
                return;
            }

            ordersList.style.display = 'grid';
            ordersList.innerHTML = '';

            // Sort pesanan berdasarkan tanggal terbaru
            const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.date) - new Date(a.date));

            sortedOrders.forEach((order, index) => {
                const orderCard = document.createElement('div');
                orderCard.className = 'order-card';
                orderCard.style.cssText = `
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    border: 1px solid #e0e0e0;
                    transition: all 0.3s ease;
                    cursor: pointer;
                `;

                // 🔧 PERBAIKAN: Gunakan fungsi calculateOrderTotal yang sudah diperbaiki
                const orderTotal = calculateOrderTotal(order);

                // Hitung total item
                const totalItems = order.items ? order.items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0) : 0;

                // Status pesanan (bisa disesuaikan)
                const status = order.status || 'Selesai';
                const statusColor = status === 'Selesai' ? '#4caf50' : '#ff9800';

                orderCard.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                        <div>
                            <h3 style="margin: 0 0 5px 0; color: #1565c0; font-size: 1.2em;">
                                🛒 Pesanan #${String(index + 1).padStart(3, '0')}
                            </h3>
                            <p style="margin: 0; color: #666; font-size: 0.9em;">
                                📅 ${formatDate(order.date)}
                            </p>
                        </div>
                        <div style="text-align: right;">
                            <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8em; font-weight: 600;">
                                ${status}
                            </span>
                        </div>
                    </div>

                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #666;">📦 Total Item:</span>
                            <strong style="color: #1565c0;">${totalItems} item</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #666;">💰 Total Pembayaran:</span>
                            <strong style="color: #4caf50; font-size: 1.1em;">${formatCurrency(orderTotal)}</strong>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #666; font-size: 0.9em;">
                            Klik untuk melihat detail
                        </span>
                        <span style="color: #1565c0; font-weight: 600;">
                            Lihat Detail →
                        </span>
                    </div>
                `;

                // Hover effect
                orderCard.addEventListener('mouseenter', () => {
                    orderCard.style.transform = 'translateY(-2px)';
                    orderCard.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                });

                orderCard.addEventListener('mouseleave', () => {
                    orderCard.style.transform = 'translateY(0)';
                    orderCard.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                });

                // Click event untuk modal
                orderCard.addEventListener('click', () => showOrderDetail(order, index + 1));

                ordersList.appendChild(orderCard);
            });
        }, 500);
    }

    // Fungsi untuk menampilkan detail pesanan di modal
    function showOrderDetail(order, orderNumber) {
        const modalTitle = document.getElementById('modalOrderTitle');
        const modalContent = document.getElementById('orderDetailContent');

        modalTitle.textContent = `Detail Pesanan #${String(orderNumber).padStart(3, '0')}`;

        let itemsHTML = '';
        let orderTotal = 0;

        if (order.items && order.items.length > 0) {
            itemsHTML = '<div style="margin-bottom: 20px;"><h4 style="color: #1565c0; margin-bottom: 15px;">📦 Daftar Produk:</h4>';
            
            order.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                const productName = product ? product.name : `Produk tidak ditemukan (ID: ${item.productId})`;
                const productPrice = product ? product.price : (item.price || 0);
                const itemTotal = productPrice * (item.quantity || 0);
                orderTotal += itemTotal;

                itemsHTML += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px;">
                        <div>
                            <strong style="color: #333;">${productName}</strong><br>
                            <small style="color: #666;">${formatCurrency(productPrice)} × ${item.quantity || 0}</small>
                        </div>
                        <div style="text-align: right;">
                            <strong style="color: #4caf50;">${formatCurrency(itemTotal)}</strong>
                        </div>
                    </div>
                `;
            });
            itemsHTML += '</div>';
        }

        // 🔧 PERBAIKAN: Gunakan fungsi calculateOrderTotal yang konsisten
        const finalTotal = calculateOrderTotal(order);

        modalContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #1565c0; margin-bottom: 10px;">📅 Informasi Pesanan</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                    <p style="margin: 5px 0;"><strong>Tanggal:</strong> ${formatDate(order.date)}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #4caf50; font-weight: 600;">${order.status || 'Selesai'}</span></p>
                    <p style="margin: 5px 0;"><strong>ID Pesanan:</strong> ${order.id || 'N/A'}</p>
                </div>
            </div>

            ${itemsHTML}

            <div style="border-top: 2px solid #e0e0e0; padding-top: 20px; margin-top: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 1.2em;">
                    <strong style="color: #333;">💰 Total Pembayaran:</strong>
                    <strong style="color: #4caf50; font-size: 1.3em;">${formatCurrency(finalTotal)}</strong>
                </div>
            </div>
        `;

        orderDetailModal.style.display = 'block';
    }

    // Event listeners
    orderDateFilter.addEventListener('change', (e) => {
        filterOrdersByDate(e.target.value);
    });

    closeModal.addEventListener('click', () => {
        orderDetailModal.style.display = 'none';
    });

    // Tutup modal ketika klik di luar modal
    orderDetailModal.addEventListener('click', (e) => {
        if (e.target === orderDetailModal) {
            orderDetailModal.style.display = 'none';
        }
    });

    // Fungsi untuk menampilkan notifikasi
    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');
        
        if (notification && notificationMessage) {
            notificationMessage.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.remove('hidden');
            
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 3000);
        }
    }

    // Inisialisasi halaman
    if (userOrders.length === 0) {
        emptyOrdersState.style.display = 'block';
        ordersList.style.display = 'none';
        updateStatistics();
    } else {
        renderOrders();
        updateStatistics();
    }

    // Update cart count di navigation
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountEl.textContent = totalItems;
        }
    };
    
    updateCartCount();
    
    // 🔍 Debug log untuk memastikan data orders tersedia
    console.log('📋 Orders loaded:', {
        totalOrders: orders.length,
        userOrders: userOrders.length,
        currentUser: currentUser.id,
        products: products.length
    });
});