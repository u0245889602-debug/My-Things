// Simpele data opslag (mock API + localStorage)
const PRODUCTS = [
  { id: 1, name: "Product A", price: 10.0, image: "img/a.jpg" },
  { id: 2, name: "Product B", price: 20.0, image: "img/b.jpg" },
  { id: 3, name: "Product C", price: 15.5, image: "img/c.jpg" }
];

const CART_KEY = "shopping_cart";

/* =========================
   Producten laden + renderen
========================= */

function loadProducts() {
  return PRODUCTS;
}

function renderProductPage() {
  const products = loadProducts();
  const container = document.querySelector(".product-list");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(p => {
    const el = document.createElement("div");
    el.className = "product-item";

    el.innerHTML = `
      <img src="${p.image}" class="product-image" />
      <h3 class="product-name">${p.name}</h3>
      <p class="product-price">€${p.price.toFixed(2)}</p>
      <button class="add-to-cart-btn" data-id="${p.id}">
        Add to cart
      </button>
    `;

    container.appendChild(el);
  });

  // Event listeners
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    });
  });
}

/* =========================
   Cart functies
========================= */

function loadCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = loadCart();
  const item = cart.find(i => i.id === productId);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = loadCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  const el = document.querySelector(".cart-count");
  if (el) el.textContent = count;
}

/* =========================
   Cart bewerken
========================= */

function updateQuantity(productId, qty) {
  let cart = loadCart();

  cart = cart.map(item =>
    item.id === productId ? { ...item, qty: qty } : item
  ).filter(item => item.qty > 0);

  saveCart(cart);
  renderCart();
}

function removeFromCart(productId) {
  let cart = loadCart();
  cart = cart.filter(item => item.id !== productId);

  saveCart(cart);
  renderCart();
}

/* =========================
   Cart renderen
========================= */

function renderCart() {
  const cart = loadCart();
  const container = document.querySelector(".cart-items");
  if (!container) return;

  container.innerHTML = "";

  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;

    const el = document.createElement("div");
    el.className = "cart-item";

    el.innerHTML = `
      <span class="cart-name">${product.name}</span>
      <span class="cart-price">€${product.price.toFixed(2)}</span>
      <input type="number" class="cart-qty" value="${item.qty}" min="1" data-id="${item.id}" />
      <button class="remove-btn" data-id="${item.id}">X</button>
    `;

    container.appendChild(el);
  });

  // Events
  document.querySelectorAll(".cart-qty").forEach(input => {
    input.addEventListener("change", e => {
      const id = parseInt(e.target.dataset.id);
      const qty = parseInt(e.target.value);
      updateQuantity(id, qty);
    });
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = parseInt(e.target.dataset.id);
      removeFromCart(id);
    });
  });

  calculateTotal();
  updateCartCount();
}

/* =========================
   Total berekenen
========================= */

function calculateTotal() {
  const cart = loadCart();

  const total = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product.price * item.qty);
  }, 0);

  const el = document.querySelector(".total-price");
  if (el) el.textContent = `€${total.toFixed(2)}`;
}

/* =========================
   Checkout redirect
========================= */

function redirectToCheckout() {
  const cart = loadCart();

  if (cart.length === 0) {
    alert("Cart is leeg!");
    return;
  }

  // Simpel voorbeeld
  window.location.href = "/checkout.html";
}

/* =========================
   Init
========================= */

document.addEventListener("DOMContentLoaded", () => {
  renderProductPage();
  renderCart();
  updateCartCount();

  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", redirectToCheckout);
  }
});
