const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Category = require("../models/Category");

// Crear una nueva categoría
router.post("/", auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre de la categoría es obligatorio" });
    }

    // Crear una nueva categoría y asignar el usuario autenticado
    const category = new Category({
      name,
      description,
      user: req.user.id, // Asignar el ID del usuario desde req.user
    });

    await category.save();
    res.status(201).json({ message: "Categoría creada con éxito", category });
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    res.status(500).json({ error: "Error al crear la categoría" });
  }
});

// Obtener las categorías del usuario autenticado
router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.json(categories);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
});

module.exports = router;


// http://localhost:5000/categories/