const loginForm = document.getElementById('loginForm');
const alertBox = document.getElementById('alert');
const btnLogin = document.getElementById('btnLogin');
const btnAccesoRapido = document.getElementById('btnAccesoRapido');

// Credenciales de prueba para acceso rápido
const CREDENCIALES_TEST = {
    email: 'admin@autoservicio.com',
    password: 'Admin123!'
};

// Botón de acceso rápido 
btnAccesoRapido.addEventListener('click', () => {
    document.getElementById('email').value = CREDENCIALES_TEST.email;
    document.getElementById('password').value = CREDENCIALES_TEST.password;
    showAlert('Credenciales autocompletadas. Presiona "Ingresar"', 'success');
});

function showAlert(message, type = 'error') {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} show`;
    
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 5000);
}

function setLoading(isLoading) {
    btnLogin.disabled = isLoading;
    btnLogin.textContent = isLoading ? 'Cargando...' : 'Ingresar';
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    alertBox.classList.remove('show');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validacion básica
    if (!email || !password) {
        showAlert('Por favor completa todos los campos', 'error');
        return;
    }

    setLoading(true);

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Login exitoso, redirigiendo...', 'success');
            
            if (data.data) {
                localStorage.setItem('token', data.data);
            }

            // Redirigir al dashboard después de un breve delay
            setTimeout(() => {
                window.location.href = '/api/admin/dashboard-view';
            }, 1000);
        } else {

            const errorMessage = data.message || 'Credenciales inválidas';
            
            if (Array.isArray(data.data) && data.data.length > 0) {
                showAlert(data.data.join(', '), 'error');
            } else {
                showAlert(errorMessage, 'error');
            }
            
            setLoading(false);
        }
    } catch (error) {
        console.error('Error en login:', error);
        showAlert('Error de conexión. Por favor intenta nuevamente.', 'error');
        setLoading(false);
    }
});

// Limpiar alertas al escribir
document.getElementById('email').addEventListener('input', () => {
    alertBox.classList.remove('show');
});

document.getElementById('password').addEventListener('input', () => {
    alertBox.classList.remove('show');
});
