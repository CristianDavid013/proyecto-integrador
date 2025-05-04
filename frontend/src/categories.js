import { apiFetch } from "./utils/api.js";
import { checkAuth } from "./utils/main.js";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verificar autenticación de manera asíncrona
        if (!await checkAuth()) {
            return;
        }
        await loadCategories();
        setupEventListeners();
    } catch (error) {
        console.error("Error en la inicialización:", error);
    }
});

function setupEventListeners() {
    const form = document.getElementById('categoryForm');
    if (form) {
        form.addEventListener('submit', handleCreateCategory);
    }
}

async function handleCreateCategory(event) {
    event.preventDefault();
    const categoryName = document.getElementById('categoryName').value.trim();

    if (!categoryName) {
        alert("El nombre de la categoría no puede estar vacío");
        return;
    }

    try {
        await apiFetch("/categories", "POST", { name: categoryName });
        document.getElementById('categoryName').value = '';
        await loadCategories();
    } catch (error) {
        console.error("Error al crear categoría:", error);
        alert(`Error: ${error.message}`);
    }
}

async function loadCategories() {
    try {
        const categories = await apiFetch("/categories", "GET");
        displayCategories(categories);
    } catch (error) {
        console.error("Error al cargar categorías:", error);
        alert(`Error: ${error.message}`);
    }
}

function displayCategories(categories) {
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = '';

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-item';
        categoryDiv.innerHTML = `
            <span>${category.name}</span>
            <div class="category-buttons">
                <button onclick="deleteCategory('${category._id}')">Eliminar</button>
                <button onclick="editCategory('${category._id}', '${category.name}')">Editar</button>
            </div>
        `;
        categoriesList.appendChild(categoryDiv);
    });
}

async function deleteCategory(id) {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
        await apiFetch(`/categories/${id}`, "DELETE");
        await loadCategories();
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        alert(`Error: ${error.message}`);
    }
}

async function editCategory(id, currentName) {
    const newName = prompt("Ingrese el nuevo nombre de la categoría:", currentName);
    if (!newName || newName === currentName) return;
    
    try {
        await apiFetch(`/categories/${id}`, "PUT", { name: newName });
        await loadCategories();
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        alert(`Error: ${error.message}`);
    }
}

document.getElementById('categoryForm').addEventListener('submit', handleCreateCategory);

window.deleteCategory = deleteCategory;
window.editCategory = editCategory;