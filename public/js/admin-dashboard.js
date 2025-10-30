// Admin Dashboard JavaScript
const API_BASE = '/api';

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadDashboard();
});

// Check if user is authenticated and is admin
async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      window.location.href = '/login';
      return;
    }
    
    const data = await response.json();
    if (data.user.role !== 'admin') {
      alert('Access denied. Admin only.');
      window.location.href = '/';
      return;
    }
    
    document.getElementById('adminName').textContent = data.user.name;
  } catch (error) {
    console.error('Auth check failed:', error);
    window.location.href = '/login';
  }
}

// Logout
async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      credentials: 'include'
    });
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// Load dashboard data
async function loadDashboard() {
  await Promise.all([
    loadStatistics(),
    loadProducts(),
    loadOrders()
  ]);
}

// Load statistics
async function loadStatistics() {
  try {
    const [productsRes, ordersRes] = await Promise.all([
      fetch(`${API_BASE}/products`, { credentials: 'include' }),
      fetch(`${API_BASE}/orders/admin/all`, { credentials: 'include' })
    ]);
    
    const productsData = await productsRes.json();
    const ordersData = await ordersRes.json();
    
    const products = productsData.products || [];
    const orders = ordersData.orders || [];
    
    // Update statistics
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
    
    const pendingCount = orders.filter(order => order.status === 'pending').length;
    document.getElementById('pendingOrders').textContent = pendingCount;
    
  } catch (error) {
    console.error('Failed to load statistics:', error);
  }
}

// Load products
async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE}/products?limit=100`, {
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error('Failed to load products');
    
    const data = await response.json();
    const products = data.products || [];
    
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = '';
    
    products.forEach(product => {
      const row = `
        <tr>
          <td><img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;"></td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>₹${product.price} ${product.unit}</td>
          <td>${product.stock}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick='editProduct(${JSON.stringify(product).replace(/'/g, "&apos;")})'>
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product._id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
    
  } catch (error) {
    console.error('Failed to load products:', error);
    alert('Failed to load products');
  }
}

// Load orders
async function loadOrders() {
  try {
    const response = await fetch(`${API_BASE}/orders/admin/all?limit=20`, {
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error('Failed to load orders');
    
    const data = await response.json();
    const orders = data.orders || [];
    
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';
    
    orders.forEach(order => {
      const row = `
        <tr>
          <td>${order.orderNumber}</td>
          <td>${order.user?.name || 'N/A'}</td>
          <td>${order.items.length} items</td>
          <td>₹${order.total.toLocaleString()}</td>
          <td><span class="badge badge-${order.status}">${order.status.toUpperCase()}</span></td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${order._id}', '${order.status}')">
              <i class="fas fa-edit"></i> Update
            </button>
          </td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
    
  } catch (error) {
    console.error('Failed to load orders:', error);
    alert('Failed to load orders');
  }
}

// Product Modal Functions
function openAddProductModal() {
  document.getElementById('productModalTitle').textContent = 'Add Product';
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('productModal').classList.add('active');
}

function editProduct(product) {
  document.getElementById('productModalTitle').textContent = 'Edit Product';
  document.getElementById('productId').value = product._id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productDescription').value = product.description;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productUnit').value = product.unit;
  document.getElementById('productStock').value = product.stock;
  document.getElementById('productImage').value = product.image;
  document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
}

// Product Form Submit
document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const productId = document.getElementById('productId').value;
  const productData = {
    name: document.getElementById('productName').value,
    description: document.getElementById('productDescription').value,
    category: document.getElementById('productCategory').value,
    price: parseFloat(document.getElementById('productPrice').value),
    unit: document.getElementById('productUnit').value,
    stock: parseInt(document.getElementById('productStock').value),
    image: document.getElementById('productImage').value
  };
  
  try {
    const url = productId ? `${API_BASE}/products/${productId}` : `${API_BASE}/products`;
    const method = productId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save product');
    }
    
    alert(productId ? 'Product updated successfully!' : 'Product added successfully!');
    closeProductModal();
    loadProducts();
    loadStatistics();
    
  } catch (error) {
    console.error('Failed to save product:', error);
    alert(error.message || 'Failed to save product');
  }
});

// Delete product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    const response = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error('Failed to delete product');
    
    alert('Product deleted successfully!');
    loadProducts();
    loadStatistics();
    
  } catch (error) {
    console.error('Failed to delete product:', error);
    alert('Failed to delete product');
  }
}

// Order Modal Functions
function updateOrderStatus(orderId, currentStatus) {
  document.getElementById('orderId').value = orderId;
  document.getElementById('orderStatus').value = currentStatus;
  document.getElementById('orderNote').value = '';
  document.getElementById('orderModal').classList.add('active');
}

function closeOrderModal() {
  document.getElementById('orderModal').classList.remove('active');
}

// Order Form Submit
document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const orderId = document.getElementById('orderId').value;
  const status = document.getElementById('orderStatus').value;
  const note = document.getElementById('orderNote').value;
  
  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status, note })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update order status');
    }
    
    alert('Order status updated successfully!');
    closeOrderModal();
    loadOrders();
    loadStatistics();
    
  } catch (error) {
    console.error('Failed to update order status:', error);
    alert(error.message || 'Failed to update order status');
  }
});
