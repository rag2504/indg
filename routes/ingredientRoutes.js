const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');

// Predefined list of available ingredients
const availableIngredients = [
    "ALMONDS", "AJWAIN", "ASAFOETIDA", "BABY POTATO", "BAKING POWDER", "BASMATI RICE", "BEANS", "BELL PEPPERS",
    "BHINDI", "BIRYANI MASALA", "BOTTLE GOURD", "BUTTER", "CABBAGE", "CARROT", "CASHEWS", "CHANA DAL", "CHICKEN",
    "CHICKPEAS", "CINNAMON", "CLOVES", "COCONUT", "COCONUT MILK", "CORIANDER", "CORIANDER POWDER", "CORN", "CORN FLOUR",
    "CREAM", "CUMIN", "CUMIN POWDER", "CURD", "CURRY LEAVES", "DRUMSTICK", "EGGS", "EGGPLANT", "FENUGREEK LEAVES",
    "FENNEL SEEDS", "FISH", "GARLIC", "GARAM MASALA", "GHEE", "GINGER", "GRAM FLOUR", "GRATED COCONUT", "GREEN CARDAMOM",
    "GREEN CHILIES", "GREEN PEAS", "JAGGERY", "KASHMIRI RED CHILI POWDER", "LEMON", "LOBIA", "MASOOR DAL", "MINCED MUTTON",
    "MOONG DAL", "MUSHROOMS", "MUSTARD SEEDS", "MUTTON", "OIL", "ONION", "PANEER", "PEAS", "POTATO", "PRAWNS", "PULAO MASALA",
    "PUMPKIN", "RAISINS", "RAJMA", "RED CHILI POWDER", "RICE", "RICE FLOUR", "SALT", "SAMBAR POWDER", "SAMOSA PASTRY SHEETS",
    "SAFFRON", "SCHEZWAN SAUCE", "SOY SAUCE", "SPINACH", "TAMARIND", "TAMARIND PASTE", "TEA BAG", "TINDORA", "TOOR DAL",
    "TOMATO", "TURMERIC", "URAD DAL", "WATER", "WHEAT FLOUR", "YOGURT"
];

// ✅ Route to get the predefined list of ingredients
router.get('/available', (req, res) => {
    res.json({ ingredients: availableIngredients });
});

// ✅ Route to select 3 or more ingredients
router.post('/select', async (req, res) => {
    const { selectedIngredients } = req.body;

    // Check if at least 3 ingredients are selected
    if (!Array.isArray(selectedIngredients) || selectedIngredients.length < 3) {
        return res.status(400).json({ message: "Please select at least 3 ingredients." });
    }

    // Validate that all selected ingredients exist in the predefined list
    const invalidIngredients = selectedIngredients.filter(ing => !availableIngredients.includes(ing));

    if (invalidIngredients.length > 0) {
        return res.status(400).json({ message: `Invalid ingredients selected: ${invalidIngredients.join(", ")}` });
    }

    try {
        let newIngredients = [];

        for (const name of selectedIngredients) {
            // ✅ Check if ingredient already exists in MongoDB
            const existingIngredient = await Ingredient.findOne({ name });

            if (!existingIngredient) {
                // ✅ Insert new ingredient if it's NOT in MongoDB
                const ingredient = new Ingredient({ name, quantity: "N/A" });
                await ingredient.save();
                newIngredients.push(name);
            }
        }

        // ✅ Send a message whether new ingredients were saved or not
        if (newIngredients.length === 0) {
            return res.status(200).json({ message: "These ingredients are already selected before." });
        } else {
            return res.status(201).json({ message: "New ingredients saved successfully", newIngredients });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error processing ingredients", error: error.message });
    }
});

// ✅ Route to get all selected ingredients from MongoDB
router.get('/', async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Route to delete an ingredient by ID
router.delete('/:id', async (req, res) => {
    try {
        await Ingredient.findByIdAndDelete(req.params.id);
        res.json({ message: 'Ingredient deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
