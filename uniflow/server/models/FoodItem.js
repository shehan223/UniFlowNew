const mongoose = require("mongoose");

const CATEGORY_VALUES = [
  "Main Course",
  "Drinks",
  "Snacks",
  "Dessert",
  "Breakfast",
];

const FoodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: CATEGORY_VALUES,
      default: "Main Course",
    },
    priceLkr: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    available: { type: Boolean, default: true },
    isToday: { type: Boolean, default: false },
    photoUrl: { type: String, required: true, trim: true },
    emoji: { type: String },
  },
  { timestamps: true },
);

FoodItemSchema.index({ name: 1 });
FoodItemSchema.index({ isToday: 1, available: 1 });

module.exports = mongoose.model("FoodItem", FoodItemSchema);
