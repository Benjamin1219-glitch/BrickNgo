// auth.js - handles signup & login

const API_URL = window.API_BASE_URL || 'https://brickngo-backend.onrender.com';

async function postJson(url, data) {
  const res = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  return res.json();
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = new FormData(loginForm);
      const email = form.get('email');
      const password = form.get('password');
      const res = await postJson('/api/auth/login', { email, password });
      if (res.success) {
        window.location.href = '/';
      } else {
        alert(res.message || 'Login failed');
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = new FormData(signupForm);
      const name = form.get('name');
      const email = form.get('email');
      const phone = form.get('phone');
      const password = form.get('password');
      const res = await postJson('/api/auth/signup', { name, email, phone, password });
      if (res.success) {
        window.location.href = '/';
      } else {
        alert(res.message || 'Signup failed');
      }
    });
  }
});