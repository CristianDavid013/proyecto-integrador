const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El título del gasto es obligatorio"],
    trim: true, // Elimina espacios innecesarios
  },
  amount: {
    type: Number,
    required: [true, "El monto del gasto es obligatorio"],
    min: [0, "El monto del gasto debe ser positivo"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "La categoría es obligatoria"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El usuario es obligatorio"],
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
