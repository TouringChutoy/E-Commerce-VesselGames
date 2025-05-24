// js/cart.js
import { supabase } from './supabase.js';
import { getUser } from './session.js';

document.addEventListener('DOMContentLoaded', async () => {
  const user = await getUser();
  if (!user) {
    alert('Debes iniciar sesión para ver el carrito');
    window.location.href = 'login.html';
    return;
  }

  // Obtener el carrito del usuario
  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (cartError || !cart) {
    console.log("No hay carrito para este usuario.");
    return;
  }

  // Obtener ítems del carrito con JOIN a products
  const { data: items, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      product_id,
      products:product_id (
        name,
        price,
        image_url
      )
    `)
    .eq('cart_id', cart.id);

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

  // Eliminar producto del carrito
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

  // Finalizar compra
  document.querySelector('.comprar').addEventListener('click', async () => {
    if (items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        total: total,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Error al crear orden:', orderError);
      alert('No se pudo crear la orden');
      return;
    }

    // Insertar los productos en order_items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      console.error('Error al insertar order_items:', itemsError);
      alert('No se pudo agregar productos a la orden');
      return;
    }

    // Limpiar carrito
    const { error: deleteError } = await supabase.from('cart_items').delete().eq('cart_id', cart.id);
    if (deleteError) {
      console.error('Error al vaciar carrito:', deleteError);
    }

    alert('¡Gracias por tu compra!');
    location.reload();
  });
});
