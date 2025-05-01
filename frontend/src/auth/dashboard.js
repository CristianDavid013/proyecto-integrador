import { apiFetch } from "./utils/api.js";

// Verificar si el usuario está autenticado
function checkAuthentication() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Por favor, inicia sesión.");
    window.location.href = "login.html"; // Redirigir al login si no hay token
  }
  return token;
}

// Cargar categorías desde el backend
async function loadCategories(token) {
  try {
    const categories = await apiFetch("/categories", "GET", {
      Authorization: `Bearer ${token}`,
    });
    const categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = ""; // Limpiar la lista
    categories.forEach((category) => {
      const li = document.createElement("li");
      li.textContent = category.name;
      categoryList.appendChild(li);
    });
  } catch (error) {
    console.error("Error cargando categorías:", error);
  }
}

// Cargar gastos desde el backend
async function loadExpenses(token) {
  try {
    const expenses = await apiFetch("/expenses", "GET", {
      Authorization: `Bearer ${token}`,
    });
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = ""; // Limpiar la lista
    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.textContent = `${expense.description}: $${expense.amount}`;
      expenseList.appendChild(li);
    });
  } catch (error) {
    console.error("Error cargando gastos:", error);
  }
}

// Crear una nueva categoría
async function handleCategorySubmit(event) {
  event.preventDefault();
  const token = checkAuthentication();
  const name = document.getElementById("categoryName").value;
  try {
    await apiFetch("/categories", "POST", { name }, {
      Authorization: `Bearer ${token}`,
    });
    alert("Categoría creada exitosamente.");
    loadCategories(token); // Recargar categorías después de crear una nueva
  } catch (error) {
    console.error("Error creando categoría:", error);
  }
}

// Crear un nuevo gasto
async function handleExpenseSubmit(event) {
  event.preventDefault();
  const token = checkAuthentication();
  const description = document.getElementById("expenseDescription").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  try {
    await apiFetch("/expenses", "POST", { description, amount }, {
      Authorization: `Bearer ${token}`,
    });
    alert("Gasto registrado exitosamente.");
    loadExpenses(token); // Recargar gastos después de crear uno nuevo
  } catch (error) {
    console.error("Error creando gasto:", error);
  }
}

// Cerrar sesión
function handleLogout() {
  localStorage.removeItem("authToken");
  window.location.href = "login.html"; // Redirigir a la página de login
}

document.getElementById("categoryForm").addEventListener("submit", handleCategorySubmit);
document.getElementById("expenseForm").addEventListener("submit", handleExpenseSubmit);
document.getElementById("logoutButton").addEventListener("click", handleLogout);

// Al cargar la página, verificar autenticación y cargar categorías y gastos
const token = checkAuthentication();
loadCategories(token);
loadExpenses(token);
