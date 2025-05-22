// js/protectLogin.js
import { supabase } from './supabase.js';

export async function redirectIfLoggedIn() {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    // Si hay sesión activa, redirigir al catálogo
    window.location.href = 'catalog.html';
  }
}
