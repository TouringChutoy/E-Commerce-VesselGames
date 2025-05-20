import { checkAuthRedirect } from './utils.js';
checkAuthRedirect();

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ productId, quantity: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
}