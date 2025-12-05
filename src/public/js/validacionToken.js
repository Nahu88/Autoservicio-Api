export async function validarToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const response = await fetch('/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.status === 200) {
      return data.data; // Retorna los datos del usuario
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}