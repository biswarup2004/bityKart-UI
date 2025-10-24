// Add to cart function with quantity controls
function addToCart(id, name, price, image_url) {
    console.log("Adding product to cart", id, name, price, image_url);
    price = parseFloat(price);
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let itemIndex = cart.findIndex((item) => item.id === id);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image_url: image_url,
            quantity: 1
        });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateProductButton(id);
    
    if (typeof showNotification === 'function') {
        showNotification('Product added to cart!');
    }
}

// Update product button to show quantity controls
function updateProductButton(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = cart.find(item => item.id === productId);
    
    // Find all buttons with this product ID
    const buttons = document.querySelectorAll(`[data-product-id="${productId}"]`);
    
    buttons.forEach(button => {
        if (cartItem && cartItem.quantity > 0) {
            // Show quantity controls
            button.innerHTML = `
                <div class="quantity-controls">
                    <button class="btn-quantity" onclick="event.stopPropagation(); decrementCart(${productId})">−</button>
                    <span class="quantity-display">${cartItem.quantity}</span>
                    <button class="btn-quantity" onclick="event.stopPropagation(); incrementCart(${productId})">+</button>
                </div>
            `;
        } else {
            // Show add to cart button
            button.innerHTML = `<i class="fas fa-plus"></i> Add to Cart`;
        }
    });
}

// Increment quantity in cart
function incrementCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        updateProductButton(productId);
        loadCart();
    }
}

// Decrement quantity in cart
function decrementCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity -= 1;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
            if (typeof showNotification === 'function') {
                showNotification('Item removed from cart!');
            }
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        updateProductButton(productId);
        loadCart();
    }
}

// Load cart page
function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItems = document.getElementById("cart-items");
    let totalAmount = 0;
    
    if (!cartItems) return;
    
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: white; font-size: 1.2rem;">Your cart is empty</p>';
        const totalAmountElement = document.getElementById("total-amount");
        if (totalAmountElement) totalAmountElement.textContent = '0';
        return;
    }

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image_url}" alt="${item.name}">
                <div style="flex: 1;">
                    <h3>${item.name}</h3>
                    <p>Price: ₹${item.price}</p>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
                        <button class="btn btn-outline" onclick="changeQuantity(${index}, -1)" style="padding: 0.25rem 0.5rem;">−</button>
                        <span style="font-weight: 600; font-size: 1.1rem;">${item.quantity}</span>
                        <button class="btn btn-outline" onclick="changeQuantity(${index}, 1)" style="padding: 0.25rem 0.5rem;">+</button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: bold; font-size: 1.2rem;">₹${itemTotal}</div>
                    <button class="btn" onclick="removeItem(${index})" style="background: #ef4444; color: white; margin-top: 0.5rem; padding: 0.5rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    const totalAmountElement = document.getElementById("total-amount");
    if (totalAmountElement) {
        totalAmountElement.textContent = totalAmount;
    }
}

// Update cart count badge
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartBadge = document.querySelector(".cart-badge");
    
    if (cartBadge) {
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = totalQuantity;
    }
}

// Change quantity from cart page
function changeQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        loadCart();
        
        // Update all product buttons
        updateAllProductButtons();
    }
}

// Remove item from cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productId = cart[index].id;
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    loadCart();
    updateProductButton(productId);
    
    if (typeof showNotification === 'function') {
        showNotification('Item removed from cart!');
    }
}

// Update all product buttons on the page
function updateAllProductButtons() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.forEach(item => {
        updateProductButton(item.id);
    });
}

// Checkout function
function checkout() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        if (typeof showModal === 'function') {
            showModal('signin');
        }
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('Your cart is empty!');
        }
        return;
    }
    
    if (typeof showNotification === 'function') {
        showNotification('Redirecting to payment gateway...');
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    loadCart();
    updateCartCount();
    updateAllProductButtons();
});