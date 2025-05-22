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
