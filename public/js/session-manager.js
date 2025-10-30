/**
 * Session Manager - Handles user authentication state across the application
 * Manages login state, user data, and UI updates
 */

class SessionManager {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.cartCount = 0;
    this.API_URL = window.API_BASE_URL || 'https://brickngo-backend.onrender.com';
  }

  /**
   * Initialize session - Check if user is logged in
   */
  async init() {
    try {
      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add token to headers if available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${this.API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: headers
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          this.user = data.user;
          this.isAuthenticated = true;
          // Store in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(data.user));
          this.updateUI();
          await this.loadCartCount();
          console.log('✅ User session loaded:', this.user.name);
        } else {
          // If API call failed but we have user in localStorage, use it temporarily
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            this.user = JSON.parse(storedUser);
            this.isAuthenticated = true;
            this.updateUI();
            console.log('ℹ️ Using cached user data');
          } else {
            this.user = null;
            this.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            this.updateUI();
          }
        }
      } else {
        // If API call failed but we have user in localStorage, use it temporarily
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          this.user = JSON.parse(storedUser);
          this.isAuthenticated = true;
          this.updateUI();
          console.log('ℹ️ Using cached user data (API unavailable)');
        } else {
          this.user = null;
          this.isAuthenticated = false;
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          this.updateUI();
          console.log('ℹ️ No active session');
        }
      }
    } catch (error) {
      console.error('Session init error:', error);
      // Fallback to localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
          this.isAuthenticated = true;
          this.updateUI();
          console.log('ℹ️ Using cached user data (error recovery)');
        } catch (e) {
          this.isAuthenticated = false;
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          this.updateUI();
        }
      } else {
        this.isAuthenticated = false;
        this.updateUI();
      }
    }
  }

  /**
   * Update UI based on authentication state
   */
  updateUI() {
    if (this.isAuthenticated && this.user) {
      this.showAuthenticatedUI();
    } else {
      this.showGuestUI();
    }
  }

  /**
   * Show UI for logged-in users
   */
  showAuthenticatedUI() {
    // Update dock navigation
    const dockLoginItem = document.querySelector('.dock-item[href="/login"]');
    if (dockLoginItem) {
      dockLoginItem.style.display = 'none';
    }

    // Update dock actions - Replace login button with user menu
    const dockActions = document.querySelector('.dock-actions');
    if (dockActions) {
      // Remove login button
      const loginBtn = dockActions.querySelector('a[href="/login"]');
      if (loginBtn) {
        loginBtn.remove();
      }

      // Check if user menu already exists
      let userMenu = dockActions.querySelector('.user-menu');
      if (!userMenu) {
        // Create user menu
        userMenu = document.createElement('div');
        userMenu.className = 'user-menu dock-btn';
        userMenu.innerHTML = `
          <div class="user-avatar" data-tooltip="${this.user.name}">
            <i class="fas fa-user-circle"></i>
            <span class="user-name">${this.user.name.split(' ')[0]}</span>
          </div>
          <div class="user-dropdown">
            <div class="user-info">
              <strong>${this.user.name}</strong>
              <small>${this.user.email}</small>
            </div>
            <a href="/orders" class="dropdown-item">
              <i class="fas fa-box"></i> My Orders
            </a>
            <a href="/cart" class="dropdown-item">
              <i class="fas fa-shopping-cart"></i> My Cart
            </a>
            ${this.user.role === 'admin' ? '<a href="/admin-dashboard" class="dropdown-item"><i class="fas fa-cog"></i> Admin Dashboard</a>' : ''}
            <div class="dropdown-divider"></div>
            <button onclick="sessionManager.logout()" class="dropdown-item logout-btn">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        `;
        
        // Insert before cart button
        const cartBtn = dockActions.querySelector('.cart-btn');
        dockActions.insertBefore(userMenu, cartBtn);
      }

      // Hide admin button for non-admin users
      if (this.user.role !== 'admin') {
        const adminBtn = dockActions.querySelector('a[href="/admin-dashboard"]');
        if (adminBtn) {
          adminBtn.style.display = 'none';
        }
      }
    }

    // Show welcome message on home page
    this.showWelcomeMessage();
  }

  /**
   * Show UI for guest users
   */
  showGuestUI() {
    // Show login link in dock navigation
    const dockLoginItem = document.querySelector('.dock-item[href="/login"]');
    if (dockLoginItem) {
      dockLoginItem.style.display = 'flex';
    }

    // Remove user menu if exists
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
      userMenu.remove();
    }

    // Ensure login button exists in dock actions
    const dockActions = document.querySelector('.dock-actions');
    if (dockActions) {
      let loginBtn = dockActions.querySelector('a[href="/login"]');
      if (!loginBtn) {
        loginBtn = document.createElement('a');
        loginBtn.href = '/login';
        loginBtn.className = 'dock-btn';
        loginBtn.setAttribute('data-tooltip', 'Login / Signup');
        loginBtn.innerHTML = '<i class="fas fa-user"></i>';
        
        const cartBtn = dockActions.querySelector('.cart-btn');
        dockActions.insertBefore(loginBtn, cartBtn);
      }

      // Hide admin button
      const adminBtn = dockActions.querySelector('a[href="/admin-dashboard"]');
      if (adminBtn) {
        adminBtn.style.display = 'none';
      }
    }

    // Remove welcome message
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
      welcomeMsg.remove();
    }
  }

  /**
   * Show welcome message for logged-in users
   */
  showWelcomeMessage() {
    // Only show on home page
    if (window.location.pathname === '/') {
      const heroContainer = document.querySelector('.hero-container');
      if (heroContainer && !document.querySelector('.welcome-message')) {
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'welcome-message';
        welcomeMsg.innerHTML = `
          <i class="fas fa-hand-wave"></i>
          Welcome back, <strong>${this.user.name.split(' ')[0]}</strong>!
        `;
        heroContainer.insertBefore(welcomeMsg, heroContainer.firstChild);
      }
    }
  }

  /**
   * Load cart count for authenticated user
   */
  async loadCartCount() {
    try {
      const response = await fetch(`${this.API_URL}/api/cart`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        this.cartCount = data.items ? data.items.length : 0;
        this.updateCartBadge();
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  }

  /**
   * Update cart badge count
   */
  updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
      if (this.cartCount > 0) {
        cartBadge.textContent = this.cartCount;
        cartBadge.style.display = 'flex';
      } else {
        cartBadge.style.display = 'none';
      }
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      const response = await fetch(`${this.API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        this.user = null;
        this.isAuthenticated = false;
        this.cartCount = 0;
        
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Show logout message
        this.showNotification('Logged out successfully!', 'success');
        
        // Update UI
        this.updateUI();
        
        // Redirect to home after 1 second
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } catch (error) {
      console.error('Logout error:', error);
      this.showNotification('Error logging out. Please try again.', 'error');
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `session-notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Get current user
   */
  getUser() {
    return this.user;
  }

  /**
   * Get cart count
   */
  getCartCount() {
    return this.cartCount;
  }

  /**
   * Check if user is authenticated
   */
  isLoggedIn() {
    return this.isAuthenticated;
  }

  /**
   * Require authentication - redirect to login if not authenticated
   */
  requireAuth() {
    if (!this.isAuthenticated) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    return true;
  }
}

// Create global session manager instance
const sessionManager = new SessionManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  sessionManager.init();
});
