const express = require("express");
const FoodItem = require("../models/FoodItem");
const seedItems = require("../seed/canteenSeed");

const router = express.Router();

const buildPlaceholder = (name = "canteen") =>
  `https://picsum.photos/seed/${encodeURIComponent(name)}-${Date.now()}/600/450`;

const sanitizePayload = (payload = {}) => {
  const {
    name,
    category,
    priceLkr,
    quantity,
    description,
    available,
    isToday,
    photoUrl,
    emoji,
  } = payload;

  return {
    name: typeof name === "string" ? name.trim() : undefined,
    category,
    priceLkr,
    quantity,
    description,
    available,
    isToday,
    photoUrl:
      typeof photoUrl === "string" && photoUrl.trim()
        ? photoUrl.trim()
        : buildPlaceholder(name),
    emoji,
  };
};

router.get("/items", async (req, res, next) => {
  try {
    const items = await FoodItem.find().sort({ updatedAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.get("/stats", async (req, res, next) => {
  try {
    const items = await FoodItem.find();
    const totalItems = items.length;
    const availableToday = items.filter((item) => item.isToday && item.available).length;
    const unavailable = items.filter((item) => !item.available).length;
    const totalStock = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

    res.json({ totalItems, availableToday, unavailable, totalStock });
  } catch (error) {
    next(error);
  }
});

router.post("/items", async (req, res, next) => {
  try {
    const payload = sanitizePayload(req.body);
    if (!payload.name) {
      return res.status(400).json({ message: "Food name is required." });
    }
    if (typeof payload.priceLkr !== "number") {
      return res.status(400).json({ message: "priceLkr must be a number." });
    }
    if (typeof payload.quantity !== "number") {
      return res.status(400).json({ message: "quantity must be a number." });
    }

    const item = await FoodItem.create(payload);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

router.put("/items/:id", async (req, res, next) => {
  try {
    const payload = sanitizePayload(req.body);
    payload.updatedAt = new Date();
    const item = await FoodItem.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.patch("/items/:id/today", async (req, res, next) => {
  try {
    const { isToday } = req.body;
    if (typeof isToday !== "boolean") {
      return res.status(400).json({ message: "isToday must be boolean" });
    }
    const item = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { isToday, updatedAt: new Date() },
      { new: true },
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.delete("/items/:id", async (req, res, next) => {
  try {
    const deleted = await FoodItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/seed", async (req, res, next) => {
  try {
    const existing = await FoodItem.countDocuments();
    if (existing > 0) {
      return res.status(400).json({ message: "Seed already exists." });
    }
    await FoodItem.insertMany(seedItems);
    res.status(201).json({ message: "Seed data inserted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
