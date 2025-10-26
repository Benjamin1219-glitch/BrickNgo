const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  price: String
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: String,
  price: String,
  variants: [variantSchema]  // Array of sub-brands
});

module.exports = mongoose.model("Product", productSchema);
