
export const token = {
  set: t => localStorage.setItem('token', t),
  get: () => localStorage.getItem('token'),
  remove: () => localStorage.removeItem('token')
};

// Verificación de autenticación
export const auth = {
  verify: async () => {
    const t = token.get();
    if (!t) return redirect();

    try {
      const res = await fetch('http://localhost:3000/auth/verify', {
        headers: { 'Authorization': `Bearer ${t}` }
      });
      if (!res.ok) throw new Error();
      return true;
    } catch {
      token.remove();
      return redirect();
    }
  },
  logout: () => {
    token.remove();
    redirect();
  }
};

// Redirección común
const redirect = () => {
  window.location.href = '../login.html';
  return false;
};