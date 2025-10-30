// orders-client.js

async function apiGet(url) {
  const res = await fetch(url, { credentials: 'include' });
  return res.json();
}

function renderOrders(orders) {
  const root = document.getElementById('ordersRoot');
  if (!orders || orders.length === 0) {
    root.innerHTML = '<p>No orders found.</p>';
    return;
  }
  let html = '';
  orders.forEach(o => {
    html += `<div class="order-card">
      <h3>Order ${o.orderNumber} - ${o.status}</h3>
      <p>Placed on: ${new Date(o.createdAt).toLocaleString()}</p>
      <div>
        ${o.items.map(i => `<div>${i.name} x ${i.quantity} - ₹${i.subtotal}</div>`).join('')}
      </div>
      <p>Total: ₹${o.total}</p>
    </div>`;
  });
  root.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
  const res = await apiGet('/api/orders/my-orders');
  if (!res.success) {
    document.getElementById('ordersRoot').innerHTML = '<p>Please <a href="/login">login</a> to view orders.</p>';
    return;
  }
  renderOrders(res.orders);
});