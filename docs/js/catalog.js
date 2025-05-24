import { supabase } from './supabase.js';
import { getUser } from './session.js';

document.addEventListener('DOMContentLoaded', async () => {
  const { data: productos, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Error al obtener productos:', error);
    return;
  }

  const container = document.getElementById('productos-container');
  container.innerHTML = '';

  productos.forEach(producto => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${producto.image_url}" alt="${producto.name}" />
      <h3>${producto.name}</h3>
      <p>${producto.description}</p>
      <p><strong>Precio:</strong> $${producto.price}</p>
      <button class="btn add-to-cart" data-id="${producto.id}">Agregar al carrito</button>
    `;
    container.appendChild(card);
  });

  container.addEventListener('click', async (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      const productId = parseInt(e.target.dataset.id);
      const user = await getUser();

      if (!user) {
        alert("Debes iniciar sesión para agregar productos al carrito.");
        return;
      }

      // 1. Buscar si ya existe un carrito para este usuario
      let { data: cart, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // 2. Si no hay, lo creamos
      if (!cart) {
        const { data: newCart, error: insertCartError } = await supabase
          .from('carts')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertCartError) {
          console.error("Error al crear carrito:", insertCartError);
          alert("No se pudo crear el carrito.");
          return;
        }

        cart = newCart;
      }

      // 3. Verificar si el producto ya está en el carrito
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        // Ya existe: aumentar cantidad
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error("Error al actualizar cantidad:", updateError);
          alert("No se pudo actualizar la cantidad.");
        } else {
          alert("Producto actualizado en el carrito");
        }
      } else {
        // No existe: insertar nuevo
        const { error: insertItemError } = await supabase.from('cart_items').insert([
          {
            cart_id: cart.id,
            product_id: productId,
            quantity: 1,
            added_at: new Date().toISOString()
          }
        ]);

        if (insertItemError) {
          console.error("Error al agregar al carrito:", insertItemError);
          alert("Error al agregar el producto al carrito.");
        } else {
          alert("Producto agregado al carrito");
        }
      }
    }
  });
});
