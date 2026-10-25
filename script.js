// Sample Mock Products Data
const products = [
    {
        id: 1,
        title: "Wireless ANC Headphones",
        category: "Electronics",
        price: 2999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        title: "Cyberpunk Edition Smartwatch",
        category: "Electronics",
        price: 4499,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        title: "Classic Denim Jacket",
        category: "Fashion",
        price: 1899,
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        title: "Pro Running Shoes",
        category: "Footwear",
        price: 3299,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        title: "Urban Minimalist Backpack",
        category: "Accessories",
        price: 1499,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        title: "RGB Mechanical Keyboard",
        category: "Electronics",
        price: 3999,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80"
    }
];

// Cart State (Stored in LocalStorage)
let cart = JSON.parse(localStorage.getItem("mall_bazar_cart")) || [];

// DOM Elements
const productsGrid = document.getElementById("productsGrid");
const categoryContainer = document.getElementById("categoryContainer");
const searchInput = document.getElementById("searchInput");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotal = document.getElementById("cartTotal");
const cartBadge = document.getElementById("cartBadge");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast = document.getElementById("toast");

// Render Products Grid
function renderProducts(items) {
    productsGrid.innerHTML = "";
    if (items.length === 0) {
        productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No products found matching your search.</p>`;
        return;
    }

    items.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Filter Products by Category
categoryContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("cat-btn")) {
        document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");

        const category = e.target.getAttribute("data-category");
        if (category === "All") {
            renderProducts(products);
        } else {
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
        }
    }
});

// Live Search Filter
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = products.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
    );
    renderProducts(filtered);
});

// Add Product to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveAndUpdateCart();
    showToast(`${product.title} added to cart!`);
}

// Remove Item from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveAndUpdateCart();
}

// Save Cart to LocalStorage & Render UI
function saveAndUpdateCart() {
    localStorage.setItem("mall_bazar_cart", JSON.stringify(cart));
    updateCartUI();
}

// Update Cart UI Elements
function updateCartUI() {
    // Badge Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;

    // Cart Items List
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 2rem;">Your cart is empty.</p>`;
        cartTotal.textContent = "₹0";
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.image}" class="cart-item-img" alt="${item.title}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">₹${item.price} x ${item.quantity}</div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
}

// Toast Notification Popup
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Toggle Cart Drawer
function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("active");
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("active");
}

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Checkout Action
checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Thank you for your order! Order placed successfully.");
    cart = [];
    saveAndUpdateCart();
    closeCart();
});

// Initial Render on Load
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    updateCartUI();
});