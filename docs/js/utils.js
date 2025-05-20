// js/utils.js
export async function checkAuthRedirect() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location.href = 'login.html';
  }
}