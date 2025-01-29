const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    default: "N/A",
  },
  description: {
    type: String,
  },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;
