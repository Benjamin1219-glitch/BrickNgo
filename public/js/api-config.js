// API Configuration - Points to Render backend
const API_BASE_URL = 'https://brickngo-backend.onrender.com';

// API helper function
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  return response;
}

// Export for use in other scripts
window.API_BASE_URL = API_BASE_URL;
window.apiCall = apiCall;
