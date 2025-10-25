const BASE_URL = "https://bitykart-backend-production.up.railway.app";

async function loadProducts() {
    try {
        const response = await fetch(`${BASE_URL}/products`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();

        // Debug: Log the first product to see the actual structure
        console.log("First product structure:", products[0]);
        console.log("All products:", products);

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
            .forEach(list => list && (list.innerHTML = ""));

        // Get first 6 products for trending
        const trendingProducts = products.slice(0, 6);

        // Create product card with dynamic button
        function createProductCard(product) {
            // Debug: Check price property
            console.log(`Product ${product.name} price:`, product.price);
            
            // Handle different possible price property names
            const price = product.price || product.Price || product.PRICE || 0;
            
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
            
            return `
            <div class="product-card">
                <img src="${product.imageUrl || product.image || ''}" class="product-image" alt="${product.name}">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description || ''}</p>
                    <div class="product-bottom-section">
                        <div class="product-price">₹${price}</div>
                        <button class="add-to-cart" data-product-id="${product.id}" onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${price}, '${product.imageUrl || product.image || ''}')">
                            ${buttonContent}
                        </button>
                    </div>
                </div>
            </div>
            `;
        }

        products.forEach((product) => {
            let productCard = createProductCard(product);

            // Distribute products by category - make category names case-insensitive
            const category = (product.category || '').toLowerCase();
            
            if (category.includes("tea") && teaList) {
                teaList.innerHTML += productCard;
            }
            else if (category.includes("coffee") && coffeeList) {
                coffeeList.innerHTML += productCard;
            }
            else if (category.includes("chip") && chipsList) {
                chipsList.innerHTML += productCard;
            }
            else if ((category.includes("cold") || category.includes("drink")) && coldDrinksList) {
                coldDrinksList.innerHTML += productCard;
            }
            else if ((category.includes("dry") || category.includes("fruit")) && dryFruitsList) {
                dryFruitsList.innerHTML += productCard;
            }
            else if (category.includes("salt") && saltList) {
                saltList.innerHTML += productCard;
            }
            else if (category.includes("sugar") && sugarList) {
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
    }
}

// Add this function to debug the product structure
function debugProductStructure() {
    fetch("https://bitykart-backend-production.up.railway.app/products")
        .then(response => response.json())
        .then(products => {
            console.log("Full products array:", products);
            if (products.length > 0) {
                console.log("First product keys:", Object.keys(products[0]));
                console.log("First product values:", Object.values(products[0]));
            }
        })
        .catch(error => console.error("Debug error:", error));
}

// Call this to see what your API actually returns
// debugProductStructure();