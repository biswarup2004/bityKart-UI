// cart.js - Complete Cart Functionality
const BASE_URL = "https://bitykart-backend-production.up.railway.app";

// Add to cart function with quantity controls
function addToCart(id, name, price, imageUrl) {
    try {
        console.log("Adding product to cart", id, name, price, imageUrl);
        
        // Validate inputs
        if (!id || !name || price === undefined || !imageUrl) {
            console.error('Invalid product data:', {id, name, price, imageUrl});
            return;
        }
        
        price = parseFloat(price);
        if (isNaN(price)) {
            console.error('Invalid price:', price);
            return;
        }
        
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let itemIndex = cart.findIndex((item) => item.id === id);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                image_url: imageUrl,
                quantity: 1
            });
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        updateProductButton(id);
        
        showNotification('Product added to cart!');
    } catch (error) {
        console.error('Error in addToCart:', error);
    }
}

// Update product button to show quantity controls
function updateProductButton(productId) {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartItem = cart.find(item => item.id === productId);
        
        // Find all buttons with this product ID
        const buttons = document.querySelectorAll(`.add-to-cart[data-product-id="${productId}"]`);
        
        buttons.forEach(button => {
            if (cartItem && cartItem.quantity > 0) {
                // Show quantity controls
                button.innerHTML = `
                    <div class="quantity-controls">
                        <button class="btn-quantity decrement-btn" data-product-id="${productId}">−</button>
                        <span class="quantity-display">${cartItem.quantity}</span>
                        <button class="btn-quantity increment-btn" data-product-id="${productId}">+</button>
                    </div>
                `;
            } else {
                // Show add to cart button
                button.innerHTML = `<i class="fas fa-plus"></i> Add to Cart`;
            }
        });
    } catch (error) {
        console.error('Error updating product button:', error);
    }
}

// Increment quantity in cart
function incrementCart(productId) {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            updateProductButton(productId);
            
            // Only reload cart if we're on the cart page
            if (document.getElementById("cart-items")) {
                loadCart();
            }
        }
    } catch (error) {
        console.error('Error incrementing cart:', error);
    }
}

// Decrement quantity in cart
function decrementCart(productId) {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity -= 1;
            
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
                showNotification('Item removed from cart!');
            }
            
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            updateProductButton(productId);
            
            // Only reload cart if we're on the cart page
            if (document.getElementById("cart-items")) {
                loadCart();
            }
        }
    } catch (error) {
        console.error('Error decrementing cart:', error);
    }
}

// Load cart page
function loadCart() {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let cartItems = document.getElementById("cart-items");
        let totalAmount = 0;
        
        if (!cartItems) return;
        
        cartItems.innerHTML = "";

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div style="text-align: center; color: white; padding: 2rem;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p style="font-size: 1.2rem; margin: 0;">Your cart is empty</p>
                    <p style="opacity: 0.7; margin-top: 0.5rem;">Add some products to get started!</p>
                </div>
            `;
            const totalAmountElement = document.getElementById("total-amount");
            if (totalAmountElement) totalAmountElement.textContent = '0';
            return;
        }

        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            
            // Format price to 2 decimal places
            const formattedPrice = item.price.toFixed(2);
            const formattedTotal = itemTotal.toFixed(2);
            
            cartItems.innerHTML += `
                <div class="cart-item" data-product-id="${item.id}">
                    <img src="${item.image_url}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
                    <div style="flex: 1; min-width: 0;">
                        <h3 style="margin: 0; font-size: 1rem; line-height: 1.4;">${item.name}</h3>
                        <p style="margin: 0.5rem 0; color: #ccc;">Price: ₹${formattedPrice}</p>
                        <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
                            <button class="btn btn-outline" onclick="changeQuantity(${index}, -1)" style="padding: 0.25rem 0.5rem; min-width: 2rem;">−</button>
                            <span style="font-weight: 600; font-size: 1.1rem; min-width: 2rem; text-align: center;">${item.quantity}</span>
                            <button class="btn btn-outline" onclick="changeQuantity(${index}, 1)" style="padding: 0.25rem 0.5rem; min-width: 2rem;">+</button>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: bold; font-size: 1.2rem;">₹${formattedTotal}</div>
                        <button class="btn" onclick="removeItem(${index})" style="background: #ef4444; color: white; margin-top: 0.5rem; padding: 0.5rem;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        const totalAmountElement = document.getElementById("total-amount");
        if (totalAmountElement) {
            totalAmountElement.textContent = totalAmount.toFixed(2);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Update cart count badge
function updateCartCount() {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartBadge = document.querySelector(".cart-badge");
        
        if (cartBadge) {
            const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
            cartBadge.textContent = totalQuantity;
            cartBadge.style.display = totalQuantity > 0 ? 'flex' : 'none';
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Change quantity from cart page
function changeQuantity(index, change) {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        if (cart[index]) {
            cart[index].quantity += change;
            
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
                showNotification('Item removed from cart!');
            }
            
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            loadCart();
            
            // Update all product buttons
            updateAllProductButtons();
        }
    } catch (error) {
        console.error('Error changing quantity:', error);
    }
}

// Remove item from cart
function removeItem(index) {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const productId = cart[index].id;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        loadCart();
        updateProductButton(productId);
        
        showNotification('Item removed from cart!');
    } catch (error) {
        console.error('Error removing item:', error);
    }
}

// Update all product buttons on the page
function updateAllProductButtons() {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.forEach(item => {
            updateProductButton(item.id);
        });
    } catch (error) {
        console.error('Error updating all product buttons:', error);
    }
}

// Checkout function
function checkout() {
    try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            showNotification('Please sign in to checkout!', 'error');
            if (typeof showModal === 'function') {
                showModal('signin');
            }
            return;
        }
        
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        showNotification('Redirecting to payment gateway...');
        // Add your payment gateway integration here
        
    } catch (error) {
        console.error('Error during checkout:', error);
        showNotification('Checkout failed. Please try again.', 'error');
    }
}

// Clear entire cart
function clearCart() {
    try {
        localStorage.setItem("cart", JSON.stringify([]));
        updateCartCount();
        loadCart();
        updateAllProductButtons();
        showNotification('Cart cleared successfully!');
    } catch (error) {
        console.error('Error clearing cart:', error);
        showNotification('Error clearing cart', 'error');
    }
}

// Get cart total amount
function getCartTotal() {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    } catch (error) {
        console.error('Error getting cart total:', error);
        return 0;
    }
}

// Get cart item count
function getCartItemCount() {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
        console.error('Error getting cart item count:', error);
        return 0;
    }
}

// Notification function
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for animations
function injectNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .cart-badge {
                display: none;
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                font-weight: bold;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize cart system
function initializeCart() {
    // Inject notification styles
    injectNotificationStyles();
    
    // Initialize cart in localStorage if not exists
    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify([]));
    }
    
    // Load cart if on cart page
    if (document.getElementById("cart-items")) {
        loadCart();
    }
    
    // Update cart count
    updateCartCount();
    
    // Update all product buttons
    updateAllProductButtons();
    
    // Add global click handler for quantity buttons (event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.increment-btn')) {
            const productId = parseInt(e.target.closest('.increment-btn').dataset.productId);
            incrementCart(productId);
        }
        if (e.target.closest('.decrement-btn')) {
            const productId = parseInt(e.target.closest('.decrement-btn').dataset.productId);
            decrementCart(productId);
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeCart);

// Export functions for use in other modules (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        updateProductButton,
        incrementCart,
        decrementCart,
        loadCart,
        updateCartCount,
        changeQuantity,
        removeItem,
        updateAllProductButtons,
        checkout,
        clearCart,
        getCartTotal,
        getCartItemCount,
        showNotification,
        initializeCart
    };
}