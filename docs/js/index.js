import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  const catalogBtn = document.getElementById('catalog-btn');
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutBtn = document.getElementById('logout-btn');

  const { data } = await supabase.auth.getSession();
  const session = data.session;

  const profileLink = document.getElementById('profile-link');

if (session) {
  loginLink.style.display = 'none';
  registerLink.style.display = 'none';
  logoutBtn.style.display = 'inline';
  profileLink.style.display = 'inline';
} else {
  loginLink.style.display = 'inline';
  registerLink.style.display = 'inline';
  logoutBtn.style.display = 'none';
  profileLink.style.display = 'none';
}

  // Mostrar / ocultar elementos según sesión
  if (session) {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    logoutBtn.style.display = 'inline';
  } else {
    loginLink.style.display = 'inline';
    registerLink.style.display = 'inline';
    logoutBtn.style.display = 'none';
  }

  // Botón de catálogo
  catalogBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (session) {
      window.location.href = 'catalog.html';
    } else {
      window.location.href = 'login.html';
    }
  });

  // Botón cerrar sesión
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  });
});
