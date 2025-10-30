// ============================================
// BRICKNGO ADVANCED JAVASCRIPT
// Smart Building Materials Platform
// ============================================

const BRICKNGO = {
  // State management
  state: {
    cart: [],
    theme: 'light',
    language: 'en',
    voiceSearchActive: false,
    fabOpen: false
  },

  // Products Database
  products: {
    'red-bricks': { name: 'Premium Red Bricks', price: 8, unit: 'per brick', image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop' },
    'flyash-bricks': { name: 'Fly Ash Bricks', price: 6, unit: 'per brick', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop' },
    'aac-blocks': { name: 'AAC Blocks', price: 65, unit: 'per block', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop' },
    'kankar-20mm': { name: '20mm Kankar', price: 2800, unit: 'per load', image: 'https://images.unsplash.com/photo-1564424224827-cd24b8915874?w=400&h=300&fit=crop' },
    'river-sand': { name: 'Premium River Sand', price: 1200, unit: 'per tractor', image: 'https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?w=400&h=300&fit=crop' },
    'm-sand': { name: 'M Sand (Manufactured)', price: 1000, unit: 'per tractor', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop' },
    'ultratech-cement': { name: 'UltraTech OPC 53 Grade', price: 380, unit: 'per bag', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop' },
    'tmt-bars': { name: 'TMT Bars Fe 500D', price: 52, unit: 'per kg', image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400&h=300&fit=crop' },
    'kankar-10mm': { name: '10mm Kankar', price: 2600, unit: 'per load', image: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=400&h=300&fit=crop' },
    'hollow-blocks': { name: 'Concrete Hollow Blocks', price: 35, unit: 'per block', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop' },
    'white-cement': { name: 'Birla White Cement', price: 560, unit: 'per bag', image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400&h=300&fit=crop' },
    'binding-wire': { name: 'Binding Wire', price: 48, unit: 'per kg', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=300&fit=crop' }
  },

  // Initialize app
  init() {
    console.log('🚀 BrickNGo Initializing...');
    console.log('📦 Products available:', Object.keys(this.products));
    
    this.loadCart(); // Load cart from localStorage
    console.log('🛒 Cart loaded:', this.state.cart);
    
    this.setupEventListeners();
    this.setupParticles();
    this.startLiveCounter();
    this.setupScrollAnimations();
    this.setupNavbar();
    this.startDeliveryCountdown();
    this.checkPWAInstall();
    this.hideLoader();
    this.setupExitIntent();
    this.setupMagneticButtons();
    
    console.log('✅ BrickNGo initialized successfully!');
  },

  // Hide loading screen
  hideLoader() {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
      }
    }, 1500);
  },

  // Setup event listeners
  setupEventListeners() {
    // Calculator tabs
    document.querySelectorAll('.calc-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // Search tabs
    document.querySelectorAll('.search-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // Dock navigation
    document.querySelectorAll('.dock-item').forEach(item => {
      item.addEventListener('click', (e) => {
        document.querySelectorAll('.dock-item').forEach(i => i.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Product category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Get selected category
        const category = e.currentTarget.getAttribute('data-category');
        
        // Filter products
        this.filterProducts(category);
      });
    });

    // Load more products button
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.showToast('Loading more products...', 'info');
        // Simulate loading more products
        setTimeout(() => {
          this.showToast('More products loaded!', 'success');
        }, 1000);
      });
    }
  },

  // Filter products by category
  filterProducts(category) {
    const products = document.querySelectorAll('.product-card-advanced');
    let visibleCount = 0;
    
    products.forEach(product => {
      const productCategory = product.getAttribute('data-category');
      
      if (category === 'all' || productCategory === category) {
        product.style.display = 'flex';
        // Add fade-in animation
        product.style.animation = 'fadeInUp 0.5s ease forwards';
        visibleCount++;
      } else {
        product.style.display = 'none';
      }
    });

    // Update products count
    const countsText = document.querySelector('.products-count');
    if (countsText) {
      countsText.textContent = `Showing ${visibleCount} of 50+ products`;
    }

    // Show toast notification
    const categoryNames = {
      'all': 'All Products',
      'bricks': 'Bricks',
      'aggregates': 'Aggregates',
      'cement': 'Cement & Sand',
      'steel': 'Steel & TMT'
    };
    
    this.showToast(`Filtered to: ${categoryNames[category]}`, 'info');
  },

  // Quick view product - Navigate to product detail page
  async quickView(productSlug) {
    // Map of product slugs to names for fetching from API
    const productNameMap = {
      'red-bricks': 'Premium Red Bricks',
      'flyash-bricks': 'Fly Ash Bricks',
      'aac-blocks': 'AAC Blocks',
      'kankar-20mm': '20mm Kankar (Aggregate)',
      'river-sand': 'Premium River Sand',
      'm-sand': 'M Sand (Manufactured Sand)',
      'ultratech-cement': 'UltraTech OPC 53 Grade Cement',
      'tmt-bars': 'TMT Bars Fe 500D',
      'kankar-10mm': '10mm Kankar (Aggregate)',
      'hollow-blocks': 'Concrete Hollow Blocks',
      'white-cement': 'Birla White Cement',
      'binding-wire': 'Binding Wire'
    };

    const productName = productNameMap[productSlug];
    
    if (!productName) {
      this.showToast('Product not found', 'error');
      return;
    }

    // Fetch product by name to get ID
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      const product = data.products.find(p => p.name === productName);
      
      if (product) {
        // Navigate to product detail page
        window.location.href = `/product?id=${product._id}`;
      } else {
        this.showToast('Product not found', 'error');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      this.showToast('Error loading product', 'error');
    }
  },

  // Visualize product in 3D
  visualize3D(productId) {
    this.showToast(`Opening 3D view for ${productId}...`, 'info');
    // Here you would open the 3D visualizer
  },

  // Setup canvas particles
  setupParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  },

  // Live order counter
  startLiveCounter() {
    const counter = document.getElementById('liveOrderCounter');
    if (!counter) return;

    let count = parseInt(counter.textContent.replace(/,/g, ''));
    
    setInterval(() => {
      count += Math.floor(Math.random() * 3) + 1;
      counter.textContent = count.toLocaleString();
    }, 5000);
  },

  // Scroll animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.bundle-card, .quick-card, .guide-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
      el.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      observer.observe(el);
    });
  },

  // Navbar scroll effect
  setupNavbar() {
    const nav = document.getElementById('dockNav');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  },

  // Delivery countdown
  startDeliveryCountdown() {
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    if (!hours || !minutes || !seconds) return;

    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 4);

    function updateCountdown() {
      const now = new Date();
      const diff = targetTime - now;

      if (diff <= 0) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const h = Math.floor(diff / 1000 / 60 / 60);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      hours.textContent = String(h).padStart(2, '0');
      minutes.textContent = String(m).padStart(2, '0');
      seconds.textContent = String(s).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  },

  // Theme toggle
  toggleTheme() {
    this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode');
    this.showToast(
      this.state.theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled',
      'success'
    );
  },

  // Language toggle
  toggleLanguage() {
    const languages = ['English', 'हद', 'తలగ'];
    const codes = ['en', 'hi', 'te'];
    const currentIndex = codes.indexOf(this.state.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    
    this.state.language = codes[nextIndex];
    this.showToast(`Language: ${languages[nextIndex]}`, 'info');
  },

  // Voice search
  toggleVoiceSearch() {
    if (!('webkitSpeechRecognition' in window)) {
      this.showToast('Voice search not supported in this browser', 'error');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => {
      this.showToast('Listening...', 'info');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('smartSearch').value = transcript;
      this.showToast(`You said: "${transcript}"`, 'success');
    };

    recognition.onerror = () => {
      this.showToast('Voice search failed', 'error');
    };

    recognition.start();
  },

  // Calculator functions
  calculate(type) {
    if (type === 'bricks') {
      const length = parseFloat(document.getElementById('wallLength').value) || 0;
      const height = parseFloat(document.getElementById('wallHeight').value) || 0;
      const thickness = parseFloat(document.getElementById('wallThickness').value) || 9;

      const area = length * height;
      const bricksPerSqFt = thickness === 4 ? 50 : thickness === 9 ? 100 : 150;
      const totalBricks = Math.ceil(area * bricksPerSqFt);
      const cost = totalBricks * 7;
      const loads = Math.ceil(totalBricks / 2500);
      const space = (totalBricks * 0.01).toFixed(1);

      document.getElementById('bricksQty').textContent = totalBricks.toLocaleString();
      document.getElementById('estimatedCost').textContent = `₹${cost.toLocaleString()}`;
      document.getElementById('deliveryLoads').textContent = `${loads} trip${loads > 1 ? 's' : ''}`;
      document.getElementById('spaceRequired').textContent = `${space} cu.ft`;

      document.getElementById('calcResult').style.display = 'block';
      document.getElementById('calcResult').scrollIntoView({ behavior: 'smooth' });
    }
  },

  // Add to cart - Real implementation
  addToCart(productId) {
    console.log('🛒 Adding to cart:', productId);
    
    // Get product from database
    const product = this.products[productId];
    if (!product) {
      console.error('❌ Product not found:', productId);
      console.log('Available products:', Object.keys(this.products));
      this.showToast('Product not found!', 'error');
      return;
    }

    console.log('✅ Product found:', product);

    // Check if product already exists in cart
    const existingItem = this.state.cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
      console.log('📈 Updated quantity:', existingItem);
      this.showToast(`${product.name} quantity updated!`, 'success');
    } else {
      const cartItem = {
        id: productId,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        quantity: 1
      };
      this.state.cart.push(cartItem);
      console.log('➕ Added new item:', cartItem);
      this.showToast(`${product.name} added to cart!`, 'success');
    }
    
    console.log('🛒 Current cart:', this.state.cart);
    this.updateCartBadge();
    this.saveCart();
    this.showAddToCartPrompt();
  },

  // Show prompt after adding to cart
  showAddToCartPrompt() {
    const existingPrompt = document.getElementById('cart-prompt');
    if (existingPrompt) {
      existingPrompt.remove();
    }

    const prompt = document.createElement('div');
    prompt.id = 'cart-prompt';
    prompt.className = 'cart-prompt-notification';
    prompt.innerHTML = `
      <div class="cart-prompt-content">
        <i class="fas fa-check-circle"></i>
        <span>Item added to cart!</span>
        <button onclick="BRICKNGO.viewCart()" class="btn-view-cart">
          <i class="fas fa-shopping-cart"></i> View Cart
        </button>
        <button onclick="document.getElementById('cart-prompt').remove()" class="btn-continue">
          Continue Shopping
        </button>
      </div>
    `;
    
    document.body.appendChild(prompt);
    
    setTimeout(() => {
      prompt.classList.add('show');
    }, 100);

    setTimeout(() => {
      if (document.getElementById('cart-prompt')) {
        prompt.classList.remove('show');
        setTimeout(() => prompt.remove(), 300);
      }
    }, 5000);
  },

  // View Cart - Toggle sidebar
  viewCart() {
    console.log('👁️ Opening cart. Current items:', this.state.cart);
    const existingCart = document.getElementById('shopping-cart-sidebar');
    if (existingCart) {
      existingCart.classList.add('active');
      console.log('✅ Cart sidebar activated');
    } else {
      this.createCartSidebar();
      console.log('✅ Cart sidebar created');
    }
    this.renderCart();
  },

  // Create cart sidebar
  createCartSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'shopping-cart-sidebar';
    sidebar.className = 'cart-sidebar';
    sidebar.innerHTML = `
      <div class="cart-sidebar-header">
        <h3><i class="fas fa-shopping-cart"></i> Shopping Cart</h3>
        <button onclick="BRICKNGO.closeCart()" class="cart-close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="cart-sidebar-body" id="cart-items-container">
        <!-- Cart items will be rendered here -->
      </div>
      <div class="cart-sidebar-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span id="cart-total-price">₹0</span>
        </div>
        <button onclick="BRICKNGO.proceedToCheckout()" class="btn-checkout">
          <i class="fas fa-lock"></i> Proceed to Checkout
        </button>
        <button onclick="BRICKNGO.closeCart()" class="btn-continue-shopping">
          Continue Shopping
        </button>
      </div>
    `;
    document.body.appendChild(sidebar);
    
    setTimeout(() => sidebar.classList.add('active'), 100);
  },

  // Close cart
  closeCart() {
    const cart = document.getElementById('shopping-cart-sidebar');
    if (cart) {
      cart.classList.remove('active');
    }
  },

  // Render cart items
  renderCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (this.state.cart.length === 0) {
      container.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty</p>
          <button onclick="BRICKNGO.closeCart()" class="btn-primary-advanced">Start Shopping</button>
        </div>
      `;
      document.getElementById('cart-total-price').textContent = '₹0';
      return;
    }

    let cartHTML = '';
    let total = 0;

    this.state.cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      
      cartHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p class="cart-item-price">₹${item.price.toLocaleString()}</p>
            <div class="cart-item-quantity">
              <button onclick="BRICKNGO.updateQuantity('${item.id}', -1)" class="qty-btn">
                <i class="fas fa-minus"></i>
              </button>
              <span>${item.quantity}</span>
              <button onclick="BRICKNGO.updateQuantity('${item.id}', 1)" class="qty-btn">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div class="cart-item-actions">
            <p class="cart-item-total">₹${itemTotal.toLocaleString()}</p>
            <button onclick="BRICKNGO.removeFromCart('${item.id}')" class="btn-remove">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = cartHTML;
    document.getElementById('cart-total-price').textContent = `₹${total.toLocaleString()}`;
  },

  // Update quantity
  updateQuantity(productId, change) {
    const item = this.state.cart.find(i => i.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.renderCart();
        this.updateCartBadge();
        this.saveCart();
      }
    }
  },

  // Remove from cart
  removeFromCart(productId) {
    this.state.cart = this.state.cart.filter(item => item.id !== productId);
    this.renderCart();
    this.updateCartBadge();
    this.saveCart();
    this.showToast('Item removed from cart', 'info');
  },

  // Clear cart
  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.state.cart = [];
      this.renderCart();
      this.updateCartBadge();
      this.saveCart();
      this.showToast('Cart cleared', 'info');
    }
  },

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem('brickngo_cart', JSON.stringify(this.state.cart));
  },

  // Load cart from localStorage
  loadCart() {
    const savedCart = localStorage.getItem('brickngo_cart');
    if (savedCart) {
      this.state.cart = JSON.parse(savedCart);
      this.updateCartBadge();
    }
  },

  addCalculatedToCart() {
    this.showToast('Materials added to cart!', 'success');
    this.updateCartBadge();
  },

  updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      const totalItems = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
  },

  // Proceed to checkout
  proceedToCheckout() {
    if (this.state.cart.length === 0) {
      this.showToast('Your cart is empty!', 'error');
      return;
    }
    
    this.closeCart();
    this.showCheckoutModal();
  },

  // Show checkout modal
  showCheckoutModal() {
    const existingModal = document.getElementById('checkout-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const total = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.className = 'checkout-modal';
    modal.innerHTML = `
      <div class="checkout-modal-content">
        <div class="checkout-header">
          <h2><i class="fas fa-shopping-bag"></i> Checkout</h2>
          <button onclick="BRICKNGO.closeCheckout()" class="modal-close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="checkout-body">
          <div class="checkout-section">
            <h3><i class="fas fa-user"></i> Personal Details</h3>
            <form id="checkout-form">
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" id="checkout-name" required placeholder="Enter your full name">
              </div>
              <div class="form-group">
                <label>Mobile Number *</label>
                <input type="tel" id="checkout-phone" required placeholder="10-digit mobile number" pattern="[0-9]{10}">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" id="checkout-email" placeholder="your@email.com">
              </div>
            </form>
          </div>

          <div class="checkout-section">
            <h3><i class="fas fa-map-marker-alt"></i> Delivery Address</h3>
            <div class="form-group">
              <label>Full Address *</label>
              <textarea id="checkout-address" required placeholder="House/Building No., Street, Area" rows="2"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>City *</label>
                <input type="text" id="checkout-city" required placeholder="City" value="Hyderabad">
              </div>
              <div class="form-group">
                <label>Pincode *</label>
                <input type="text" id="checkout-pincode" required placeholder="500xxx" pattern="[0-9]{6}">
              </div>
            </div>
          </div>

          <div class="checkout-section">
            <h3><i class="fas fa-calendar-alt"></i> Delivery Date</h3>
            <div class="form-group">
              <label>Preferred Delivery Date *</label>
              <input type="date" id="checkout-date" required>
            </div>
            <div class="form-group">
              <label>Special Instructions</label>
              <textarea id="checkout-notes" placeholder="Any special delivery instructions..." rows="2"></textarea>
            </div>
          </div>

          <div class="checkout-section">
            <h3><i class="fas fa-credit-card"></i> Payment Method</h3>
            <div class="payment-options">
              <label class="payment-option">
                <input type="radio" name="payment" value="cod" checked>
                <div class="payment-option-content">
                  <i class="fas fa-money-bill-wave"></i>
                  <span>Cash on Delivery</span>
                </div>
              </label>
              <label class="payment-option">
                <input type="radio" name="payment" value="online">
                <div class="payment-option-content">
                  <i class="fas fa-mobile-alt"></i>
                  <span>UPI / Online Payment</span>
                </div>
              </label>
            </div>
          </div>

          <div class="checkout-section order-summary">
            <h3><i class="fas fa-receipt"></i> Order Summary</h3>
            <div class="summary-items">
              ${this.state.cart.map(item => `
                <div class="summary-item">
                  <span>${item.name} × ${item.quantity}</span>
                  <span>₹${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              `).join('')}
            </div>
            <div class="summary-total">
              <span>Total Amount:</span>
              <span class="total-amount">₹${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="checkout-footer">
          <button onclick="BRICKNGO.closeCheckout()" class="btn-secondary-advanced">
            Cancel
          </button>
          <button onclick="BRICKNGO.placeOrder()" class="btn-primary-advanced">
            <i class="fas fa-check"></i> Place Order
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);
    
    // Set minimum date to today
    const dateInput = document.getElementById('checkout-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  },

  // Close checkout
  closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
  },

  // Place order
  placeOrder() {
    const name = document.getElementById('checkout-name').value;
    const phone = document.getElementById('checkout-phone').value;
    const address = document.getElementById('checkout-address').value;
    const city = document.getElementById('checkout-city').value;
    const pincode = document.getElementById('checkout-pincode').value;
    const date = document.getElementById('checkout-date').value;

    if (!name || !phone || !address || !city || !pincode || !date) {
      this.showToast('Please fill all required fields', 'error');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      this.showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      this.showToast('Please enter a valid 6-digit pincode', 'error');
      return;
    }

    const payment = document.querySelector('input[name="payment"]:checked').value;
    const email = document.getElementById('checkout-email').value;
    const notes = document.getElementById('checkout-notes').value;

    const order = {
      orderId: 'ORD' + Date.now(),
      customer: { name, phone, email, address, city, pincode },
      items: this.state.cart,
      deliveryDate: date,
      notes: notes,
      paymentMethod: payment,
      total: this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('brickngo_orders') || '[]');
    orders.push(order);
    localStorage.setItem('brickngo_orders', JSON.stringify(orders));

    // Clear cart
    this.state.cart = [];
    this.saveCart();
    this.updateCartBadge();

    // Close checkout
    this.closeCheckout();

    // Show success
    this.showOrderSuccess(order);
  },

  // Show order success
  showOrderSuccess(order) {
    const modal = document.createElement('div');
    modal.className = 'order-success-modal active';
    modal.innerHTML = `
      <div class="order-success-content">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Order Placed Successfully!</h2>
        <p class="order-id">Order ID: <strong>${order.orderId}</strong></p>
        <p class="order-message">Thank you for your order! We'll deliver on <strong>${new Date(order.deliveryDate).toLocaleDateString()}</strong></p>
        <div class="order-details-summary">
          <p><i class="fas fa-phone"></i> We'll call you at <strong>${order.customer.phone}</strong></p>
          <p><i class="fas fa-map-marker-alt"></i> Delivery to: ${order.customer.address}, ${order.customer.city}</p>
          <p><i class="fas fa-rupee-sign"></i> Total: <strong>₹${order.total.toLocaleString()}</strong></p>
        </div>
        <div class="order-actions">
          <button onclick="BRICKNGO.trackOrderById('${order.orderId}')" class="btn-primary-advanced">
            <i class="fas fa-truck"></i> Track Order
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-secondary-advanced">
            Continue Shopping
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  // Track order by ID
  trackOrderById(orderId) {
    const orders = JSON.parse(localStorage.getItem('brickngo_orders') || '[]');
    const order = orders.find(o => o.orderId === orderId);
    
    if (order) {
      document.querySelectorAll('.order-success-modal').forEach(m => m.remove());
      document.getElementById('trackingInput').value = orderId;
      this.trackOrder();
    }
  },

  // Download PDF
  downloadPDF() {
    this.showToast('Downloading estimation PDF...', 'info');
    setTimeout(() => {
      this.showToast('PDF downloaded successfully!', 'success');
    }, 2000);
  },

  // 3D Visualizer
  visualize3D() {
    this.showToast('Opening 3D visualizer...', 'info');
  },

  // Track order
  trackOrder() {
    const input = document.getElementById('trackingInput').value;
    if (!input) {
      this.showToast('Please enter order ID or mobile number', 'error');
      return;
    }

    const card = document.getElementById('trackingMapCard');
    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth' });
    this.showToast('Order found! Tracking live...', 'success');
  },

  // Check delivery
  checkDelivery() {
    const postcode = document.getElementById('postcodeInput').value;
    if (!postcode) {
      this.showToast('Please enter your postcode', 'error');
      return;
    }

    const result = document.getElementById('postcodeResult');
    result.style.display = 'block';
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    this.showToast('Checking delivery availability...', 'info');
  },

  // Open calculator
  openCalculator() {
    document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
  },

  // Check postcode
  checkPostcode() {
    this.checkDelivery();
  },

  // Open AR
  openAR() {
    this.showToast('AR Visualizer coming soon!', 'info');
  },

  // Quick reorder
  quickReorder() {
    this.showToast('Reordering your last purchase...', 'success');
  },

  // Customize bundle
  customize(bundle) {
    this.showToast(`Customizing ${bundle} package...`, 'info');
  },

  // Call/Message driver
  callDriver() {
    window.location.href = 'tel:+919618199232';
  },

  messageDriver() {
    this.showToast('Opening chat with driver...', 'info');
  },

  // Quality verification
  verifyQuality() {
    this.showToast('Showing quality certificates...', 'info');
  },

  // Open chat
  openChat() {
    this.showToast('Connecting to support...', 'info');
  },

  // FAB toggle
  toggleFAB() {
    this.state.fabOpen = !this.state.fabOpen;
    const actions = document.getElementById('fabActions');
    actions.classList.toggle('active');
  },

  // Open WhatsApp
  openWhatsApp() {
    window.open('https://wa.me/919618199232', '_blank');
  },

  // Call us
  callUs() {
    window.location.href = 'tel:+919618199232';
  },

  // Open cart
  openCart() {
    const cart = document.getElementById('cartSidebar');
    cart.style.transform = 'translateX(0)';
  },

  // Toast notifications
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Exit intent popup
  setupExitIntent() {
    let exitShown = false;
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitShown) {
        exitShown = true;
        const popup = document.getElementById('exitPopup');
        if (popup) {
          popup.style.display = 'flex';
          popup.style.animation = 'fadeIn 0.3s ease-out';
        }
      }
    });
  },

  closeExitPopup() {
    const popup = document.getElementById('exitPopup');
    if (popup) {
      popup.style.animation = 'fadeOut 0.3s ease-in';
      setTimeout(() => popup.style.display = 'none', 300);
    }
  },

  // PWA install
  checkPWAInstall() {
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const prompt = document.getElementById('pwaPrompt');
      if (prompt) prompt.style.display = 'block';
    });

    window.installPWA = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice) => {
          if (choice.outcome === 'accepted') {
            this.showToast('App installed successfully!', 'success');
          }
          deferredPrompt = null;
        });
      }
    };
  },

  dismissPWA() {
    const prompt = document.getElementById('pwaPrompt');
    if (prompt) prompt.style.display = 'none';
  },

  // Magnetic buttons
  setupMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }
};

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => BRICKNGO.init());
} else {
  BRICKNGO.init();
}

// Expose to window
window.BRICKNGO = BRICKNGO;

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  #toastContainer {
    position: fixed;
    top: 6rem;
    right: 2rem;
    z-index: 10000;
    max-width: 400px;
  }

  .cart-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    background: white;
    box-shadow: -10px 0 30px rgba(0,0,0,0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 1001;
    display: flex;
    flex-direction: column;
  }

  .cart-header {
    padding: 2rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cart-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #64748b;
  }

  .cart-items {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .cart-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .cart-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 0.5rem;
  }

  .cart-item-details {
    flex: 1;
  }

  .cart-item-details h4 {
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .cart-item-price {
    font-size: 1.125rem;
    font-weight: 700;
    color: #667eea;
  }

  .cart-footer {
    padding: 2rem;
    border-top: 1px solid #e2e8f0;
  }

  .cart-total {
    display: flex;
    justify-content: space-between;
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .btn-checkout {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 9999px;
    font-weight: 700;
    cursor: pointer;
  }

  #exitPopup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(10px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  .popup-content {
    background: white;
    padding: 3rem;
    border-radius: 1.5rem;
    text-align: center;
    max-width: 500px;
    position: relative;
  }

  .popup-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .popup-icon {
    font-size: 4rem;
    color: #667eea;
    margin-bottom: 1rem;
  }

  .popup-form {
    margin: 2rem 0;
  }

  .popup-input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .pwa-install-prompt {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    background: white;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 999;
  }

  .pwa-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .btn-install {
    padding: 0.5rem 1rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .btn-dismiss {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;
document.head.appendChild(style);

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    BRICKNGO.init();
    console.log('BrickNGo initialized successfully!');
  });
} else {
  BRICKNGO.init();
  console.log('BrickNGo initialized successfully!');
}
