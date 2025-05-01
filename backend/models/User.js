const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es obligatorio"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
});

// Encriptar la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  // Si la contraseña no ha sido modificada, pasa al siguiente middleware
  if (!this.isModified("password")) {
    return next();
  }

  // Generar el salt
  const salt = await bcrypt.genSalt(10);

  // Encriptar la contraseña con el salt generado
  this.password = await bcrypt.hash(this.password, salt);

  // Pasa al siguiente middleware
  next();
});

module.exports = mongoose.model("User", userSchema);
