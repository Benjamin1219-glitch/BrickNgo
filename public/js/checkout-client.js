// checkout-client.js

async function postJson(url, data) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), credentials: 'include' });
  return res.json();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const shippingAddress = {
      name: fd.get('name'),
      phone: fd.get('phone'),
      email: fd.get('email'),
      addressLine1: fd.get('addressLine1'),
      city: fd.get('city'),
      state: fd.get('state'),
      pincode: fd.get('pincode')
    };
    const paymentMethod = fd.get('paymentMethod');

    const res = await postJson('/api/orders/create', { shippingAddress, paymentMethod });
    if (!res.success) {
      alert(res.message || 'Could not create order');
      return;
    }

    // If COD, order returned and done
    if (paymentMethod === 'cod') {
      alert('Order placed successfully! Order ID: ' + res.order.orderNumber);
      window.location.href = '/orders';
      return;
    }

    // For online payment, show instructions and order info
    if (res.razorpayOrder) {
      // For now, show order id and instruct to use Razorpay dashboard or integrate front-end SDK
      alert('Order created for online payment. Order ID: ' + res.order._id + '\nRazorpay Order ID: ' + res.razorpayOrder.id + '\nPlease complete payment using Razorpay test flow.');
      // Redirect to orders page for now
      window.location.href = '/orders';
    }
  });
});