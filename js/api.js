const BASE_URL = "https://bitykart-backend-production.up.railway.app";

async function loadProducts() {
    try {
        const response = await fetch(`${BASE_URL}/products`);
        const products = await response.json();

        let trendingList = document.getElementById("trending-products");
        let teaList = document.getElementById("tea-products");
        let coffeeList = document.getElementById("coffee-products");
        let chipsList = document.getElementById("chips-products");
        let coldDrinksList = document.getElementById("colddrinks-products");
        let dryFruitsList = document.getElementById("dryfruits-products");
        let saltList = document.getElementById("salt-products");
        let sugarList = document.getElementById("sugar-products");

        if (trendingList) trendingList.innerHTML = "";
        if (teaList) teaList.innerHTML = "";
        if (coffeeList) coffeeList.innerHTML = "";
        if (chipsList) chipsList.innerHTML = "";
        if (coldDrinksList) coldDrinksList.innerHTML = "";
        if (dryFruitsList) dryFruitsList.innerHTML = "";
        if (saltList) saltList.innerHTML = "";
        if (sugarList) sugarList.innerHTML = "";

        console.log(products);

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
            
            return `
            <div class="product-card">
                <img src="${product.image_url}" class="product-image" alt="${product.name}">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-bottom-section">
                        <div class="product-price">₹${product.price}</div>
                        <button class="add-to-cart" data-product-id="${product.id}" onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image_url}')">
                            ${buttonContent}
                        </button>
                    </div>
                </div>
            </div>
            `;
        }

        products.forEach((product) => {
            let productCard = createProductCard(product);

            // Distribute products by category
            if (product.category === "Tea" && teaList) {
                teaList.innerHTML += productCard;
            }
            else if (product.category === "coffee" && coffeeList) {
                coffeeList.innerHTML += productCard;
            }
            else if (product.category === "chips" && chipsList) {
                chipsList.innerHTML += productCard;
            }
            else if (product.category === "cold-drinks" && coldDrinksList) {
                coldDrinksList.innerHTML += productCard;
            }
            else if (product.category === "dry-fruits" && dryFruitsList) {
                dryFruitsList.innerHTML += productCard;
            }
            else if (product.category === "salt" && saltList) {
                saltList.innerHTML += productCard;
            }
            else if (product.category === "sugar" && sugarList) {
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
        console.log("fetching Products :", error);
    }
}