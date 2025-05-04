const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Expense = require("../models/Expense");
const validator = require("validator");

const router = express.Router();

// Crear un gasto
router.post("/create", auth, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // Validaciones básicas
    if (!title || !amount || !category) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (!validator.isDecimal(amount.toString())) {
      return res.status(400).json({ error: "El monto debe ser un número válido" });
    }

    // Crear el gasto
    const expense = new Expense({
      user: req.user.id, // Cambiado de userId a user
      title,
      amount,
      category,
      date: date || Date.now(),
    });

    await expense.save();
    
    res.status(201).json({ message: "Gasto creado con éxito", expense });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los gastos del usuario autenticado
router.get("/list", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }) // Cambiado de userId a user
      .populate('category') // Recomendado para obtener datos de la categoría
      .populate('user', '-password'); // Recomendado para datos básicos del usuario

    if (!expenses.length) {
      return res.status(404).json({ message: "No se encontraron gastos" });
    }

    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los gastos" });
  }
});

// Actualizar un gasto por ID
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user.id }, // Ya estaba correcto
      { title, amount, category, date },
      { new: true }
    ).populate('category');

    if (!expense) {
      return res.status(404).json({ error: "Gasto no encontrado" });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el gasto" });
  }
});

// Eliminar un gasto por ID
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findOneAndDelete({ 
      _id: id, 
      user: req.user.id // Cambiado de userId a user
    });

    if (!deletedExpense) {
      return res.status(404).json({ error: "Gasto no encontrado o no autorizado" });
    }

    res.status(200).json({ message: "Gasto eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el gasto" });
  }
});

module.exports = router;