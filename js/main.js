// Global variables
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let currentSlideIndex = 0;
const totalSlides = 3;

// Carousel functionality
function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function currentSlide(slideIndex) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    currentSlideIndex = slideIndex - 1;
    
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function startCarouselAutoPlay() {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// Page navigation
function showPage(pageId) {
    if (pageId === 'home') {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        showAllSections();
    }
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        if (pageId === 'cart') {
            loadCart();
        }
    }
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId + '-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId + '-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// User dropdown functionality
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    const profileDropdown = document.querySelector('.user-profile-dropdown');
    
    if (dropdown && profileDropdown) {
        dropdown.classList.toggle('active');
        profileDropdown.classList.toggle('active');
    }
}

// Authentication functions
function setupAuthForms() {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            
            if (email && password) {
                const user = {
                    email: email,
                    name: email.split('@')[0]
                };
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                updateAuthUI();
                closeModal('signin');
                showNotification(`Welcome back, ${user.name}!`);
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            
            if (name && email && password) {
                const user = {
                    email: email,
                    name: name
                };
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                updateAuthUI();
                closeModal('signup');
                showNotification(`Welcome to BityKart, ${user.name}!`);
            }
        });
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    updateAuthUI();
    updateCartCount();
    loadCart();
    updateAllProductButtons();
    showNotification('Logged out successfully!');
    
    const currentPage = document.querySelector('.page.active');
    if (currentPage && (currentPage.id === 'profile' || currentPage.id === 'orders')) {
        showPage('home');
    }
}

function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    
    if (currentUser) {
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userName) userName.textContent = currentUser.name;
        updateProfileInfo(currentUser);
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

function updateProfileInfo(user) {
    const profileDisplayName = document.getElementById('profile-display-name');
    const profileDisplayEmail = document.getElementById('profile-display-email');
    const detailName = document.getElementById('detail-name');
    const detailEmail = document.getElementById('detail-email');
    
    if (profileDisplayName) profileDisplayName.textContent = user.name;
    if (profileDisplayEmail) profileDisplayEmail.textContent = user.email;
    if (detailName) detailName.textContent = user.name;
    if (detailEmail) detailEmail.textContent = user.email;
    
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    
    if (profileName) profileName.textContent = user.name;
    if (profileEmail) profileEmail.textContent = user.email;
}

function showSettings() {
    showNotification('Settings functionality coming soon!');
    toggleUserDropdown();
}

function editProfile() {
    showNotification('Edit profile functionality coming soon!');
}

// Search functionality
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        showAllSections();
        return;
    }
    
    hideAllSections();
    showSearchResults(searchTerm);
}

function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    const carousel = document.getElementById('heroCarousel');
    if (carousel) {
        carousel.style.display = 'none';
    }
    
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.display = 'none';
    }
}

function showAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'block';
    });
    
    const carousel = document.getElementById('heroCarousel');
    if (carousel) {
        carousel.style.display = 'block';
    }
    
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.display = 'block';
    }
    
    const searchResults = document.getElementById('search-results-section');
    if (searchResults) {
        searchResults.remove();
    }
}

function showSearchResults(searchTerm) {
    const existingResults = document.getElementById('search-results-section');
    if (existingResults) {
        existingResults.remove();
    }

    const allProducts = document.querySelectorAll('.product-card');
    const matchedProducts = [];

    allProducts.forEach(card => {
        const title = card.querySelector('.product-title');
        const description = card.querySelector('.product-description');

        if (title && description) {
            const titleText = title.textContent.toLowerCase();
            const descText = description.textContent.toLowerCase();

            if (titleText.includes(searchTerm) || descText.includes(searchTerm)) {
                let category = 'Trending';
                const parent = card.closest('[id*="products"]');
                if (parent) {
                    if (parent.id.includes('tea')) category = 'Tea';
                    else if (parent.id.includes('coffee')) category = 'Coffee';
                    else if (parent.id.includes('chips')) category = 'Chips & Snacks';
                    else if (parent.id.includes('colddrinks')) category = 'Cold Drinks';
                    else if (parent.id.includes('dryfruits')) category = 'Dry Fruits';
                    else if (parent.id.includes('salt')) category = 'Salt';
                    else if (parent.id.includes('sugar')) category = 'Sugar';
                }

                matchedProducts.push({
                    element: card.cloneNode(true),
                    category: category
                });
            }
        }
    });

    const searchSection = document.createElement('section');
    searchSection.className = 'section';
    searchSection.id = 'search-results-section';

    const container = document.createElement('div');
    container.className = 'container';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = `Search Results for "${searchTerm}" (${matchedProducts.length} found)`;

    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'search-results-grid';
    resultsGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
        justify-items: center;
    `;

    matchedProducts.forEach(product => {
        const productWrapper = document.createElement('div');
        productWrapper.style.cssText = `
            width: 100%;
            max-width: 380px;
        `;

        const categoryLabel = document.createElement('div');
        categoryLabel.textContent = product.category;
        categoryLabel.style.cssText = `
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            text-align: center;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
        `;

        const clonedCard = product.element.cloneNode(true);
        clonedCard.style.cssText = `width: 100%;`;

        productWrapper.appendChild(categoryLabel);
        productWrapper.appendChild(clonedCard);
        resultsGrid.appendChild(productWrapper);
    });

    if (matchedProducts.length === 0) {
        resultsGrid.innerHTML = '<p style="text-align: center; color: white; font-size: 1.2rem; grid-column: 1 / -1;">No products found matching your search.</p>';
    }

    container.appendChild(title);
    container.appendChild(resultsGrid);
    searchSection.appendChild(container);

    const homePage = document.getElementById('home');
    if (homePage) {
        homePage.insertBefore(searchSection, homePage.firstChild);
    }
    
    // Update buttons in search results
    updateAllProductButtons();
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 3000;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('user-dropdown');
    const profileDropdown = document.querySelector('.user-profile-dropdown');
    
    if (dropdown && profileDropdown && !profileDropdown.contains(e.target)) {
        dropdown.classList.remove('active');
        profileDropdown.classList.remove('active');
    }
    
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupAuthForms();
    updateAuthUI();
    updateCartCount();
    
    startCarouselAutoPlay();
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
        
        searchInput.addEventListener('input', function(e) {
            if (e.target.value.trim() === '') {
                showAllSections();
            }
        });
    }
});