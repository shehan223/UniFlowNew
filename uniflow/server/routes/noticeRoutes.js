const express = require("express");
const Notice = require("../models/Notice");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, content, imageUrl, author } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required." });
    }
    const notice = await Notice.create({
      title: title.trim(),
      content: content.trim(),
      imageUrl,
      author: author?.trim() || "Hostel Administration",
    });
    res.status(201).json(notice);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { title, content, imageUrl, author } = req.body;
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title: title.trim() }),
        ...(content && { content: content.trim() }),
        imageUrl,
        author,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    );
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.json(notice);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
