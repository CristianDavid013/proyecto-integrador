const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Expense = require("../models/Expense"); // Modelo de gastos
const validator = require("validator");

const router = express.Router();

// Crear un gasto
router.post("/create", auth, async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    // Validaciones básicas
    if (!title || !amount || !category) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (!validator.isDecimal(amount.toString())) {
      return res.status(400).json({ error: "El monto debe ser un número válido" });
    }

    // Crear el gasto
    const expense = new Expense({
      userId: req.user.id, // ID del usuario autenticado
      title,
      amount,
      category,
    });

    await expense.save();
    
    res.status(201).json({ message: "Gasto creado con éxito", expense: newExpense });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los gastos del usuario autenticado
router.get("/list", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });

    if (!expenses.length) {
      return res.status(404).json({ message: "No se encontraron gastos" });
    }

    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un gasto por ID
router.put("/update/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, date } = req.body;

    // Buscar y actualizar el gasto
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { description, amount, date },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Gasto no encontrado o no autorizado" });
    }

    res.status(200).json({ message: "Gasto actualizado con éxito", expense: updatedExpense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un gasto por ID
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar y eliminar el gasto
    const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deletedExpense) {
      return res.status(404).json({ error: "Gasto no encontrado o no autorizado" });
    }

    res.status(200).json({ message: "Gasto eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
