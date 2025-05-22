import { supabase } from './supabase.js';

// Controlar visibilidad del menú de sesión en todas las páginas
export async function manageSessionUI(redirectIfNotLoggedIn = false) {
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutBtn = document.getElementById('logout-btn');

  if (session) {
    loginLink?.classList.add('hidden');
    registerLink?.classList.add('hidden');
    logoutBtn?.classList.remove('hidden');
  } else {
    loginLink?.classList.remove('hidden');
    registerLink?.classList.remove('hidden');
    logoutBtn?.classList.add('hidden');

    if (redirectIfNotLoggedIn) {
      window.location.href = 'login.html';
    }
  }

  logoutBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  });
}
