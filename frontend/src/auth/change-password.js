const form = document.getElementById("changePasswordForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (newPassword.length < 6) {
    return alert("La contraseña debe tener al menos 6 caracteres.");
  }

  if (newPassword !== confirmPassword) {
    return alert("Las contraseñas no coinciden.");
  }

  try {
    const resetToken = localStorage.getItem("resetToken");
    const userEmail = localStorage.getItem("userEmail"); // Si decides guardar también el email

    const res = await fetch("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: resetToken, email: userEmail, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al cambiar la contraseña");
    }

    alert(data.message || "Contraseña actualizada correctamente.");
    localStorage.removeItem("resetToken");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  } catch (error) {
    alert("Error: " + error.message);
  }
});
