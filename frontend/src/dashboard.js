import { apiFetch } from './utils/api.js';
import { checkAuth } from './utils/main.js';

// Elementos del DOM
const elements = {
  summaryCards: document.getElementById('summary-cards'),
  recentExpenses: document.getElementById('recent-expenses'),
  categoryChart: document.getElementById('category-chart'),
  quickActions: document.getElementById('quick-actions')
};

document.addEventListener('DOMContentLoaded', async () => {
  if (!await checkAuth()) return;

  try {
    await loadDashboardData();
    setupQuickActions();
  } catch (error) {
    console.error('Error loading dashboard:', error);
    alert('Error al cargar el dashboard: ' + error.message);
  }
});

async function loadDashboardData() {
  const [summary, expenses, categories] = await Promise.all([
    getFinancialSummary(),
    getRecentExpenses(5),
    getCategoryStats()
  ]);

  renderSummaryCards(summary);
  renderRecentExpenses(expenses);
  renderCategoryChart(categories);
}

// Funciones para obtener datos
async function getFinancialSummary() {
  return await apiFetch('/expenses/summary');
}

async function getRecentExpenses(limit = 5) {
  return await apiFetch(`/expenses/recent?limit=${limit}`);
}

async function getCategoryStats() {
  return await apiFetch('/categories/stats');
}

// Funciones de renderizado
function renderSummaryCards({ totalSpent, monthlyAverage, categoryCount }) {
  elements.summaryCards.innerHTML = `
    <div class="card">
      <h3>Gasto Total</h3>
      <p>$${totalSpent.toFixed(2)}</p>
    </div>
    <div class="card">
      <h3>Promedio Mensual</h3>
      <p>$${monthlyAverage.toFixed(2)}</p>
    </div>
    <div class="card">
      <h3>Categorías</h3>
      <p>${categoryCount}</p>
    </div>
  `;
}

function renderRecentExpenses(expenses) {
  elements.recentExpenses.innerHTML = expenses.map(expense => `
    <div class="expense-item">
      <span>${expense.title}</span>
      <span>$${expense.amount.toFixed(2)}</span>
      <span>${new Date(expense.date).toLocaleDateString()}</span>
    </div>
  `).join('');
}

function renderCategoryChart(categories) {
  // Usar Chart.js o similar para gráficos
  const ctx = elements.categoryChart.getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories.map(c => c.name),
      datasets: [{
        data: categories.map(c => c.total),
        backgroundColor: categories.map((_, i) =>
          `hsl(${(i * 360 / categories.length)}, 70%, 50%)`)
      }]
    }
  });
}

function setupQuickActions() {
  elements.quickActions.innerHTML = `
    <button id="btn-add-expense">➕ Nuevo Gasto</button>
    <button id="btn-manage-categories">🏷️ Administrar Categorías</button>
  `;

  document.getElementById('btn-add-expense').addEventListener('click', () => {
    window.location.href = 'expenses.html?action=create';
  });

  document.getElementById('btn-manage-categories').addEventListener('click', () => {
    window.location.href = 'categories.html';
  });



