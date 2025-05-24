import { supabase } from './supabase.js';
import { getUser } from './session.js';

document.addEventListener('DOMContentLoaded', async () => {
  const user = await getUser();
  if (!user) {
    alert('Debes iniciar sesión para ver el carrito');
    window.location.href = 'login.html';
    return;
  }

  // 🔍 1. Buscar el carrito del usuario
  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (cartError || !cart) {
    console.log("No hay carrito para este usuario.");
    return;
  }

  // 🛒 2. Buscar ítems del carrito con JOIN a products
  const { data: items, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      products:product_id (
        name,
        price,
        image_url
      )
    `)
    .eq('cart_id', cart.id); // ✅ usar el id del carrito

  if (error) {
    console.error('Error al cargar carrito:', error);
    return;
  }

  const container = document.querySelector('.carrito-items');
  container.innerHTML = '';

  let total = 0;

  items.forEach(item => {
    const subtotal = item.products.price * item.quantity;
    total += subtotal;

    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <img src="${item.products.image_url}" alt="${item.products.name}" />
      <div class="info">
        <h2>${item.products.name}</h2>
        <p>Cantidad: ${item.quantity}</p>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <button class="remove" data-id="${item.id}">Eliminar</button>
      </div>
    `;
    container.appendChild(div);
  });

  document.querySelector('.resumen span').textContent = `$${total.toFixed(2)}`;

  // 🗑 Eliminar producto del carrito
  container.addEventListener('click', async (e) => {
    if (e.target.classList.contains('remove')) {
      const id = e.target.dataset.id;
      const { error } = await supabase.from('cart_items').delete().eq('id', id);
      if (error) {
        alert('Error al eliminar producto');
      } else {
        location.reload();
      }
    }
  });

  document.querySelector('.comprar').addEventListener('click', () => {
    alert('¡Gracias por tu compra!');
    // Aquí podrías vaciar el carrito desde Supabase si lo deseas
  });
});
