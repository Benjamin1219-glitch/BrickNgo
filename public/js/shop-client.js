// shop-client.js - binds Add to Cart buttons and search

async function postJson(url, data) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), credentials: 'include' });
  return res.json();
}

async function initShop() {
  // Normalize existing onclick handlers that reference BRICKNGO.addToCart
  document.querySelectorAll('[onclick]').forEach(el => {
    const on = el.getAttribute('onclick');
    if (on && on.includes("BRICKNGO.addToCart(")) {
      // Extract product id inside parentheses and quotes
      const m = on.match(/BRICKNGO\.addToCart\(['\"]?([^'\")]+)['\"]?\)/);
      if (m && m[1]) {
        el.setAttribute('data-add-cart', m[1]);
        // remove original onclick to avoid conflicts
        el.removeAttribute('onclick');
      }
    }
  });

  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = btn.getAttribute('data-add-cart');
      btn.disabled = true;
      btn.textContent = 'Adding...';
      const res = await postJson('/api/cart/add', { productId: id, quantity: 1 });
      if (res.success) {
        alert('Added to cart');
      } else {
        if (res.message) alert(res.message);
        else alert('Failed to add to cart');
      }
      btn.disabled = false;
      btn.textContent = 'Add to Cart';
    });
  });

  const searchForm = document.getElementById('productSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('searchInput').value;
      window.location.href = '/products?search=' + encodeURIComponent(q);
    });
  }
}

document.addEventListener('DOMContentLoaded', initShop);
