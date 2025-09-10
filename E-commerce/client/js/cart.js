// Obtener elementos del DOM
const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");

// Use the global cart array from index.js
// const cart = window.cart;


// Función para mostrar el carrito
function displayCart() {
  modalContainer.innerHTML = "";
  modalContainer.style.display = "block";
  modalOverlay.style.display = "block";

  // Modal header
  const modalHeader = document.createElement("div");

  const modalClose = document.createElement("div");
  modalClose.innerText = "❌";
  modalClose.className = "modal-close";
  modalHeader.append(modalClose);

  modalClose.addEventListener("click", () => {
    modalContainer.style.display = "none";
    modalOverlay.style.display = "none";
  });

  const modalTitle = document.createElement("div");
  modalTitle.innerText = "Cart";
  modalTitle.className = "modal-title";
  modalHeader.append(modalTitle);

  modalContainer.append(modalHeader);

  // Modal body
  if (window.cart.length > 0) {
    window.cart.forEach((product) => {
      const modalBody = document.createElement("div");
      modalBody.className = "modal-body";
      modalBody.innerHTML = `
        <div class="product">
          <img class="product-img" src="${product.img}">
          <div class="product-info">
            <h4>${product.productName}</h4>
          </div>
          <div class="quantity">
            <span class="quantity-btn-decrease">-</span>
            <span class="quantity-input">${product.quanty}</span>
            <span class="quantity-btn-increase">+</span>
          </div>
          <div class="price">${product.price * product.quanty} $</div>
          <div class="delete-product">❌</div>
        </div>
      `;
      modalContainer.append(modalBody);

      // Botones de cantidad
      const decrease = modalBody.querySelector(".quantity-btn-decrease");
      decrease.addEventListener("click", () => {
        if (product.quanty !== 1) {
          product.quanty--;
          displayCart();
          displayCartCounter();
        }
      });

      const increase = modalBody.querySelector(".quantity-btn-increase");
      increase.addEventListener("click", () => {
        product.quanty++;
        displayCart();
        displayCartCounter();
      });

      // Eliminar producto
      const deleteProduct = modalBody.querySelector(".delete-product");
      deleteProduct.addEventListener("click", () => {
        deleteCartProduct(product.id);
      });
    });

    // Modal footer
    const total = window.cart.reduce((acc, el) => acc + el.price * el.quanty, 0);
    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalFooter.innerHTML = `
      <div class="total-price">Total: ${total}</div>
    `;
    modalContainer.append(modalFooter);
  } else {
    const modalText = document.createElement("h2");
    modalText.className = "modal-body";
    modalText.innerText = "Your cart is empty";
    modalContainer.append(modalText);
  }
}

// Función para eliminar productos del carrito
function deleteCartProduct(id) {
  const foundId = window.cart.findIndex((element) => element.id === id);
  if (foundId !== -1) {
    window.cart.splice(foundId, 1);
    displayCart();
    displayCartCounter();
  }
}

// Función para actualizar el contador del carrito
function displayCartCounter() {
  const cartLength = window.cart.reduce((acc, el) => acc + el.quanty, 0);
  if (cartLength > 0) {
    cartCounter.style.display = "block";
    cartCounter.innerText = cartLength;
  } else {
    cartCounter.style.display = "none";
  }
}

// Make displayCartCounter globally accessible
window.displayCartCounter = displayCartCounter;

// Also make cart globally accessible for safety
if (typeof window.cart === 'undefined') {
  window.cart = [];
}

// Evento para abrir el carrito
cartBtn.addEventListener("click", displayCart);