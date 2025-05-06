const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Category = require("../models/Category");

router.post("/", auth, async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({
            name,
            user: req.user.id // Asocia la categoría al usuario
        });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la categoría" });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const categories = await Category.find({user: req.user.id});
        res.json(categories);
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Error al obtener las categorias"})
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({error: "El nombre de la categoría es obligatorio"});
        }

        const category = await Category.findOneAndUpdate(
            { _id: id, user: req.user.id }, 
            { name }, 
            { new: true }
        );

        if (!category) {
            return res.status(404).json({error: "Categoria no encontrada"});
        }

        res.json(category);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findOneAndDelete({ 
            _id: id, 
            user: req.user.id 
        });

        if (!category) {
            return res.status(404).json({error: "Categoria no encontrada"});
        }

        res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({error: "Error al eliminar la categoria"});
    }
});

module.exports = router;