document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login.html"; // Redirige si no hay token

    // Obtener datos del usuario (ejemplo)
    fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(user => {
        document.getElementById("username").textContent = user.name;
    });

    // Enviar Gasto
    document.getElementById("expenseForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const amount = document.getElementById("amount").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;

        fetch("/api/expenses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ amount, description, category })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) alert(data.error);
            else alert("Gasto registrado exitosamente!");
        });
    });

    // Enviar Categoría
    document.getElementById("categoryForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("categoryName").value;

        fetch("/api/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) alert(data.error);
            else alert("Categoría creada exitosamente!");
        });
    });
});