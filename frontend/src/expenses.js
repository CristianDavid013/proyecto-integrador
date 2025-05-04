import { apiFetch } from './utils/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        console.log('Token encontrado, iniciando app');
        await initializeApp();
    } catch (error) {
        console.error('Error en inicialización:', error);
        if (error.message.includes('Token')) {
            window.location.href = 'login.html';
        }
    }
});

async function initializeApp() {
    try {
        await loadCategories();
        await loadExpenses();
        setupEventListeners();
    } catch (error) {
        console.error("Error al inicializar la aplicación:", error);
    }
}

async function loadCategories() {
    try {
        const categories = await apiFetch('/categories');
        const categorySelect = document.getElementById('expenseCategory');
        categorySelect.innerHTML = '<option value="">Seleccionar Categoría</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category._id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}

async function loadExpenses() {
    try {
        const expenses = await apiFetch('/expenses');
        displayExpenses(expenses);
    } catch (error) {
        console.error("Error al cargar gastos:", error);
    }
}

function displayExpenses(expenses) {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    if (!expenses.length) {
        expensesList.innerHTML = '<p>No hay gastos registrados</p>';
        return;
    }

    expenses.forEach(expense => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'expense-item';
        expenseElement.innerHTML = `
            <h3>${expense.title}</h3>
            <p>Monto: $${expense.amount.toFixed(2)}</p>
            <p>Fecha: ${new Date(expense.date).toLocaleDateString()}</p>
            <p>Categoría: ${expense.category.name}</p>
            <button onclick="deleteExpense('${expense._id}')">Eliminar</button>
        `;
        expensesList.appendChild(expenseElement);
    });
}

function setupEventListeners() {
    const form = document.getElementById('expenseForm');
    form.addEventListener('submit', handleCreateExpense);
}

async function handleCreateExpense(e) {
    e.preventDefault();
    
    try {
        const expense = {
            title: document.getElementById('expenseTitle').value,
            amount: parseFloat(document.getElementById('expenseAmount').value),
            date: document.getElementById('expenseDate').value,
            category: document.getElementById('expenseCategory').value
        };

        await apiFetch('/expenses', 'POST', expense);
        e.target.reset();
        await loadExpenses();
    } catch (error) {
        console.error("Error al crear gasto:", error);
        alert('Error al crear el gasto: ' + error.message);
    }
}

// Función global para eliminar gastos
window.deleteExpense = async function(id) {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return;
    
    try {
        await apiFetch(`/expenses/${id}`, 'DELETE');
        await loadExpenses();
    } catch (error) {
        console.error("Error al eliminar gasto:", error);
        alert('Error al eliminar el gasto: ' + error.message);
    }
};