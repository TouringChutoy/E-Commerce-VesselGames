// js/catalog.js
import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  const { data: productos, error } = await supabase
    .from('products')
    .select('*');

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
    `;
    container.appendChild(card);
  });
});
