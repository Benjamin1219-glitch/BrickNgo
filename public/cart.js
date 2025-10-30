// SIMPLE WORKING CART SYSTEM
console.log('🛒 Cart.js loaded successfully!');

// Cart object - clean and simple
const ShoppingCart = {
  items: [],
  
  // Product database
  products: {
    'red-bricks': { name: 'Premium Red Bricks', price: 8, unit: 'per brick', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400' },
    'flyash-bricks': { name: 'Fly Ash Bricks', price: 6, unit: 'per brick', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400' },
    'aac-blocks': { name: 'AAC Blocks', price: 65, unit: 'per block', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400' },
    'kankar-20mm': { name: '20mm Kankar', price: 2800, unit: 'per load', image: 'https://images.unsplash.com/photo-1564424224827-cd24b8915874?w=400' },
    'river-sand': { name: 'Premium River Sand', price: 1200, unit: 'per tractor', image: 'https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?w=400' },
    'm-sand': { name: 'M Sand', price: 1000, unit: 'per tractor', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
    'ultratech-cement': { name: 'UltraTech Cement', price: 380, unit: 'per bag', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
    'tmt-bars': { name: 'TMT Bars', price: 52, unit: 'per kg', image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400' },
    'kankar-10mm': { name: '10mm Kankar', price: 2600, unit: 'per load', image: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=400' },
    'hollow-blocks': { name: 'Hollow Blocks', price: 35, unit: 'per block', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400' },
    'white-cement': { name: 'White Cement', price: 560, unit: 'per bag', image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400' },
    'binding-wire': { name: 'Binding Wire', price: 48, unit: 'per kg', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400' }
  },
  
  // Add to cart
  add: function(productId) {
    console.log('➕ Adding to cart:', productId);
    
    const product = this.products[productId];
    if (!product) {
      alert('Product not found: ' + productId);
      console.error('❌ Product not found:', productId);
      return;
    }
    
    console.log('✅ Found product:', product);
    
    // Check if already in cart
    const existing = this.items.find(item => item.id === productId);
    if (existing) {
      existing.quantity++;
      console.log('📈 Quantity increased:', existing);
    } else {
      this.items.push({
        id: productId,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        quantity: 1
      });
      console.log('✅ New item added');
    }
    
    console.log('🛒 Cart now has:', this.items);
    this.save();
    this.updateBadge();
    this.showNotification(product.name + ' added to cart!');
  },
  
  // Remove from cart
  remove: function(productId) {
    console.log('🗑️ Removing from cart:', productId);
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
    this.updateBadge();
    this.render();
  },
  
  // Update quantity
  updateQty: function(productId, change) {
    console.log('🔢 Updating quantity:', productId, change);
    const item = this.items.find(i => i.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.remove(productId);
      } else {
        this.save();
        this.render();
      }
    }
  },
  
  // Open cart
  open: function() {
    console.log('👁️ Opening cart');
    let sidebar = document.getElementById('cart-sidebar');
    
    if (!sidebar) {
      console.log('Creating cart sidebar...');
      sidebar = document.createElement('div');
      sidebar.id = 'cart-sidebar';
      sidebar.className = 'cart-sidebar';
      sidebar.innerHTML = `
        <div class="cart-header">
          <h3>Shopping Cart</h3>
          <button onclick="ShoppingCart.close()" class="cart-close">×</button>
        </div>
        <div id="cart-content" class="cart-content"></div>
        <div class="cart-footer">
          <div class="cart-total">Total: <span id="cart-total">₹0</span></div>
          <button onclick="ShoppingCart.checkout()" class="btn-checkout">Checkout</button>
        </div>
      `;
      document.body.appendChild(sidebar);
    }
    
    sidebar.classList.add('active');
    this.render();
  },
  
  // Close cart
  close: function() {
    console.log('❌ Closing cart');
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
      sidebar.classList.remove('active');
    }
  },
  
  // Render cart
  render: function() {
    console.log('🎨 Rendering cart');
    const container = document.getElementById('cart-content');
    if (!container) return;
    
    if (this.items.length === 0) {
      container.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
      document.getElementById('cart-total').textContent = '₹0';
      return;
    }
    
    let html = '';
    let total = 0;
    
    this.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      
      html += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>₹${item.price} ${item.unit}</p>
            <div class="cart-qty">
              <button onclick="ShoppingCart.updateQty('${item.id}', -1)">-</button>
              <span>${item.quantity}</span>
              <button onclick="ShoppingCart.updateQty('${item.id}', 1)">+</button>
            </div>
          </div>
          <div class="cart-item-right">
            <p class="cart-item-total">₹${itemTotal.toLocaleString()}</p>
            <button onclick="ShoppingCart.remove('${item.id}')" class="btn-remove">🗑️</button>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    document.getElementById('cart-total').textContent = '₹' + total.toLocaleString();
  },
  
  // Update badge
  updateBadge: function() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      const total = this.items.reduce((sum, item) => sum + item.quantity, 0);
      badge.textContent = total;
      badge.style.display = total > 0 ? 'block' : 'none';
      console.log('🔢 Badge updated:', total);
    }
  },
  
  // Save to localStorage
  save: function() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    console.log('💾 Cart saved');
  },
  
  // Load from localStorage
  load: function() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.items = JSON.parse(saved);
      console.log('📦 Cart loaded:', this.items);
    } else {
      console.log('📦 No saved cart found');
    }
    this.updateBadge();
  },
  
  // Show notification
  showNotification: function(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },
  
  // Checkout
  checkout: function() {
    if (this.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Checkout feature - Total items: ' + this.items.length);
    console.log('💳 Checkout:', this.items);
  }
};

// Load cart when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing cart...');
  ShoppingCart.load();
  
  // Add CSS for cart
  const style = document.createElement('style');
  style.textContent = `
    .cart-sidebar {
      position: fixed;
      right: -400px;
      top: 0;
      width: 400px;
      height: 100vh;
      background: white;
      box-shadow: -2px 0 10px rgba(0,0,0,0.2);
      transition: right 0.3s;
      z-index: 10000;
      display: flex;
      flex-direction: column;
    }
    .cart-sidebar.active {
      right: 0;
    }
    .cart-header {
      padding: 20px;
      background: #667eea;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cart-header h3 {
      margin: 0;
    }
    .cart-close {
      background: none;
      border: none;
      color: white;
      font-size: 30px;
      cursor: pointer;
      padding: 0;
      width: 40px;
      height: 40px;
    }
    .cart-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }
    .cart-footer {
      padding: 20px;
      border-top: 1px solid #ddd;
    }
    .cart-total {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
    }
    .btn-checkout {
      width: 100%;
      padding: 15px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
    }
    .cart-item {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .cart-item img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
    }
    .cart-item-info {
      flex: 1;
    }
    .cart-item-info h4 {
      margin: 0 0 5px 0;
      font-size: 14px;
    }
    .cart-item-info p {
      margin: 0;
      color: #666;
      font-size: 12px;
    }
    .cart-qty {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-top: 10px;
    }
    .cart-qty button {
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 5px;
      cursor: pointer;
    }
    .cart-item-right {
      text-align: right;
    }
    .cart-item-total {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .btn-remove {
      background: #ff4444;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
    }
    .empty-cart {
      text-align: center;
      padding: 50px 20px;
      color: #999;
    }
    .cart-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10001;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s;
    }
    .cart-notification.show {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
  
  console.log('✅ Cart initialized successfully!');
});
