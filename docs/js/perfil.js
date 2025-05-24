import { supabase } from './supabase.js';
import { checkAuthRedirect } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthRedirect(); // Redirige si no hay sesión

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error al cargar perfil:', error);
    return;
  }

  // Rellenar campos
  document.getElementById("email").value = data.email;
  document.getElementById("nombre").value = data.name || "";
  document.getElementById("direccion").value = data.address || "";
  document.getElementById("telefono").value = data.phone || "";
});

// Guardar cambios
document.getElementById("perfil-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const telefono = document.getElementById("telefono").value;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('profiles')
    .update({
      name: nombre,
      address: direccion,
      phone: telefono
    })
    .eq('id', user.id);

  if (error) {
    alert("Error al guardar los cambios");
  } else {
    alert("Cambios guardados correctamente.");
  }
});

// Cargar historial de órdenes
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: ordenes, error } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      total,
      order_items (
        quantity,
        price_at_purchase,
        products:product_id (
          name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al cargar historial de órdenes:', error);
    return;
  }

  const contenedor = document.getElementById('ordenes-container');
  contenedor.innerHTML = '';

  if (ordenes.length === 0) {
    contenedor.innerHTML = '<p>No has realizado ninguna compra aún.</p>';
    return;
  }

  ordenes.forEach(orden => {
    const div = document.createElement('div');
    div.className = 'orden';
    div.innerHTML = `
      <h3>Orden #${orden.id} - ${new Date(orden.created_at).toLocaleString()}</h3>
      <ul>
        ${orden.order_items.map(item => `
          <li>${item.quantity} x ${item.products.name} - $${item.price_at_purchase.toFixed(2)}</li>
        `).join('')}
      </ul>
      <p><strong>Total:</strong> $${orden.total.toFixed(2)}</p>
    `;
    contenedor.appendChild(div);
  });
});

