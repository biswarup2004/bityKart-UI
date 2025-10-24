const BASE_URL = "https://bitykart-backend-production.up.railway.app";

async function loadProducts() {
    try {
        const response = await fetch(`${BASE_URL}/api/products`); // Added /api
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();

        let trendingList = document.getElementById("trending-products");
        let teaList = document.getElementById("tea-products");
        let coffeeList = document.getElementById("coffee-products");
        let chipsList = document.getElementById("chips-products");
        let coldDrinksList = document.getElementById("colddrinks-products");
        let dryFruitsList = document.getElementById("dryfruits-products");
        let saltList = document.getElementById("salt-products");
        let sugarList = document.getElementById("sugar-products");

        // Clear all lists
        [trendingList, teaList, coffeeList, chipsList, coldDrinksList, dryFruitsList, saltList, sugarList]
            .filter(list => list).forEach(list => list.innerHTML = "");

        console.log("Loaded products:", products);

        // Get first 6 products for trending
        const trendingProducts = products.slice(0, 6);

        // Create product card with dynamic button
        function createProductCard(product) {
            // Check if product is in cart
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let cartItem = cart.find(item => item.id === product.id);
            
            let buttonContent = '';
            if (cartItem && cartItem.quantity > 0) {
                buttonContent = `
                    <div class="quantity-controls">
                        <button class="btn-quantity" onclick="event.stopPropagation(); decrementCart(${product.id})">−</button>
                        <span class="quantity-display">${cartItem.quantity}</span>
                        <button class="btn-quantity" onclick="event.stopPropagation(); incrementCart(${product.id})">+</button>
                    </div>
                `;
            } else {
                buttonContent = `<i class="fas fa-plus"></i> Add to Cart`;
            }
            
            // Use product.imageUrl instead of product.image_url
            return `
            <div class="product-card">
                <img src="${product.imageUrl || product.image_url}" class="product-image" alt="${product.name}">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-bottom-section">
                        <div class="product-price">₹${product.price}</div>
                        <button class="add-to-cart" data-product-id="${product.id}" onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.imageUrl || product.image_url}')">
                            ${buttonContent}
                        </button>
                    </div>
                </div>
            </div>
            `;
        }

        products.forEach((product) => {
            let productCard = createProductCard(product);

            // Normalize category for comparison
            const category = product.category?.toLowerCase().trim();
            
            // Distribute products by category
            if (category === "tea" && teaList) {
                teaList.innerHTML += productCard;
            }
            else if (category === "coffee" && coffeeList) {
                coffeeList.innerHTML += productCard;
            }
            else if (category === "chips" && chipsList) {
                chipsList.innerHTML += productCard;
            }
            else if (category === "cold-drinks" && coldDrinksList) {
                coldDrinksList.innerHTML += productCard;
            }
            else if (category === "dry-fruits" && dryFruitsList) {
                dryFruitsList.innerHTML += productCard;
            }
            else if (category === "salt" && saltList) {
                saltList.innerHTML += productCard;
            }
            else if (category === "sugar" && sugarList) {
                sugarList.innerHTML += productCard;
            }
        });

        // Add trending products
        if (trendingList) {
            trendingProducts.forEach((product) => {
                let productCard = createProductCard(product);
                trendingList.innerHTML += productCard;
            });
        }

        // Update all buttons after loading
        updateAllProductButtons();

    } catch (error) {
        console.error("Error fetching products:", error);
        // You might want to show an error message to the user
        showErrorMessage("Failed to load products. Please try again later.");
    }
}

// Add this helper function for error display
function showErrorMessage(message) {
    // Create or show an error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Make sure you have this function defined
function updateAllProductButtons() {
    // Your implementation to update button states
    console.log("Updating product buttons...");
}