// backend/routes/foodItems.js
const express = require("express");
const router = express.Router();
const FoodItem = require("../models/FoodItem");

// Search for food items by name, description, or category
router.get("/search", async (req, res) => {
  const { query } = req.query; // Query parameter for search term

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    // Search food by name, description, or category (case-insensitive)
    const foodItems = await FoodItem.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    });

    if (foodItems.length === 0) {
      return res.status(404).json({ message: "No food items found" });
    }

    res.json(foodItems);
  } catch (error) {
    console.error("Error searching food items:", error);
    res.status(500).json({ error: "An error occurred while searching for food items" });
  }
});

module.exports = router;
