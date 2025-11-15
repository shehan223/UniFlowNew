// server/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const canteenRoutes = require("./routes/canteenRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const FoodItem = require("./models/FoodItem");
const seedItems = require("./seed/canteenSeed");

const app = express();

app.use(cors());
app.use(express.json());

const ensureCanteenSeed = async () => {
  const count = await FoodItem.countDocuments();
  if (count === 0) {
    await FoodItem.insertMany(seedItems);
    console.log("Inserted canteen seed data.");
  }
};

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/canteen", canteenRoutes);
app.use("/api/notices", noticeRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    await ensureCanteenSeed();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

startServer();
