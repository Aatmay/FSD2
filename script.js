/* ============================================
   DOMINO'S PIZZA - JAVASCRIPT INTERACTIVITY
   FIXED VERSION WITH WORKING CART
   ============================================ */

// LocalStorage initialization
let cart = JSON.parse(localStorage.getItem('dominosCart')) || [];
let cartCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🍕 Dominos Pizza - JavaScript Loaded Successfully!');
    console.log('✅ All features initialized');
    
    // Initialize all features
    updateCartDisplay();
    initializeAddToCart();
    initializeLocationDetection();
    initializeDeliveryTabs();
    initializeProductCards();
    initializeScrollToTop();
    initializeCategoryFilter();
    initializeBottomNav();
    initializeCartIcon(); // NEW: Initialize cart icon click
    initializeVisitorCounter();
    loadSavedLocation();
});

// ============================================
// CART ICON CLICK - OPENS CART MODAL
// ============================================
function initializeCartIcon() {
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            showCartModal();
        });
        console.log('✅ Cart icon click initialized');
    }
}

// ============================================
// SHOW CART MODAL
// ============================================
function showCartModal() {
    let cartHTML = '';
    
    if (cart.length === 0) {
        cartHTML = `
            <div style="text-align:center;padding:40px 20px;">
                <i class="fas fa-shopping-cart" style="font-size:60px;color:#ccc;margin-bottom:20px;"></i>
                <h4 style="margin-bottom:15px;color:#333;">Your cart is empty</h4>
                <p style="color:#666;">Add some delicious pizzas to get started!</p>
            </div>
        `;
    } else {
        let total = 0;
        cartHTML = '<h3 style="color:#333;margin-bottom:25px;"><i class="fas fa-shopping-cart me-2"></i>Your Cart (' + cart.length + ' items)</h3>';
        
        cart.forEach((item, index) => {
            const priceNum = parseInt(item.price.replace('₹', ''));
            total += priceNum;
            
            cartHTML += `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:15px;
                    background:#f8f8f8;border-radius:10px;margin-bottom:12px;border:1px solid #e0e0e0;">
                    <div>
                        <h5 style="margin:0 0 5px 0;color:#333;font-size:16px;">${item.name}</h5>
                        <p style="margin:0;color:#666;font-size:14px;">${item.price}</p>
                    </div>
                    <button onclick="removeFromCart(${index})" 
                        style="background:#e31837;color:white;border:none;padding:8px 16px;
                        border-radius:8px;cursor:pointer;font-weight:600;">Remove</button>
                </div>
            `;
        });
        
        cartHTML += `
            <div style="border-top:2px solid #e0e0e0;margin-top:20px;padding-top:20px;">
                <div style="display:flex;justify-content:space-between;font-size:22px;font-weight:700;color:#333;margin-bottom:20px;">
                    <span>Total:</span>
                    <span style="color:#e31837;">₹${total}</span>
                </div>
                <button class="btn-modal-close" style="width:100%;">
                    <i class="fas fa-check-circle me-2"></i>Proceed to Checkout
                </button>
            </div>
        `;
    }
    
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close-btn" onclick="this.closest('.cart-modal').remove()">×</button>
            ${cartHTML}
        </div>
    `;
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
    console.log('🛒 Cart modal opened with', cart.length, 'items');
}

// ============================================
// REMOVE FROM CART
// ============================================
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('dominosCart', JSON.stringify(cart));
    updateCartDisplay();
    
    // Close current modal
    const modals = document.querySelectorAll('.cart-modal');
    modals.forEach(m => m.remove());
    
    showNotification('Item removed from cart');
    
    // Reopen cart if items remain
    if (cart.length > 0) {
        setTimeout(showCartModal, 300);
    }
}

// ============================================
// UPDATE CART DISPLAY
// ============================================
function updateCartDisplay() {
    cartCount = cart.length;
    
    let badge = document.querySelector('.cart-badge');
    const cartIcon = document.getElementById('cartIcon');
    
    if (!badge && cartCount > 0 && cartIcon) {
        badge = document.createElement('span');
        badge.className = 'cart-badge';
        cartIcon.appendChild(badge);
    }
    
    if (badge) {
        badge.textContent = cartCount;
        badge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

// ============================================
// ADD TO CART
// ============================================
function initializeAddToCart() {
    const addButtons = document.querySelectorAll('.btn-add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const card = this.closest('.product-card');
            const name = card.querySelector('.product-name').textContent;
            const price = card.querySelector('.price').textContent;
            
            // Add to cart
            cart.push({ name, price, quantity: 1 });
            localStorage.setItem('dominosCart', JSON.stringify(cart));
            
            // Visual feedback
            this.textContent = 'Added ✓';
            this.style.background = '#28a745';
            
            setTimeout(() => {
                this.textContent = 'Add +';
                this.style.background = '#e31837';
            }, 1500);
            
            updateCartDisplay();
            showNotification(name + ' added to cart!');
        });
    });
    console.log('✅ Add to cart buttons initialized');
}

// ============================================
// LOCATION DETECTION
// ============================================
function initializeLocationDetection() {
    const detectBtn = document.querySelector('.btn-detect');
    if (detectBtn) {
        detectBtn.addEventListener('click', function() {
            this.textContent = 'Detecting...';
            this.disabled = true;
            
            setTimeout(() => {
                const locations = [
                    'Andheri West, Mumbai',
                    'Koramangala, Bangalore',
                    'Connaught Place, Delhi',
                    'Park Street, Kolkata',
                    'Anna Nagar, Chennai'
                ];
                
                const randomLocation = locations[Math.floor(Math.random() * locations.length)];
                const locationSpan = document.querySelector('.location-left span');
                
                locationSpan.textContent = randomLocation;
                locationSpan.classList.remove('text-danger');
                locationSpan.classList.add('text-success');
                
                this.textContent = 'Location Set ✓';
                this.style.background = '#28a745';
                
                localStorage.setItem('userLocation', randomLocation);
                showLocationModal(randomLocation);
            }, 1500);
        });
        console.log('✅ Location detection initialized');
    }
}

function showLocationModal(location) {
    const modal = document.createElement('div');
    modal.className = 'location-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close-btn" onclick="this.closest('.location-modal').remove()">×</button>
            <div style="text-align:center;">
                <i class="fas fa-map-marker-alt" style="font-size:50px;color:#28a745;"></i>
                <h3 style="margin:20px 0;">Location Detected!</h3>
                <p><strong>Delivering to:</strong></p>
                <p style="font-size:20px;color:#e31837;font-weight:700;">${location}</p>
                <p style="color:#666;">Estimated delivery: 30-40 mins</p>
                <button class="btn-modal-close" onclick="this.closest('.location-modal').remove()">
                    Start Ordering
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// ============================================
// DELIVERY TABS
// ============================================
function initializeDeliveryTabs() {
    const tabs = document.querySelectorAll('.tab-option');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => {
                t.classList.remove('active-tab');
                t.querySelector('h5').classList.add('text-muted');
                t.querySelector('p').classList.add('text-muted');
            });
            
            this.classList.add('active-tab');
            this.querySelector('h5').classList.remove('text-muted');
            this.querySelector('p').classList.remove('text-muted');
            
            const type = this.querySelector('h5').textContent;
            const emoji = type === 'Delivery' ? '🛵' : type === 'Takeaway' ? '🏪' : '🍽️';
            showNotification(emoji + ' ' + type + ' Mode Selected');
        });
    });
    console.log('✅ Delivery tabs initialized');
}

// ============================================
// PRODUCT CARDS - CUSTOMIZATION
// ============================================
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-add-to-cart')) {
                return;
            }
            
            const name = this.querySelector('.product-name').textContent;
            const price = this.querySelector('.price').textContent;
            const image = this.querySelector('.product-image img').src;
            
            showCustomizationModal(name, price, image);
        });
    });
    console.log('✅ Product cards initialized');
}

function showCustomizationModal(name, price, image) {
    const modal = document.createElement('div');
    modal.className = 'customization-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close-btn" onclick="this.closest('.customization-modal').remove()">×</button>
            <h3 style="margin-bottom:15px;">${name}</h3>
            <img src="${image}" alt="${name}" style="width:200px;height:200px;object-fit:cover;border-radius:15px;margin:15px 0;">
            <h4 style="color:#e31837;margin:15px 0;">${price}</h4>
            
            <div style="margin:25px 0;text-align:left;">
                <p style="font-weight:700;margin-bottom:10px;">Choose Size:</p>
                <label style="display:block;margin:10px 0;cursor:pointer;">
                    <input type="radio" name="size" value="regular" checked style="margin-right:10px;">
                    Regular - ${price}
                </label>
                <label style="display:block;margin:10px 0;cursor:pointer;">
                    <input type="radio" name="size" value="medium" style="margin-right:10px;">
                    Medium - +₹100
                </label>
                <label style="display:block;margin:10px 0;cursor:pointer;">
                    <input type="radio" name="size" value="large" style="margin-right:10px;">
                    Large - +₹200
                </label>
            </div>
            
            <div style="margin:25px 0;text-align:left;">
                <p style="font-weight:700;margin-bottom:10px;">Choose Crust:</p>
                <label style="display:block;margin:10px 0;cursor:pointer;">
                    <input type="radio" name="crust" value="hand-tossed" checked style="margin-right:10px;">
                    New Hand Tossed
                </label>
                <label style="display:block;margin:10px 0;cursor:pointer;">
                    <input type="radio" name="crust" value="cheese-burst" style="margin-right:10px;">
                    Cheese Burst - +₹120
                </label>
                <label style="display:block;margin:10px 0;cursor:pointer;">
                    <input type="radio" name="crust" value="thin-crust" style="margin-right:10px;">
                    Thin Crust
                </label>
            </div>
            
            <button class="btn-modal-close" onclick="addCustomizedToCart('${name}');this.closest('.customization-modal').remove();">
                Add to Cart
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

function addCustomizedToCart(name) {
    showNotification(name + ' (Customized) added to cart!');
}

// ============================================
// SCROLL TO TOP
// ============================================
function initializeScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    console.log('✅ Scroll to top initialized');
}

// ============================================
// CATEGORY FILTER
// ============================================
function initializeCategoryFilter() {
    const categories = document.querySelectorAll('.category-item');
    categories.forEach(item => {
        item.addEventListener('click', function() {
            categories.forEach(c => c.classList.remove('active-category'));
            this.classList.add('active-category');
            
            const label = this.querySelector('.category-label').textContent;
            showNotification('🔍 Showing: ' + label);
            
            const bestsellers = document.querySelector('.bestsellers');
            if (bestsellers) {
                bestsellers.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    console.log('✅ Category filter initialized');
}

// ============================================
// BOTTOM NAVIGATION
// ============================================
function initializeBottomNav() {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            const text = this.querySelector('span').textContent;
            
            if (text === 'Offers') {
                showOffersModal();
            }
        });
    });
    console.log('✅ Bottom navigation initialized');
}

function showOffersModal() {
    const modal = document.createElement('div');
    modal.className = 'offers-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:800px;">
            <button class="modal-close-btn" onclick="this.closest('.offers-modal').remove()">×</button>
            <h2 style="text-align:center;margin-bottom:30px;">🎉 Special Offers</h2>
            
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;">
                <div style="background:#fff5f6;border:2px solid #e31837;border-radius:15px;padding:25px;text-align:center;">
                    <div style="background:#e31837;color:white;padding:10px 20px;border-radius:25px;display:inline-block;margin-bottom:15px;font-weight:700;">
                        50% OFF
                    </div>
                    <h4 style="margin:15px 0;">Weekend Special</h4>
                    <p style="color:#666;margin:10px 0;">Get 50% off on all pizzas</p>
                    <code style="background:#f0f0f0;color:#e31837;padding:8px 16px;border-radius:8px;font-weight:700;border:2px dashed #e31837;">
                        WEEKEND50
                    </code>
                </div>
                
                <div style="background:#fff5f6;border:2px solid #e31837;border-radius:15px;padding:25px;text-align:center;">
                    <div style="background:#e31837;color:white;padding:10px 20px;border-radius:25px;display:inline-block;margin-bottom:15px;font-weight:700;">
                        BUY 1 GET 1
                    </div>
                    <h4 style="margin:15px 0;">BOGO Deal</h4>
                    <p style="color:#666;margin:10px 0;">Buy 1 Get 1 on Medium Pizzas</p>
                    <code style="background:#f0f0f0;color:#e31837;padding:8px 16px;border-radius:8px;font-weight:700;border:2px dashed #e31837;">
                        BOGO123
                    </code>
                </div>
                
                <div style="background:#fff5f6;border:2px solid #e31837;border-radius:15px;padding:25px;text-align:center;">
                    <div style="background:#e31837;color:white;padding:10px 20px;border-radius:25px;display:inline-block;margin-bottom:15px;font-weight:700;">
                        ₹100 OFF
                    </div>
                    <h4 style="margin:15px 0;">First Order</h4>
                    <p style="color:#666;margin:10px 0;">₹100 off on orders above ₹500</p>
                    <code style="background:#f0f0f0;color:#e31837;padding:8px 16px;border-radius:8px;font-weight:700;border:2px dashed #e31837;">
                        FIRST100
                    </code>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// ============================================
// VISITOR COUNTER
// ============================================
function initializeVisitorCounter() {
    let visitCount = parseInt(localStorage.getItem('dominosVisitCount')) || 0;
    visitCount++;
    localStorage.setItem('dominosVisitCount', visitCount);
    
    console.log('👤 Visit Count:', visitCount);
    
    if (visitCount > 1) {
        setTimeout(() => {
            showNotification('🍕 Welcome back! This is visit #' + visitCount);
        }, 1000);
    }
}

// ============================================
// LOAD SAVED LOCATION
// ============================================
function loadSavedLocation() {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
        const locationSpan = document.querySelector('.location-left span');
        if (locationSpan) {
            locationSpan.textContent = savedLocation;
            locationSpan.classList.remove('text-danger');
            locationSpan.classList.add('text-success');
        }
    }
}

// ============================================
// SHOW NOTIFICATION
// ============================================
function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// ============================================
// CONSOLE CONFIRMATION
// ============================================
console.log('%c✅ ALL FEATURES LOADED SUCCESSFULLY!', 'color: #28a745; font-size: 16px; font-weight: bold;');
console.log('%c📋 Features:', 'color: #0f6cb6; font-size: 14px; font-weight: bold;');
console.log('1. ✓ Button Click (Location, Cart, Add to Cart, Offers)');
console.log('2. ✓ Dynamic Content (Button text & color changes)');
console.log('3. ✓ Show/Hide (Modals, Scroll button)');
console.log('4. ✓ Interactive Navigation (Tabs, Scroll to section)');
console.log('5. ✓ LocalStorage (Cart, Location, Visit count)');
console.log('🛒 Cart items:', cart.length);