// js/login.js
import { supabase } from './supabase.js';

export async function login(event) {
  event.preventDefault();

  // Obtener inputs del formulario (el formulario está en event.target)
  const form = event.target;
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value.trim();

  if (!email || !password) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Login exitoso, redirigir a catálogo
    window.location.href = 'catalog.html';
  } catch (error) {
    alert('Error en el inicio de sesión: ' + error.message);
  }
}

export async function loginConGoogle() {
  try {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  } catch (error) {
    alert('Error con el inicio de sesión Google: ' + error.message);
  }
}
