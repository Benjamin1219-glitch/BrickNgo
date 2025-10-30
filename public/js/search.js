// ============================================
// BRICKNGO - Advanced Search System
// Text, Voice, and Image Search Implementation
// ============================================

class SearchSystem {
  constructor() {
    this.currentMode = 'text';
    this.products = [];
    this.recognition = null;
    this.isListening = false;
    this.init();
  }

  async init() {
    console.log('🔍 Initializing Search System...');
    
    // Fetch products
    await this.loadProducts();
    
    // Initialize search tabs
    this.initTabs();
    
    // Initialize text search
    this.initTextSearch();
    
    // Initialize voice search
    this.initVoiceSearch();
    
    // Initialize image search
    this.initImageSearch();
    
    console.log('✅ Search System Ready');
  }

  async loadProducts() {
    try {
      const API_URL = window.API_BASE_URL || 'https://brickngo-backend.onrender.com';
      const response = await fetch(`${API_URL}/api/products`, {
        credentials: 'include'
      });
      const data = await response.json();
      this.products = data.products || [];
      console.log(`📦 Loaded ${this.products.length} products`);
    } catch (error) {
      console.error('❌ Error loading products:', error);
      this.showToast('Failed to load products', 'error');
    }
  }

  initTabs() {
    const tabs = document.querySelectorAll('.search-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;
        this.switchMode(mode);
      });
    });
  }

  switchMode(mode) {
    console.log(`🔄 Switching to ${mode} mode`);
    this.currentMode = mode;

    // Update active tab
    document.querySelectorAll('.search-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    // Show/hide containers
    document.getElementById('textSearchContainer').style.display = mode === 'text' ? 'flex' : 'none';
    document.getElementById('voiceSearchContainer').style.display = mode === 'voice' ? 'flex' : 'none';
    document.getElementById('imageSearchContainer').style.display = mode === 'image' ? 'flex' : 'none';

    // Reset search results
    this.hideResults();
  }

  // ============================================
  // TEXT SEARCH
  // ============================================
  initTextSearch() {
    const searchInput = document.getElementById('smartSearch');
    const searchBtn = document.getElementById('searchSubmitBtn');

    // Real-time search as user types
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        this.performTextSearch(query);
      } else if (query.length === 0) {
        this.hideResults();
      }
    });

    // Search on button click
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        this.performTextSearch(query);
      }
    });

    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          this.performTextSearch(query);
        }
      }
    });
  }

  performTextSearch(query) {
    console.log(`🔍 Text search: "${query}"`);
    
    const searchTerms = query.toLowerCase().split(' ');
    const results = this.products.filter(product => {
      const productText = `${product.name} ${product.category} ${product.description}`.toLowerCase();
      return searchTerms.some(term => productText.includes(term));
    });

    this.displayResults(results, query);
  }

  // ============================================
  // VOICE SEARCH
  // ============================================
  initVoiceSearch() {
    const voiceBtn = document.getElementById('voiceSearchBtn');
    
    // Check browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('⚠️ Speech recognition not supported');
      voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i><span>Voice search not supported</span>';
      voiceBtn.disabled = true;
      return;
    }

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    // Voice search button click
    voiceBtn.addEventListener('click', () => {
      if (this.isListening) {
        this.stopListening();
      } else {
        this.startListening();
      }
    });

    // Recognition results
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log(`🎤 Voice recognized: "${transcript}"`);
      
      // Update UI
      document.getElementById('voiceSearchText').textContent = transcript;
      
      // Perform search
      this.performTextSearch(transcript);
      this.stopListening();
      
      // Also update text search input
      document.getElementById('smartSearch').value = transcript;
    };

    // Recognition errors
    this.recognition.onerror = (event) => {
      console.error('❌ Voice recognition error:', event.error);
      this.stopListening();
      
      let message = 'Voice search failed';
      if (event.error === 'not-allowed') {
        message = 'Microphone permission denied';
      } else if (event.error === 'no-speech') {
        message = 'No speech detected';
      }
      
      this.showToast(message, 'error');
    };

    // Recognition end
    this.recognition.onend = () => {
      this.stopListening();
    };
  }

  startListening() {
    if (!this.recognition) return;
    
    this.isListening = true;
    this.recognition.start();
    
    // Update UI
    document.getElementById('voiceSearchBtn').classList.add('listening');
    document.getElementById('voiceSearchText').textContent = 'Listening...';
    document.getElementById('voiceAnimation').style.display = 'flex';
    
    console.log('🎤 Started listening...');
  }

  stopListening() {
    if (!this.recognition) return;
    
    this.isListening = false;
    
    try {
      this.recognition.stop();
    } catch (e) {
      // Already stopped
    }
    
    // Update UI
    document.getElementById('voiceSearchBtn').classList.remove('listening');
    document.getElementById('voiceSearchText').textContent = 'Click to speak';
    document.getElementById('voiceAnimation').style.display = 'none';
    
    console.log('🎤 Stopped listening');
  }

  // ============================================
  // IMAGE SEARCH
  // ============================================
  initImageSearch() {
    const imageBtn = document.getElementById('imageSearchBtn');
    const imageInput = document.getElementById('imageSearchInput');
    const removeBtn = document.getElementById('removeImageBtn');

    // Image button click - trigger file input
    imageBtn.addEventListener('click', () => {
      imageInput.click();
    });

    // Image selected
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.processImage(file);
      }
    });

    // Remove image
    removeBtn.addEventListener('click', () => {
      this.clearImage();
    });
  }

  processImage(file) {
    console.log(`📸 Processing image: ${file.name}`);
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImg = document.getElementById('previewImage');
      previewImg.src = e.target.result;
      document.getElementById('imagePreview').style.display = 'block';
      document.getElementById('imageSearchBtn').style.display = 'none';
      
      // Perform image-based search
      this.performImageSearch(e.target.result, file);
    };
    reader.readAsDataURL(file);
  }

  async performImageSearch(imageData, file) {
    console.log('🔍 Image search started...');
    this.showToast('Analyzing image...', 'info');

    // Simple category-based matching based on filename or color analysis
    // In a real app, you'd use ML/AI image recognition
    const fileName = file.name.toLowerCase();
    
    let matchedProducts = [];
    
    // Try to match based on keywords in filename
    if (fileName.includes('brick')) {
      matchedProducts = this.products.filter(p => p.category === 'Bricks');
    } else if (fileName.includes('sand')) {
      matchedProducts = this.products.filter(p => p.category === 'Sand');
    } else if (fileName.includes('cement')) {
      matchedProducts = this.products.filter(p => p.category === 'Cement');
    } else if (fileName.includes('block')) {
      matchedProducts = this.products.filter(p => p.name.includes('Block'));
    } else {
      // Show all construction materials
      matchedProducts = this.products.slice(0, 6);
    }

    if (matchedProducts.length === 0) {
      matchedProducts = this.products.slice(0, 4);
    }

    this.displayResults(matchedProducts, 'Similar products');
  }

  clearImage() {
    document.getElementById('previewImage').src = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imageSearchBtn').style.display = 'block';
    document.getElementById('imageSearchInput').value = '';
    this.hideResults();
  }

  // ============================================
  // RESULTS DISPLAY
  // ============================================
  displayResults(products, query) {
    const resultsContainer = document.getElementById('searchResults');
    const resultsContent = document.getElementById('searchResultsContent');
    
    if (products.length === 0) {
      resultsContent.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <h3>No results found</h3>
          <p>Try different keywords like "bricks", "cement", or "sand"</p>
        </div>
      `;
      resultsContainer.style.display = 'block';
      return;
    }

    let html = `
      <div class="results-info">
        <strong>${products.length}</strong> results for "${query}"
      </div>
      <div class="results-grid">
    `;

    products.forEach(product => {
      // URL encode the image path to handle spaces in filenames
      // Use 'image' field from database (not 'imageUrl')
      let imageUrl = product.image || product.imageUrl || '/images/placeholder.png';
      if (imageUrl && imageUrl.includes(' ')) {
        // Encode only the filename part, not the entire path
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1];
        const encodedFilename = encodeURIComponent(filename);
        parts[parts.length - 1] = encodedFilename;
        imageUrl = parts.join('/');
      }
      
      html += `
        <div class="result-card" onclick="window.location.href='/product?id=${product._id}'">
          <div class="result-image">
            <img src="${imageUrl}" alt="${product.name}" onerror="this.src='/images/placeholder.png'">
          </div>
          <div class="result-info">
            <h4>${product.name}</h4>
            <p class="result-category">${product.category}</p>
            <p class="result-price">₹${product.price} <span>/ ${product.unit}</span></p>
            <div class="result-actions">
              <button class="btn-view" onclick="event.stopPropagation(); window.location.href='/product?id=${product._id}'">
                <i class="fas fa-eye"></i> View
              </button>
              <button class="btn-add" onclick="event.stopPropagation(); ShoppingCart.add('${product._id}', '${product.name}', ${product.price}, 1)">
                <i class="fas fa-cart-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    resultsContent.innerHTML = html;
    resultsContainer.style.display = 'block';

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  hideResults() {
    document.getElementById('searchResults').style.display = 'none';
  }

  showToast(message, type = 'info') {
    // Use existing toast system if available
    if (typeof BRICKNGO !== 'undefined' && BRICKNGO.showToast) {
      BRICKNGO.showToast(message);
    } else {
      console.log(`📢 ${type.toUpperCase()}: ${message}`);
      alert(message);
    }
  }
}

// Global search function for suggestion chips
function searchProduct(term) {
  const searchInput = document.getElementById('smartSearch');
  searchInput.value = term;
  
  if (window.searchSystem) {
    window.searchSystem.performTextSearch(term);
  }
}

// Initialize search system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.searchSystem = new SearchSystem();
  
  // Close search results button
  const closeBtn = document.getElementById('closeSearchBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.searchSystem.hideResults();
    });
  }
});
