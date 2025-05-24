// js/carrito.js
document.addEventListener('DOMContentLoaded', () => {
  const carritoContainer = document.getElementById('carrito-items');
  const totalElement = document.getElementById('total');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
    carritoContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="info">
          <h2>${item.name}</h2>
          <p>Precio: $${item.price.toFixed(2)}</p>
          <p>Cantidad: ${item.quantity}</p>
          <button class="remove" data-index="${index}">Eliminar</button>
        </div>
      `;
      carritoContainer.appendChild(div);
    });

    totalElement.textContent = `$${total.toFixed(2)}`;
  }

  carritoContainer.addEventListener('click', e => {
    if (e.target.classList.contains('remove')) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
  });

  document.getElementById('finalizar-compra').addEventListener('click', () => {
    alert('¡Gracias por tu compra!');
    localStorage.removeItem('cart');
    renderCart();
  });

  renderCart();
});
