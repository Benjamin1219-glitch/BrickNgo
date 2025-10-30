# Modern BRICKNGO Website Generator
# This script creates all necessary files for the modern redesign

$basePath = "c:\Users\saisr\OneDrive\Desktop\teja\kira\Building_materials\building_materials"

Write-Host "Creating modern CSS file..." -ForegroundColor Green

# Create style.css with modern design system
$css = @"
/* Modern BRICKNGO Design System */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  /* Colors */
  --primary: #2563eb;
  --secondary: #f59e0b;
  --accent: #8b5cf6;
  --bg: #ffffff;
  --text: #0f172a;
  --border: #e2e8f0;
  
  /* Spacing */
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --space-6: 3rem;
  --space-8: 4rem;
  
  /* Typography */
  --font-body: 'Inter', sans-serif;
  --font-heading: 'Space Grotesk', sans-serif;
  
  /* Radius */
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;
  
  /* Shadow */
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
  overflow-x: hidden;
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s;
  padding: 1rem 0;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-lg);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary);
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem 6rem;
  position: relative;
  text-align: center;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-family: var(--font-heading);
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: var(--shadow-lg);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.btn-secondary {
  background: white;
  color: var(--text);
  border: 2px solid var(--border);
}

.btn-secondary:hover {
  border-color: var(--primary);
}

/* Cards */
.card {
  background: white;
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  border: 1px solid var(--border);
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-2xl);
}

/* Product Grid */
.section {
  padding: 6rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  text-align: center;
  margin-bottom: 3rem;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s;
  border: 1px solid var(--border);
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: var(--shadow-2xl);
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.product-content {
  padding: 1.5rem;
}

.product-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Floating Action Buttons */
.floating-buttons {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fab {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: var(--shadow-xl);
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
}

.fab-whatsapp {
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
}

.fab-call {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.fab:hover {
  transform: scale(1.15);
}

/* Forms */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  transition: all 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

/* Footer */
footer {
  background: #f8fafc;
  border-top: 1px solid var(--border);
  padding: 4rem 2rem 2rem;
  margin-top: 6rem;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .bento-grid {
    grid-template-columns: 1fr;
  }
  
  .floating-buttons {
    right: 1rem;
    bottom: 1rem;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease;
}
"@

Set-Content -Path "$basePath\style.css" -Value $css

Write-Host "✓ style.css created" -ForegroundColor Green
Write-Host "Modern redesign files created successfully!" -ForegroundColor Cyan
