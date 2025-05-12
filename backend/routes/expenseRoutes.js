const express = require("express");
const auth = require("../middleware/auth");
const Expense = require("../models/Expense");
const Category = require("../models/Category"); // Asegúrate de importar el modelo Category

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

// Obtener gastos recientes (para el dashboard)
router.get("/recent", auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const expenses = await Expense.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(limit)
      .populate('category');

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener gastos recientes" });
  }
});

// Resumen financiero (para el dashboard)
router.get("/summary", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener el total gastado
    const totalSpent = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Obtener el promedio mensual
    const monthlyAverage = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $month: "$date" },
          monthlyTotal: { $sum: "$amount" }
        }
      },
      { $group: { _id: null, average: { $avg: "$monthlyTotal" } } }
    ]);

    // Contar categorías únicas usadas
    const categoryCount = await Expense.distinct("category", { user: userId });

    res.json({
      totalSpent: totalSpent[0]?.total || 0,
      monthlyAverage: monthlyAverage[0]?.average || 0,
      categoryCount: categoryCount.length
    });
  } catch (error) {
    res.status(500).json({ error: "Error al generar el resumen" });
  }
});

// Estadísticas por categoría (para el dashboard)
router.get("/by-category", auth, async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      { $match: { user: req.user.id } },
      { $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }},
      { $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category"
      }},
      { $unwind: "$category" },
      { $project: {
        name: "$category.name",
        total: 1,
        count: 1
      }}
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estadísticas por categoría" });
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