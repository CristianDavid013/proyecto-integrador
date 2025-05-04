import { apiFetch } from '../utils/api.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button');
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Iniciando sesión...';

        console.log('Intentando login con:', { 
            email, 
            passwordLength: password.length 
        });

        const response = await apiFetch('/auth/login', 'POST', {
            email,
            password
        });

        console.log('Login exitoso:', response);

        if (response && response.token) {
            localStorage.setItem('token', response.token);
            window.location.href = 'expenses.html';
        }
    } catch (error) {
        console.error('Error completo:', {
            message: error.message,
            stack: error.stack
        });
        alert('Error: ' + error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Iniciar Sesión';
    }
});