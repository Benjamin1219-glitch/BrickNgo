// cart-client.js - renders cart and allows update/remove

async function apiGet(url) {
  const res = await fetch(url, { credentials: 'include' });
  return res.json();
}

async function apiPost(url, data) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), credentials: 'include' });
  return res.json();
}

async function apiPut(url, data) {
  const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), credentials: 'include' });
  return res.json();
}

async function apiDelete(url) {
  const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
  return res.json();
}

async function loadCart() {
  const root = document.getElementById('cartRoot');
  root.innerHTML = '<p>Loading cart...</p>';
  const res = await apiGet('/api/cart');
  if (!res.success) {
    root.innerHTML = '<p>Please <a href="/login">login</a> to view your cart.</p>';
    return;
  }
  const cart = res.cart;
  if (!cart || cart.items.length === 0) {
    root.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('checkoutBtn').style.display = 'none';
    return;
  }
  let html = '';
  let subtotal = 0;
  cart.items.forEach(item => {
    const img = item.product.image || '/images/placeholder.png';
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    html += `<div class="cart-row">
      <img src="${img}" alt="${item.product.name}" width="80">
      <div class="cart-info">
        <h4>${item.product.name}</h4>
        <p>₹${item.price} x ${item.quantity} = ₹${itemTotal}</p>
        <div>
          <button onclick="updateQty('${item.product._id}', ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQty('${item.product._id}', ${item.quantity + 1})">+</button>
          <button onclick="removeItem('${item.product._id}')">Remove</button>
        </div>
      </div>
    </div>`;
  });
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + tax + shipping;
  html += `<div class="cart-summary">
    <p>Subtotal: ₹${subtotal}</p>
    <p>Tax (18%): ₹${tax}</p>
    <p>Shipping: ₹${shipping}</p>
    <h3>Total: ₹${total}</h3>
  </div>`;
  root.innerHTML = html;
  document.getElementById('checkoutBtn').style.display = 'inline-block';
}

async function updateQty(productId, quantity) {
  if (quantity < 1) {
    // remove
    await apiDelete(`/api/cart/remove/${productId}`);
  } else {
    await apiPut('/api/cart/update', { productId, quantity });
  }
  loadCart();
}

async function removeItem(productId) {
  await apiDelete(`/api/cart/remove/${productId}`);
  loadCart();
}

window.updateQty = updateQty;
window.removeItem = removeItem;

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});