import { checkAuthRedirect } from './utils.js';
checkAuthRedirect();

async function loadProducts() {
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) return console.error('Error cargando productos:', error.message);

  const container = document.getElementById('product-list');
  container.innerHTML = '';
  products.forEach(product => {
    container.innerHTML += `
      <div class="product">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Agregar</button>
      </div>
    `;
  });
}
loadProducts();
