import { supabase } from './supabase.js';
import { getUser } from './session.js';

document.addEventListener('DOMContentLoaded', async () => {
  const user = await getUser();
  if (!user) {
    alert('Debes iniciar sesión para ver el carrito');
    window.location.href = 'login.html';
    return;
  }

  // Buscar carrito del usuario
  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (cartError || !cart) {
    console.log("No hay carrito para este usuario.");
    return;
  }

  // Función para actualizar la cantidad
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // Si la cantidad es menor a 1, eliminamos el item
      const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
      if (error) {
        console.error('Error al eliminar:', error);
        return false;
      }
      return true;
    } else {
      // Actualizamos la cantidad
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);
      
      if (error) {
        console.error('Error al actualizar:', error);
        return false;
      }
      return true;
    }
  };

  // Función para renderizar el carrito
  const renderCart = async () => {
    const { data: items, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
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

    if (items.length === 0) {
      container.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
      document.querySelector('.resumen span').textContent = '$0.00';
      return;
    }

    items.forEach(item => {
      const subtotal = item.products.price * item.quantity;
      total += subtotal;

      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `
        <img src="${item.products.image_url}" alt="${item.products.name}" />
        <div class="info">
          <h2>${item.products.name}</h2>
          <div class="quantity-control">
            <button class="decrease" data-id="${item.id}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="increase" data-id="${item.id}">+</button>
          </div>
          <p>Precio unitario: $${item.products.price.toFixed(2)}</p>
          <p>Subtotal: $${subtotal.toFixed(2)}</p>
        </div>
      `;
      container.appendChild(div);
    });

    document.querySelector('.resumen span').textContent = `$${total.toFixed(2)}`;
  };

  // Renderizar carrito inicial
  await renderCart();

  // Manejar eventos de incremento/decremento
  document.querySelector('.carrito-items').addEventListener('click', async (e) => {
    const itemId = e.target.dataset.id;
    
    if (e.target.classList.contains('increase')) {
      const { data: item } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('id', itemId)
        .single();

      if (item) {
        const success = await updateQuantity(itemId, item.quantity + 1);
        if (success) await renderCart();
      }
    }
    else if (e.target.classList.contains('decrease')) {
      const { data: item } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('id', itemId)
        .single();

      if (item) {
        const success = await updateQuantity(itemId, item.quantity - 1);
        if (success) await renderCart();
      }
    }
  });

  // Finalizar compra (mantenemos la misma lógica)
  document.querySelector('.comprar').addEventListener('click', async () => {
    const { data: items } = await supabase
      .from('cart_items')
      .select(`
        product_id,
        quantity,
        products:product_id (price)
      `)
      .eq('cart_id', cart.id);

    if (!items || items.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    const total = items.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);

    // Crear orden
    const { data: order, error: orderError } = await supabase.from('orders').insert([{
      user_id: user.id,
      total: total,
      created_at: new Date().toISOString()
    }]).select().single();

    if (orderError || !order) {
      console.error(orderError);
      alert("No se pudo crear la orden");
      return;
    }

    // Insertar productos en order_items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.products.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      console.error(itemsError);
      alert("No se pudo agregar productos a la orden");
      return;
    }

    // Vaciar carrito
    const { error: clearError } = await supabase.from('cart_items').delete().eq('cart_id', cart.id);
    if (clearError) {
      console.error(clearError);
    }

    alert('¡Gracias por tu compra!');
    location.reload();
  });
});