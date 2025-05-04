const resetForm = document.getElementById("resetForm");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");

let userEmail = "";

resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (step1.style.display !== "none") {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    try {
      const res = await fetch("/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Verificación fallida");
      }

      userEmail = email;
      step1.style.display = "none";
      step2.style.display = "block";
    } catch (error) {
      alert("Error: " + error.message);
    }

  } else {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword.length < 6) {
      return alert("La contraseña debe tener al menos 6 caracteres");
    }

    if (newPassword !== confirmPassword) {
      return alert("Las contraseñas no coinciden");
    }

    try {
      const res = await fetch("/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, newPassword }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al cambiar contraseña");
      }

      alert("Contraseña actualizada. Redirigiendo al inicio de sesión.");
      window.location.href = "/login";
    } catch (error) {
      alert("Error: " + error.message);
    }
  }
});
