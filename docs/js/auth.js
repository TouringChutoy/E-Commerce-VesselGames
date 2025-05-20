import { supabase } from './supabase.js';

const formRegister = document.getElementById('register-form');
const formLogin = document.getElementById('login-form');
const googleButton = document.getElementById('google-login');

formRegister?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);
  await supabase.from('profiles').insert([{ id: data.user.id, email }]);
  alert('Registro exitoso. Revisa tu correo.');
});

formLogin?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
  window.location.href = 'catalog.html';
});

googleButton?.addEventListener('click', async () => {
  await supabase.auth.signInWithOAuth({ provider: 'google' });
});