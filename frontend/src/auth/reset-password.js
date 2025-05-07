const resetForm = document.getElementById("resetForm");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");

let userEmail = "";

resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Paso 1: Verificar nombre y correo
  if (step1.style.display !== "none") {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    try {
      const res = await fetch("/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verificación fallida");
      }

      userEmail = email;
      localStorage.setItem("resetToken", data.resetToken); // Guarda el token

      // Ir a página de cambio de contraseña
      window.location.href = "/change-password.html";
    } catch (error) {
      alert("Error: " + error.message);
    }

  } else {
    // Este bloque ya no es necesario si usas una página aparte para el cambio de contraseña
  }
});
