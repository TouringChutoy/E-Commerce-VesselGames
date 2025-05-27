import { supabase } from './supabase.js';

const formRegister = document.getElementById('register-form');
const googleBtn = document.getElementById('google-login');

formRegister?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!name || !email || !password) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Insertar datos adicionales en profiles
    await supabase.from('profiles').insert([{ id: data.user.id, email, name }]);

    alert('Registro exitoso. Revisa tu correo para confirmar la cuenta.');
    window.location.href = 'login.html';
  } catch (error) {
    alert('Error en el registro: ' + error.message);
  }
});
