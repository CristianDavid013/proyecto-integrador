const express = require("express");
const auth = require("../middleware/auth");
const Expense = require("../models/Expense");

const router = express.Router();

// Crear un gasto (protegido)
router.post("/", auth, async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    if (!amount || !description || !category) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const expense = new Expense({
      amount,
      description,
      category,
      user: req.user.id
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el gasto" });
  }
});

// Obtener todos los gastos del usuario autenticado
router.get("/list", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .populate('category')
      .populate('user', '-password');

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
      { _id: id, user: req.user.id },
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
      user: req.user.id 
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
